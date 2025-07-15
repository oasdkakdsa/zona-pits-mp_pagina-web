// backend/controllers/authController.js
const db = require('../config/db'); // Tu pool de conexiones
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt'); // Tu configuración JWT
const { OAuth2Client } = require('google-auth-library'); // Importa Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Función para autenticar/registrar usuarios a través de Google.
 * Recibe el ID Token de Google del frontend.
 */
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body; // El token enviado desde el frontend

  if (!idToken) {
    return res.status(400).json({ message: 'ID Token de Google no proporcionado.' });
  }

  try {
    // 1. Verificar el ID Token de Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID, // Asegúrate de que este sea tu ID de cliente de Google
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload; // Obtener información del usuario de Google

    console.log('[Google Auth] Payload verificado:', { email, name, picture });

    // 2. Buscar/Crear usuario en tu base de datos
    let [users] = await db.execute(
      'SELECT id, username, email, role, profile_picture FROM users WHERE email = ?',
      [email]
    );

    let user = users[0];

    if (!user) {
      // Si el usuario no existe, regístralo
      const defaultRole = 'user'; // Rol por defecto para nuevos usuarios de Google
      const usernameFromGoogle = name || email.split('@')[0]; // Usa el nombre de Google o parte del email

      console.log(`[Google Auth] Usuario no encontrado, registrando nuevo usuario: ${email}`);

      const [result] = await db.execute(
        'INSERT INTO users (username, email, role, profile_picture) VALUES (?, ?, ?, ?)',
        [usernameFromGoogle, email, defaultRole, picture || null] // Guarda la foto de perfil de Google
      );

      user = {
        id: result.insertId,
        username: usernameFromGoogle,
        email: email,
        role: defaultRole,
        profile_picture: picture || null
      };
      console.log(`[Google Auth] Nuevo usuario registrado con ID: ${user.id}`);
    } else {
      console.log(`[Google Auth] Usuario existente encontrado: ${email}`);
      // Opcional: Si el usuario ya existe pero no tiene foto de perfil y Google sí la proporciona, actualízala.
      if (!user.profile_picture && picture) {
        await db.execute(
          'UPDATE users SET profile_picture = ? WHERE id = ?',
          [picture, user.id]
        );
        user.profile_picture = picture; // Actualiza el objeto user para la respuesta JWT
        console.log(`[Google Auth] Foto de perfil actualizada para usuario ${user.id}`);
      }
    }

    // 3. Generar tu propio JWT para la aplicación
    const appToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture // Incluir la URL de la foto de perfil
      },
      secret, // Usa el secreto de tu config/jwt.js
      { expiresIn: expiresIn } // Usa la expiración de tu config/jwt.js
    );

    res.status(200).json({
      message: 'Inicio de sesión con Google exitoso.',
      token: appToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture
      }
    });

  } catch (error) {
    console.error('Error en la autenticación de Google:', error);
    res.status(500).json({ message: 'Error interno del servidor al autenticar con Google.', details: error.message });
  }
};