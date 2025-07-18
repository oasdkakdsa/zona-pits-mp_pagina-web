// backend/models/User.js
const db = require('../config/db'); // Asegúrate de que esta ruta sea correcta a tu db.js

const User = {
    // Encuentra un usuario por email
    findByEmail: async (email) => {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0]; // Devuelve el primer usuario encontrado (debería ser único)
        } catch (error) {
            console.error('Error al buscar usuario por email en la DB:', error);
            throw error;
        }
    },

    // Crea un nuevo usuario para Google Login
    // NOTA: Para usuarios de Google, 'password' será NULL, ya que su autenticación es externa.
    create: async ({ email, username, picture, role = 'user' }) => {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (username, password, email, role, profile_picture) VALUES (?, ?, ?, ?, ?)',
                [username, null, email, role, picture] // 'password' es NULL, 'profile_picture' es 'picture'
            );
            // Devuelve el usuario creado, incluyendo el ID insertado por la DB
            return { id: result.insertId, username, email, role, profile_picture: picture };
        } catch (error) {
            console.error('Error al crear nuevo usuario en la DB:', error);
            throw error;
        }
    },

    // Encuentra un usuario por ID (útil para generar JWT)
    findById: async (id) => {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por ID en la DB:', error);
            throw error;
        }
    },

    // Actualiza los datos de un usuario existente
    update: async (id, { username, picture }) => {
        try {
            await db.execute(
                'UPDATE users SET username = ?, profile_picture = ? WHERE id = ?',
                [username, picture, id]
            );
            // Opcional: podrías devolver el usuario actualizado
            return { id, username, profile_picture: picture };
        } catch (error) {
            console.error('Error al actualizar usuario en la DB:', error);
            throw error;
        }
    },
};

module.exports = User;