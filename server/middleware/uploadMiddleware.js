const multer = require('multer');
const path = require('path');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const upload = multer({
    dest: path.join(__dirname, '../../private_storage/tmp/'),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); }
        else { cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false); }
    }
});

module.exports = upload;