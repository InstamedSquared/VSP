const { hashPassword, comparePassword } = require('../hash_password');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const redisClient = require('../config/redis');
const { processHtmlMedia } = require('../utils/htmlMediaProcessor');

const { scanResourceMedia } = require('../utils/mediaScanner');

const processImage = async (file, config, customName = null) => {
    if (!file) { return null; }
    if (!config) { return file; }

    let sharpInstance = sharp(file.path);

    if (config.resize !== false) {
        const resizeOptions = {
            width: config.width || 800,
            height: config.height,
            fit: 'cover',
        };
        sharpInstance = sharpInstance.resize(resizeOptions);
    }

    const targetFormat = config.format || 'webp';
    const targetQuality = config.quality || 80;
    sharpInstance = sharpInstance.toFormat(targetFormat, { quality: targetQuality });

    // Use customName if provided, otherwise use original filename
    const baseName = customName ? customName : path.parse(file.originalname).name;
    const newFilename = `${baseName}.${targetFormat}`;

    // const newFilename = `processed-${file.filename}.${targetFormat}`;
    const processedImagePath = path.join(path.dirname(file.path), newFilename);

    try {
        await sharpInstance.toFile(processedImagePath);
        return { path: processedImagePath, originalname: newFilename };
    }
    catch (error) { console.error('Image processing failed:', error); throw error; }
    finally { await fs.unlink(file.path).catch(err => console.error("Failed to cleanup original temp file:", err)); }
};

