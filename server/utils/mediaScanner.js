const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { PHOTO_EXTENSIONS, VIDEO_EXTENSIONS } = require('./constants');

/**
 * Scans a resource directory (e.g., projects, events) for photos and videos.
 * @param {string} resourceName - The name of the resource (e.g., 'projects').
 * @param {string} resourceId - The ID of the resource.
 * @returns {Promise<object>} - { hasPhotos: boolean, hasVideos: boolean, coverImage: string|null, coverVideo: string|null }
 */
async function scanResourceMedia(resourceName, resourceId) {
    const resourceDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', resourceName, String(resourceId));

    const media = {
        hasPhotos: false,
        hasVideos: false,
        coverImage: null,
        coverVideo: null
    };

    try {
        if (!fsSync.existsSync(resourceDir)) {
            return media;
        }

        const files = await fs.readdir(resourceDir);

        const photos = files.filter(file => PHOTO_EXTENSIONS.includes(path.extname(file).toLowerCase())).sort();
        const videos = files.filter(file => VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase()));

        if (photos.length > 0) {
            media.hasPhotos = true;
            const coverFile = photos[0];
            const stats = await fs.stat(path.join(resourceDir, coverFile));
            media.coverImage = `/api/${resourceName}/${resourceId}/media/${coverFile}?t=${stats.mtimeMs}`;
        }

        if (videos.length > 0) {
            media.hasVideos = true;
            // Only set coverVideo if there's no coverImage
            if (!media.coverImage) {
                const coverFile = videos[0];
                const stats = await fs.stat(path.join(resourceDir, coverFile));
                media.coverVideo = `/api/${resourceName}/${resourceId}/media/${coverFile}?t=${stats.mtimeMs}`;
            }
        }

    } catch (error) {
        // Directory might not exist yet, which is fine
    }

    return media;
}

module.exports = { scanResourceMedia };
