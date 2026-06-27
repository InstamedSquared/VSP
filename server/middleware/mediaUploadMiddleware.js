const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure temp directory exists
const tempDir = path.resolve(process.env.PHOTO_STORAGE_PATH || '../private_storage', 'tmp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

const upload = multer({
    dest: tempDir,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for projects (videos)
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only standard images and videos are allowed.'), false);
        }
    }
});

module.exports = upload;