const createResourceController = (model, resourceName) => ({

    getAll: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '', sortBy = 'id', sortOrder = 'asc', searchableColumns, _t, ...filters } = req.query;

            const tableName = model.tableName;
            const prefix = process.env.REDIS_PREFIX || '';
            const versionKey = `${prefix}resource_version:${tableName}`;
            let version = await redisClient.get(versionKey);
            if (!version) {
                version = 1;
                await redisClient.set(versionKey, version);
            }

            const queryString = JSON.stringify(req.query);
            const cacheKey = `${prefix}resource:${tableName}:v${version}:${queryString}`;

            const cachedResult = await redisClient.get(cacheKey);
            if (cachedResult) {
                return res.status(200).json(JSON.parse(cachedResult));
            }

            const result = await model.getPaged({ page: parseInt(page, 10), limit: parseInt(limit, 10), search, searchableColumns: searchableColumns ? searchableColumns.split(',') : [], filters, sortBy, sortOrder, });

            // Media Enrichment logic
            if (model.mediaScan && result.data && result.data.length > 0) {
                result.data = await Promise.all(result.data.map(async (record) => {
                    const mediaFlags = await scanResourceMedia(resourceName, record.id);
                    return { ...record, ...mediaFlags };
                }));
            }

            await redisClient.set(cacheKey, JSON.stringify(result), { EX: 3600 }); // Cache for 1 hour

            // console.log('result',result);   // jeric
            res.status(200).json(result);
        } catch (error) { console.error(`Error fetching paginated records from ${model.tableName}`, error); res.status(500).json({ message: 'Error fetching records', error: error.message }); }
    },
    create: async (req, res) => {
        try {
            const data = req.body;
            if (data.pw) { data.pw = await hashPassword(data.pw); }
            else { delete data.pw; }

            const customFilename = data.customFilename;
            delete data.customFilename; // Remove from data to be inserted into DB

            // Process any HTML/Base64 in fields
            const storagePath = path.resolve(process.env.PHOTO_STORAGE_PATH, 'media');
            for (const key in data) {
                if (typeof data[key] === 'string' && data[key].includes('data:image/')) {
                    data[key] = await processHtmlMedia(data[key], storagePath);
                }
            }

            const fileToSave = await processImage(req.file, model.fileConfig?.imageProcessing, customFilename);
            const newRecord = await model.insert(data, fileToSave);

            // Invalidate cache
            await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);

            res.status(201).json(newRecord);
        }
        catch (error) { res.status(500).json({ message: `Error creating record for ${model.tableName}`, error: error.message }); }
    },

    update: async (req, res) => {
        try {
            const entityId = req.params.id;
            const data = req.body;
            const file = req.file;

            const updateLog = data.updateLog;
            delete data.updateLog;
            const logData = (updateLog && updateLog !== 'false') ? { userId: req.user?.id || null } : null;

            // Mapping: 'password' -> 'pw'
            if (data.password) {
                data.pw = data.password;
                delete data.password;
            }

            // Username Uniqueness Verification
            if (data.un) {
                const [existingUser] = await model.select(['id'], { un: data.un });
                if (existingUser && String(existingUser.id) !== String(entityId)) {
                    return res.status(200).json({ success: false, message: 'Username already exists' });
                }
            }

            // Old Password Verification
            if (data.old_password) {
                const [record] = await model.select(['pw'], { id: entityId });
                if (!record) {
                    return res.status(404).json({ success: false, message: 'Record not found.' });
                }

                // Check if current password is valid
                const isValid = await comparePassword(data.old_password, record.pw);
                if (!isValid) {
                    return res.status(200).json({ success: false, message: 'Invalid Password' }); // Returning 200 with success:false as per app convention
                }

                // Remove old_password so it's not sent to DB update
                delete data.old_password;
            }

            if (data.pw) { data.pw = await hashPassword(data.pw); }
            else { delete data.pw; }

            const customFilename = data.customFilename;
            delete data.customFilename; // Remove from data to be updated in DB

            // Process any HTML/Base64 in fields
            const storagePath = path.resolve(process.env.PHOTO_STORAGE_PATH, 'media');
            for (const key in data) {
                if (typeof data[key] === 'string' && data[key].includes('data:image/')) {
                    data[key] = await processHtmlMedia(data[key], storagePath);
                }
            }

            const fileToSave = await processImage(req.file, model.fileConfig?.imageProcessing, customFilename);
            const updatedCount = await model.update({ id: entityId }, data, fileToSave, logData);
            //const updatedCount = await model.update({ id: entityId }, data, file);

            if (updatedCount > 0) {
                // Invalidate cache
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);
                // jeric    // server side updates

                const [updatedRecord] = await model.select(model.allowedColumns, { id: entityId }, { withPhotoUrl: true });
                //console.log('update',updatedRecord);

                res.status(200).json({ success: true, message: 'Record updated successfully.', data: updatedRecord });
            }
            else { res.status(404).json({ success: false, message: 'Record not found.' }); }
        }
        catch (error) { console.error(`Update Error for ${model.tableName}:`, error); res.status(500).json({ success: false, message: 'An error occurred while updating the record.' }); }
    },

    remove: async (req, res) => {
        try {
            const { deleteLog } = req.body;
            const logData = (deleteLog !== false) ? {
                userId: req.user?.id || null
            } : null;

            const result = await model.softDelete({ id: req.params.id }, logData);
            if (result > 0) {
                // Invalidate cache
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);

                res.status(200).json({ success: true, message: 'Record deleted successfully.' });
            }
            else { res.status(404).json({ success: false, message: 'Record not found.' }); }
        }
        catch (error) { res.status(500).json({ success: false, message: `Error deleting record from ${model.tableName}`, error: error.message }); }
    },

    archive: async (req, res) => {
        try {
            const { archivedLog } = req.body;
            const logData = (archivedLog !== false) ? {
                userId: req.user?.id || null
            } : null;

            const result = await model.archive({ id: req.params.id }, logData);
            if (result > 0) {
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);
                res.status(200).json({ success: true, message: 'Record archived successfully.' });
            }
            else { res.status(404).json({ success: false, message: 'Record not found.' }); }
        }
        catch (error) { res.status(500).json({ success: false, message: `Error archiving record`, error: error.message }); }
    },

    unarchive: async (req, res) => {
        try {
            const result = await model.unarchive({ id: req.params.id });
            if (result > 0) {
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);
                res.status(200).json({ success: true, message: 'Record unarchived successfully.' });
            }
            else { res.status(404).json({ success: false, message: 'Record not found.' }); }
        }
        catch (error) { res.status(500).json({ success: false, message: `Error unarchiving record`, error: error.message }); }
    },

    undelete: async (req, res) => {
        try {
            const result = await model.undelete({ id: req.params.id });
            if (result > 0) {
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${model.tableName}`);
                res.status(200).json({ success: true, message: 'Record restored successfully.' });
            }
            else { res.status(404).json({ success: false, message: 'Record not found.' }); }
        }
        catch (error) { res.status(500).json({ success: false, message: `Error restoring record`, error: error.message }); }
    },
});

module.exports = createResourceController;