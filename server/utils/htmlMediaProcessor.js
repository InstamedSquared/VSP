const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * Processes an HTML string, extracts base64 images, saves them to disk,
 * and replaces the base64 src with a persistent URL.
 * 
 * @param {string} html - The HTML content to process.
 * @param {string} storagePath - The absolute path to the media storage directory.
 * @returns {Promise<string>} - The processed HTML string.
 */
async function processHtmlMedia(html, storagePath) {
    if (!html || typeof html !== 'string') return html;

    // Regular expression to find base64 images and videos matches: src="data:[mime];base64,[data]"
    const base64Regex = /src="data:((image|video)\/[a-zA-Z0-9+.-]+);base64,([^"]+)"/g;
    let processedHtml = html;

    // Ensure storage directory exists
    try {
        await fs.mkdir(storagePath, { recursive: true });
    } catch (err) {
        console.error('Failed to create media storage directory:', err);
        return html;
    }

    const matches = [...html.matchAll(base64Regex)];

    for (const match of matches) {
        const fullMatch = match[0];
        const mimeType = match[1];
        const base64Data = match[3]; // The data is now the third group
        
        let extension = mimeType.split('/')[1] || 'png';
        // Handle common video extensions
        if (extension === 'quicktime') extension = 'mov';
        if (extension === 'x-msvideo') extension = 'avi';
        if (extension === 'mpeg') extension = 'mpg';
        
        const filename = `${crypto.randomUUID()}.${extension}`;
        const filePath = path.join(storagePath, filename);

        try {
            const buffer = Buffer.from(base64Data, 'base64');
            await fs.writeFile(filePath, buffer);
            
            // Replace the fullMatch (src="data:...") with the new URL
            const newUrl = `src="/api/media/${filename}"`;
            processedHtml = processedHtml.replace(fullMatch, newUrl);
        } catch (err) {
            console.error(`Failed to save base64 media ${filename}:`, err);
        }
    }

    return processedHtml;
}

module.exports = { processHtmlMedia };
