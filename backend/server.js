// backend/server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Importar multer
const path = require('path'); // Para manejar rutas de archivos
const fs = require('fs/promises'); // <-- ¡NUEVO! Importa el módulo 'fs/promises'

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes solo desde tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Para parsear JSON en el cuerpo de las peticiones

// --- NUEVO: Configuración de Multer para la subida de imágenes ---
// Carpeta donde se guardarán las imágenes de perfil
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'profile_pictures');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que la carpeta exista. En producción, podrías crearla dinámicamente o con un script.
        // Para desarrollo, puedes crearla manualmente: backend/uploads/profile_pictures
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        // Usamos el ID del usuario si está disponible, si no, un timestamp
        const userId = req.user ? req.user.id : Date.now();
        const fileExtension = path.extname(file.originalname);
        cb(null, `${userId}-${Date.now()}${fileExtension}`);
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

// --- NUEVO: Servir archivos estáticos ---
// Acceder a las imágenes desde el navegador (ej. http://localhost:3000/uploads/profile_pictures/mi_foto.jpg)
app.use('/uploads/profile_pictures', express.static(UPLOADS_DIR));

// -------------------------------------------------------------

const JWT_SECRET = process.env.JWT_SECRET || 'una_clave_secreta_super_segura_y_larga_para_zona_pits_mp_34567890abcdefghijklmnopqrstuvwxyz';

// Configuración de la conexión a la base de datos MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación de conexión a la base de datos
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la base de datos MySQL: zonapitsmp');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a MySQL:', err.message);
        process.exit(1);
    });

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }
        req.user = user;
        next();
    });
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso.' });
        }
        next();
    };
}

// Ruta de prueba (ruta raíz del backend)
app.get('/', (req, res) => {
    res.send('Servidor backend de Zona Pits MP funcionando!');
});

// Ruta de prueba para obtener usuarios (solo para verificar la conexión)
app.get('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, role, created_at, profile_picture FROM users'); // <-- ¡MODIFICADO!
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
    }
});

// NUEVA RUTA: Registro de Usuarios
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos: nombre de usuario, correo electrónico y contraseña.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Formato de correo electrónico inválido.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            const [userByUsername] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
            if (userByUsername.length > 0) {
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
            }
            const [userByEmail] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
            if (userByEmail.length > 0) {
                return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
            }
        }

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)', // <-- ¡MODIFICADO!
            [username, email, password, null] // Por defecto, la foto de perfil es NULL al registrarse
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            userId: result.insertId,
            username: username,
            email: email,
            role: 'user',
            profile_picture: null // Al registrarse no hay foto aún
        });

    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar el registro.' });
    }
});

// NUEVA RUTA: Inicio de Sesión de Usuarios
app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Usuario/Correo y contraseña son requeridos.' });
    }

    try {
        // ¡MODIFICADO: Seleccionamos profile_picture también!
        const [users] = await pool.execute(
            'SELECT id, username, email, password, role, profile_picture FROM users WHERE username = ? OR email = ?',
            [usernameOrEmail, usernameOrEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = users[0];

        if (password !== user.password) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // ¡MODIFICADO: Incluimos profilePicture en el payload del JWT y en la respuesta!
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture // <-- Incluir profile_picture aquí
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture // <-- Incluir profile_picture aquí
            },
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
});

