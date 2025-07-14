const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, uploadPicture } = require('../controllers/profileController');

router.get('/', authenticateToken, getProfile);
router.post('/upload-picture', authenticateToken, upload, uploadPicture);

module.exports = router;
