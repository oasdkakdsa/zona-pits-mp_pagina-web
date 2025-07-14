const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,username,email,role,created_at,profile_picture FROM users');
    res.json(rows);
  } catch (e) { res.status(500).json({ message:'Error al listar usuarios.' }); }
};