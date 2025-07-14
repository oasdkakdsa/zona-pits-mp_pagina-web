const router = require('express').Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { getAll } = require('../controllers/userController');
router.get('/', authenticateToken, authorizeRoles('admin'), getAll);
module.exports = router;