// NUEVA RUTA: Subir y Actualizar Foto de Perfil
app.post('/api/profile/upload-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
      if (!req.file) {
          return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
      }
    
      const userId = req.user.id;
      const newProfilePictureUrl = `http://localhost:${port}/uploads/profile_pictures/${req.file.filename}`;
    
      console.log(`[DEBUG] Intentando subir foto para el usuario ID: ${userId}`);
      console.log(`[DEBUG] Nueva URL de foto de perfil: ${newProfilePictureUrl}`);
      console.log(`[DEBUG] Archivo subido temporalmente en: ${req.file.path}`);
    
      try {
          // 1. Obtener la foto de perfil actual del usuario desde la base de datos (para posible eliminación)
          const [rows] = await pool.execute(
              'SELECT profile_picture FROM users WHERE id = ?',
              [userId]
          );
          const oldProfilePictureUrl = rows[0]?.profile_picture;
    
          console.log(`[DEBUG] URL de foto de perfil antigua desde DB: ${oldProfilePictureUrl}`);
    
          // 2. Si existe una foto anterior y es diferente de la nueva, eliminarla del sistema de archivos
          if (oldProfilePictureUrl && oldProfilePictureUrl !== newProfilePictureUrl) {
              console.log("[DEBUG] Condición de eliminación de foto antigua cumplida.");
              const oldFilename = path.basename(oldProfilePictureUrl);
              const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
    
              console.log(`[DEBUG] Ruta de archivo antiguo a eliminar: ${oldFilePath}`);
    
              try {
                  await fs.unlink(oldFilePath);
                  console.log(`✅ Archivo de perfil antiguo eliminado: ${oldFilePath}`);
              } catch (unlinkError) {
                  if (unlinkError.code === 'ENOENT') {
                      console.warn(`⚠️ Archivo de perfil antiguo no encontrado para eliminar: ${oldFilePath}`);
                  } else {
                      console.error(`❌ Error al eliminar archivo de perfil antiguo ${oldFilePath}:`, unlinkError);
                  }
              }
          } else {
              console.log("[DEBUG] Condición de eliminación de foto antigua NO cumplida.");
          }
    
          // 3. Actualizar la base de datos con la nueva URL de la foto de perfil
          await pool.execute(
              'UPDATE users SET profile_picture = ? WHERE id = ?',
              [newProfilePictureUrl, userId]
          );
          console.log(`[DEBUG] Base de datos actualizada con la nueva URL.`);
    
          // **** CAMBIOS CLAVE AQUÍ ****
          // 4. Obtener el usuario actualizado de la base de datos
          const [updatedUserRows] = await pool.execute(
              'SELECT id, username, email, role, profile_picture FROM users WHERE id = ?',
              [userId]
          );
          const updatedUser = updatedUserRows[0];
    
          if (!updatedUser) {
              throw new Error('Usuario no encontrado después de la actualización.');
          }
    
          // 5. Generar un NUEVO TOKEN JWT con la información actualizada del usuario
          const newToken = jwt.sign(
              {
                  id: updatedUser.id,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  role: updatedUser.role,
                  profilePicture: updatedUser.profile_picture // ¡La URL de la nueva foto!
              },
              JWT_SECRET,
              { expiresIn: '1h' } // Duración del token
          );
    
          // 6. Envía la nueva URL de la foto de perfil Y EL NUEVO TOKEN al cliente
          res.status(200).json({
              message: 'Foto de perfil actualizada exitosamente.',
              profilePictureUrl: newProfilePictureUrl, // Útil para actualización local si no se usa el token
              token: newToken // ¡Envía el nuevo token!
          });
    
      } catch (error) {
          console.error('Error al actualizar la foto de perfil:', error);
          // Si hay un error durante el proceso (ej. DB), elimina el archivo recién subido para limpiar
          if (req.file) {
              await fs.unlink(req.file.path).catch(unlinkErr => console.error('Error al eliminar archivo recién subido tras error en DB:', unlinkErr));
          }
          res.status(500).json({ message: 'Error interno del servidor al subir la foto de perfil.' });
      }
    });

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, email, role, profile_picture FROM users WHERE id = ?', [req.user.id]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: '¡Acceso a perfil exitoso!',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profile_picture // Aseguramos que la última URL de la foto esté aquí
            }
        });
    } catch (error) {
        console.error('Error al obtener datos de perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener datos de perfil.' });
    }
});

// NUEVA RUTA: Ruta de Administración Protegida por Rol (¡NUEVO!)
app.get('/api/admin-dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({
        message: `¡Bienvenido, administrador ${req.user.username}! Has accedido al panel de administración.`,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            profilePicture: req.user.profilePicture // También pasa la foto de perfil si la necesitas aquí
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Backend de Zona Pits MP corriendo en http://localhost:${port}`);
});