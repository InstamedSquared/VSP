const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '../../private_storage/tmp/');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

const upload = multer({
    dest: tempDir,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); }
        else { cb(new Error('Invalid file type. Allowed: Images, PDF, Word, TXT.'), false); }
    }
});

module.exports = upload;
