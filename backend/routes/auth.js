// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para la autenticación de Google (inicio de sesión/registro unificado)
router.post('/google', authController.googleAuth);

module.exports = router;