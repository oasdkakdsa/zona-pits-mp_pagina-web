// backend/routes/auth.js
const router = require('express').Router();
const { googleAuth } = require('../controllers/authController'); // Importa solo la nueva función de Google Auth

// Ruta para el inicio de sesión con Google
router.post('/google', googleAuth);

module.exports = router;