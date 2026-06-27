const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PHOTO_EXTENSIONS, VIDEO_EXTENSIONS } = require('../utils/constants');
const redisClient = require('../config/redis');

/**
 * Factory function to create a media controller for a specific resource.
 * @param {string} resourceName - The name of the resource (e.g., 'projects', 'events').
 */
const createResourceMediaController = (resourceName) => {
    const getResourceDir = (id) => path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', resourceName, String(id));

    const getMediaType = (filename) => {
        const ext = path.extname(filename).toLowerCase();
        if (PHOTO_EXTENSIONS.includes(ext)) return 'photo';
        if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
        return 'other';
    };

    return {
        /** Get all media files for a resource instance */
        getMedia: async (req, res) => {
            try {
                const { id } = req.params;
                const resourceDir = getResourceDir(id);

                if (!fsSync.existsSync(resourceDir)) {
                    return res.status(200).json({ success: true, files: [] });
                }

                const files = await fs.readdir(resourceDir);
                const fileList = await Promise.all(files.map(async (file) => {
                    const stats = await fs.stat(path.join(resourceDir, file));
                    return {
                        name: file,
                        url: `/api/${resourceName}/${id}/media/${file}?t=${stats.mtimeMs}`,
                        type: getMediaType(file)
                    };
                }));

                res.status(200).json({ success: true, files: fileList });
            } catch (error) {
                console.error(`Error fetching ${resourceName} media:`, error);
                res.status(500).json({ success: false, message: 'Failed to fetch media' });
            }
        },

        /** Upload media files to a resource instance */
        uploadMedia: async (req, res) => {
            try {
                const { id } = req.params;
                const resourceDir = getResourceDir(id);

                if (!fsSync.existsSync(resourceDir)) {
                    await fs.mkdir(resourceDir, { recursive: true });
                }

                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ success: false, message: 'No files uploaded' });
                }

                const uploadPromises = req.files.map(async (file) => {
                    const type = getMediaType(file.originalname);
                    let finalFilename = file.originalname;
                    let targetPath = path.join(resourceDir, finalFilename);

                    if (type === 'photo') {
                        const baseName = path.parse(file.originalname).name;
                        finalFilename = `${baseName}.webp`;
                        targetPath = path.join(resourceDir, finalFilename);

                        await sharp(file.path)
                            .resize({ width: 1200, withoutEnlargement: true })
                            .toFormat('webp', { quality: 80 })
                            .toFile(targetPath);

                        await fs.unlink(file.path).catch(err => console.error("Temp cleanup failed:", err));
                    } else {
                        // For videos or other media
                        await fs.copyFile(file.path, targetPath);
                        await fs.unlink(file.path).catch(err => console.error("Temp cleanup failed:", err));
                    }

                    return {
                        name: finalFilename,
                        url: `/api/${resourceName}/${id}/media/${finalFilename}`,
                        type: type
                    };
                });

                const uploadedFiles = await Promise.all(uploadPromises);

                // Invalidate resource cache
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${resourceName}`);

                res.status(200).json({ success: true, files: uploadedFiles });
            } catch (error) {
                console.error(`Error uploading ${resourceName} media:`, error);
                res.status(500).json({ success: false, message: 'Upload failed' });
            }
        },

        /** Delete a media file from a resource instance */
        deleteMedia: async (req, res) => {
            try {
                const { id, filename } = req.params;
                const filePath = path.join(getResourceDir(id), filename);

                if (fsSync.existsSync(filePath)) {
                    await fs.unlink(filePath);

                    // Invalidate resource cache
                    await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${resourceName}`);

                    res.status(200).json({ success: true, message: 'File deleted' });
                } else {
                    res.status(404).json({ success: false, message: 'File not found' });
                }
            } catch (error) {
                console.error(`Error deleting ${resourceName} media:`, error);
                res.status(500).json({ success: false, message: 'Delete failed' });
            }
        },

        /** Delete multiple media files from a resource instance */
        bulkDeleteMedia: async (req, res) => {
            try {
                const { id } = req.params;
                const { filenames } = req.body;

                if (!filenames || !Array.isArray(filenames)) {
                    return res.status(400).json({ success: false, message: 'Filenames array required' });
                }

                const resourceDir = getResourceDir(id);
                const results = await Promise.all(filenames.map(async (filename) => {
                    const filePath = path.join(resourceDir, filename);
                    if (fsSync.existsSync(filePath)) {
                        await fs.unlink(filePath);
                        return { filename, success: true };
                    }
                    return { filename, success: false, message: 'Not found' };
                }));

                // Invalidate resource cache
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:${resourceName}`);

                res.status(200).json({ success: true, results });
            } catch (error) {
                console.error(`Error bulk deleting ${resourceName} media:`, error);
                res.status(500).json({ success: false, message: 'Bulk delete failed' });
            }
        },

        /** Serve a resource media file */
        getSingleMedia: async (req, res) => {
            try {
                const { id, filename } = req.params;
                const resourceDir = getResourceDir(id);
                let filePath = path.join(resourceDir, filename);

                // 1. Try exact match
                if (fsSync.existsSync(filePath)) {
                    return res.sendFile(filePath);
                }

                // 2. Try with different extension if original filename not found
                try {
                    const baseName = path.parse(filename).name;
                    const files = await fs.readdir(resourceDir);
                    const matchingFile = files.find(f => path.parse(f).name === baseName);

                    if (matchingFile) {
                        filePath = path.join(resourceDir, matchingFile);
                        return res.sendFile(filePath);
                    }
                } catch (err) {
                    // Directory might not exist or be readable
                }

                // 3. Fail gracefully without triggering CORB
                res.status(404).end();
            } catch (error) {
                console.error(`Error serving ${resourceName} media:`, error);
                res.status(500).end();
            }
        }
    };
};

module.exports = createResourceMediaController;
