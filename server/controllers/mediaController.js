const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const sharp = require('sharp');
const { PHOTO_EXTENSIONS } = require('../utils/constants');

/**
 * Sanitizes a filename to be safe for the filesystem and easy to read.
 * - Converts to lowercase
 * - Replaces spaces with underscores
 * - Removes special characters (keeps a-z, 0-9, _, -, .)
 * @param {string} name - Original filename (without extension).
 * @returns {string} - Sanitized base name.
 */
const sanitizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_\-]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
};

/**
 * Resolves the physical path of the media directory scoped to project and type.
 * @param {string|number|null} projectId - The project ID context.
 * @param {string} filename - The file name to check extension.
 * @returns {string} - Resolved absolute directory path.
 */
const getMediaDirectory = (projectId, filename) => {
    const basePath = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage');
    const ext = path.extname(filename).toLowerCase();
    const folder = PHOTO_EXTENSIONS.includes(ext) ? 'photos' : 'videos';
    
    if (projectId && projectId !== '0' && projectId !== 'null') {
        return path.join(basePath, 'projects', String(projectId), 'media', folder);
    }
    return path.join(basePath, 'media', folder);
};

/**
 * Ensures that the destination directory exists.
 * @param {string} dirPath - Directory path to create if missing.
 */
const ensureDirectoryExists = async (dirPath) => {
    if (!fsSync.existsSync(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

const mediaController = {
    /**
     * Upload general/project media file.
     * Uses the original filename (sanitized) for readability.
     * Overwrites existing files with the same name.
     */
    uploadMedia: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            const projectId = (req.body && req.body.id_project) || (req.query && req.query.id_project) || null;
            const originalExt = path.extname(req.file.originalname).toLowerCase();
            const isPhoto = PHOTO_EXTENSIONS.includes(originalExt);

            // Derive a readable filename from the original name
            const originalBase = path.basename(req.file.originalname, originalExt);
            const sanitizedBase = sanitizeName(originalBase) || 'untitled';
            let finalFilename = '';

            if (isPhoto) {
                // Convert to WebP and resize to max-width 1200px
                finalFilename = `${sanitizedBase}.webp`;
                const targetDir = getMediaDirectory(projectId, finalFilename);
                await ensureDirectoryExists(targetDir);
                const targetPath = path.join(targetDir, finalFilename);

                const fileBuffer = await sharp(req.file.path)
                    .resize({ width: 1200, withoutEnlargement: true })
                    .toFormat('webp', { quality: 80 })
                    .toBuffer();

                await fs.writeFile(targetPath, fileBuffer);
                await fs.unlink(req.file.path).catch(err => console.error("Temp cleanup failed:", err));
            } else {
                // Keep original extension for videos
                finalFilename = `${sanitizedBase}${originalExt}`;
                const targetDir = getMediaDirectory(projectId, finalFilename);
                await ensureDirectoryExists(targetDir);
                const targetPath = path.join(targetDir, finalFilename);

                await fs.rename(req.file.path, targetPath);
            }

            const url = projectId && projectId !== '0' && projectId !== 'null'
                ? `/images/projects/${projectId}/${finalFilename}`
                : `/images/${finalFilename}`;

            return res.status(200).json({
                success: true,
                url,
                filename: finalFilename
            });
        } catch (error) {
            console.error('Media upload error:', error);
            // Safely cleanup temp file on error
            if (req.file && req.file.path) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
        }
    },

    /**
     * Scan and list general/project media assets.
     */
    getMediaList: async (req, res) => {
        try {
            const projectId = (req.query && req.query.id_project) || null;
            
            // Scopes category directories
            const photoDir = getMediaDirectory(projectId, 'dummy.webp');
            const videoDir = getMediaDirectory(projectId, 'dummy.mp4');

            const photos = [];
            const videos = [];

            const scanDir = async (dirPath, type) => {
                if (fsSync.existsSync(dirPath)) {
                    const files = await fs.readdir(dirPath);
                    for (const file of files) {
                        const filePath = path.join(dirPath, file);
                        const stats = await fs.stat(filePath);
                        if (stats.isFile()) {
                            const url = projectId && projectId !== '0' && projectId !== 'null'
                                ? `/images/projects/${projectId}/${file}`
                                : `/images/${file}`;
                            
                            const fileInfo = {
                                name: file,
                                url,
                                type,
                                size: stats.size,
                                updatedAt: stats.mtime
                            };

                            if (type === 'photo') {
                                photos.push(fileInfo);
                            } else {
                                videos.push(fileInfo);
                            }
                        }
                    }
                }
            };

            await Promise.all([
                scanDir(photoDir, 'photo'),
                scanDir(videoDir, 'video')
            ]);

            // Sort photos and videos by updated date descending
            photos.sort((a, b) => b.updatedAt - a.updatedAt);
            videos.sort((a, b) => b.updatedAt - a.updatedAt);

            return res.status(200).json({
                success: true,
                photos,
                videos
            });
        } catch (error) {
            console.error('Error fetching media list:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch media list', error: error.message });
        }
    },

    /**
     * Delete media file.
     */
    deleteMedia: async (req, res) => {
        try {
            const { filename } = req.params;
            const projectId = (req.query && req.query.id_project) || (req.body && req.body.id_project) || null;
            
            const mediaPath = path.join(getMediaDirectory(projectId, filename), filename);

            if (fsSync.existsSync(mediaPath)) {
                await fs.unlink(mediaPath);
                return res.status(200).json({ success: true, message: 'File deleted successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'File not found' });
            }
        } catch (error) {
            console.error('Error deleting media:', error);
            res.status(500).json({ success: false, message: 'Failed to delete file', error: error.message });
        }
    },

    /**
     * Serve general media files (Single-Tenant).
     */
    getMedia: async (req, res) => {
        try {
            const { filename } = req.params;
            const mediaPath = path.join(getMediaDirectory(null, filename), filename);

            if (fsSync.existsSync(mediaPath)) {
                res.sendFile(mediaPath);
            } else {
                res.status(404).send('Media not found');
            }
        } catch (error) {
            console.error('Error retrieving media:', error);
            res.status(500).send('Server error');
        }
    },

    /**
     * Serve project-specific media files (SAAS Multi-Tenant).
     */
    getProjectMedia: async (req, res) => {
        try {
            const { projectId, filename } = req.params;
            const mediaPath = path.join(getMediaDirectory(projectId, filename), filename);

            if (fsSync.existsSync(mediaPath)) {
                res.sendFile(mediaPath);
            } else {
                res.status(404).send('Media not found');
            }
        } catch (error) {
            console.error('Error retrieving project media:', error);
            res.status(500).send('Server error');
        }
    }
};

module.exports = mediaController;
