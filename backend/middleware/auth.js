// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Para buscar al usuario y obtener su rol si es necesario

// Middleware para autenticar el token JWT
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, userPayload) => {
        if (err) {
            console.error('Error al verificar token JWT:', err);
            // Si el token expiró, enviar un 403 con mensaje específico para que el frontend pueda manejarlo
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Token expirado.', expired: true });
            }
            return res.status(403).json({ message: 'Token inválido.' });
        }

        // Buscar el usuario en la base de datos para asegurarse de que sigue existiendo
        // y para tener los datos más recientes del usuario (especialmente el rol).
        try {
            const user = await User.findById(userPayload.id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
            // Adjuntar el objeto completo del usuario a la solicitud
            req.user = user;
            next(); // Continuar con la siguiente función de middleware o la ruta
        } catch (dbError) {
            console.error('Error al buscar usuario en la DB durante autenticación:', dbError);
            return res.status(500).json({ message: 'Error interno del servidor al autenticar.' });
        }
    });
};

// Middleware para autorizar roles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // req.user debe haber sido establecido por authenticateToken
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado. Rol de usuario no disponible.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}.` });
        }
        next(); // El usuario tiene el rol permitido, continuar
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
};