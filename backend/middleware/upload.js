const multer = require('multer');
const path = require('path');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'profile_pictures');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  cb(null, file.mimetype.startsWith('image/'));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 }});
module.exports = upload.single('profilePicture');
