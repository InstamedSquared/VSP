const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const sharp = require('sharp');
const { scanProjectMedia } = require('../utils/mediaScanner');
const { PHOTO_EXTENSIONS, VIDEO_EXTENSIONS } = require('../utils/constants');
const redisClient = require('../config/redis');

const projectMediaController = {
    /** Get all media files for a project */
    getProjectMedia: async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'projects', String(projectId));

            if (!fsSync.existsSync(projectDir)) {
                return res.status(200).json({ success: true, files: [] });
            }

            const files = await fs.readdir(projectDir);
            const fileList = await Promise.all(files.map(async (file) => {
                const stats = await fs.stat(path.join(projectDir, file));
                return {
                    name: file,
                    url: `/api/projects/${projectId}/media/${file}?t=${stats.mtimeMs}`,
                    type: getMediaType(file)
                };
            }));

            res.status(200).json({ success: true, files: fileList });
        } catch (error) {
            console.error('Error fetching project media:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch media' });
        }
    },

    /** Upload media files to a project */
    uploadProjectMedia: async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'projects', String(projectId));

            if (!fsSync.existsSync(projectDir)) {
                await fs.mkdir(projectDir, { recursive: true });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: 'No files uploaded' });
            }

            const uploadPromises = req.files.map(async (file) => {
                const type = getMediaType(file.originalname);
                let finalFilename = file.originalname;
                let targetPath = path.join(projectDir, finalFilename);

                if (type === 'photo') {
                    const baseName = path.parse(file.originalname).name;
                    finalFilename = `${baseName}.webp`;
                    targetPath = path.join(projectDir, finalFilename);

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
                    url: `/api/projects/${projectId}/media/${finalFilename}`,
                    type: type
                };
            });

            const uploadedFiles = await Promise.all(uploadPromises);

            // Invalidate projects cache
            await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:projects`);

            res.status(200).json({ success: true, files: uploadedFiles });
        } catch (error) {
            console.error('Error uploading project media:', error);
            res.status(500).json({ success: false, message: 'Upload failed' });
        }
    },

    /** Delete a media file from a project */
    deleteProjectMedia: async (req, res) => {
        try {
            const { projectId, filename } = req.params;
            const filePath = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'projects', String(projectId), filename);

            if (fsSync.existsSync(filePath)) {
                await fs.unlink(filePath);

                // Invalidate projects cache
                await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:projects`);

                res.status(200).json({ success: true, message: 'File deleted' });
            } else {
                res.status(404).json({ success: false, message: 'File not found' });
            }
        } catch (error) {
            console.error('Error deleting project media:', error);
            res.status(500).json({ success: false, message: 'Delete failed' });
        }
    },

    /** Delete multiple media files from a project */
    bulkDeleteProjectMedia: async (req, res) => {
        try {
            const { projectId } = req.params;
            const { filenames } = req.body;

            if (!filenames || !Array.isArray(filenames)) {
                return res.status(400).json({ success: false, message: 'Filenames array required' });
            }

            const projectDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'projects', String(projectId));
            const results = await Promise.all(filenames.map(async (filename) => {
                const filePath = path.join(projectDir, filename);
                if (fsSync.existsSync(filePath)) {
                    await fs.unlink(filePath);
                    return { filename, success: true };
                }
                return { filename, success: false, message: 'Not found' };
            }));

            // Invalidate projects cache
            await redisClient.incr(`${process.env.REDIS_PREFIX || ''}resource_version:projects`);

            res.status(200).json({ success: true, results });
        } catch (error) {
            console.error('Error bulk deleting project media:', error);
            res.status(500).json({ success: false, message: 'Bulk delete failed' });
        }
    },

    /** Serve a project media file */
    getSingleMedia: async (req, res) => {
        try {
            const { projectId, filename } = req.params;
            const projectDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'projects', String(projectId));
            let filePath = path.join(projectDir, filename);

            // 1. Try exact match
            if (fsSync.existsSync(filePath)) {
                return res.sendFile(filePath);
            }

            // 2. Try with different extension if original filename not found
            // (e.g. if requested 2.jpg but only 2.webp exists due to conversion)
            try {
                const baseName = path.parse(filename).name;
                const files = await fs.readdir(projectDir);
                const matchingFile = files.find(f => path.parse(f).name === baseName);

                if (matchingFile) {
                    filePath = path.join(projectDir, matchingFile);
                    return res.sendFile(filePath);
                }
            } catch (err) {
                // Directory might not exist or be readable
            }

            // 3. Fail gracefully without triggering CORB
            // Sending an empty response with 404 is safer than sending a JSON/Text body
            res.status(404).end();
        } catch (error) {
            console.error('Error serving project media:', error);
            res.status(500).end();
        }
    }
};

function getMediaType(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (PHOTO_EXTENSIONS.includes(ext)) return 'photo';
    if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
    return 'other';
}

module.exports = projectMediaController;
