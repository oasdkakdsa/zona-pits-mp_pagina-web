const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    const { idToken } = req.body;

    // Verificar que el token fue enviado
    if (!idToken) {
        return res.status(400).json({ message: 'Token de Google requerido.' });
    }

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('[Google Auth] GOOGLE_CLIENT_ID no configurado en las variables de entorno');
        return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }

    if (!process.env.JWT_SECRET) {
        console.error('[Google Auth] JWT_SECRET no configurado en las variables de entorno');
        return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }

    try {
        console.log('[Google Auth] Verificando token con Client ID:', process.env.GOOGLE_CLIENT_ID);
        
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        console.log('[Google Auth] Payload verificado:', {
            email: payload.email,
            name: payload.name,
            aud: payload.aud // Esto muestra el audience del token
        });

        const { email, name, picture } = payload;

        let user = await User.findByEmail(email);
        let isNewUser = false;

        if (!user) {
            // Usuario nuevo - crear con rol 'user' (cliente)
            const usernameFromGoogle = name || email.split('@')[0];
            console.log(`[Google Auth] Usuario nuevo: ${email}. Registrándolo con rol 'user'.`);
            
            user = await User.create({ 
                email, 
                username: usernameFromGoogle, 
                picture, 
                role: 'user'
            });
            
            isNewUser = true;
            console.log('[Google Auth] Nuevo usuario registrado exitosamente:', user);
        } else {
            console.log(`[Google Auth] Usuario existente: ${email}. Rol actual: ${user.role}`);
            
            // Usuario existente - actualizar datos si es necesario
            const usernameFromGoogle = name || email.split('@')[0];
            if (user.username !== usernameFromGoogle || user.profile_picture !== picture) {
                await User.update(user.id, { 
                    username: usernameFromGoogle, 
                    picture 
                });
                
                const updatedUser = await User.findById(user.id);
                user = updatedUser;
                console.log('[Google Auth] Datos de usuario existente actualizados.');
            }
        }

        // Generar JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME || '1h' }
        );

        console.log(`[Google Auth] JWT generado exitosamente para ${email}. Rol: ${user.role}`);

        // Respuesta exitosa
        res.status(200).json({ 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture
            },
            isNewUser
        });

    } catch (error) {
        console.error('[Google Auth] Error en la autenticación de Google:', error);
        
        // Manejo específico de errores
        if (error.message.includes('audience')) {
            console.error('[Google Auth] Error de audience - Verificar GOOGLE_CLIENT_ID');
            return res.status(401).json({ 
                message: 'Error de configuración: Client ID incorrecto.',
                error: 'INVALID_CLIENT_ID'
            });
        }
        
        if (error.message.includes('Token')) {
            return res.status(401).json({ 
                message: 'Token de Google inválido.',
                error: 'INVALID_TOKEN'
            });
        }
        
        res.status(500).json({ 
            message: 'Error interno del servidor durante la autenticación.',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
};