
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  // validaciones...
  try {
    const [exists] = await db.execute('SELECT id FROM users WHERE username=? OR email=?',[username,email]);
    if (exists.length) return res.status(409).json({ message:'Usuario ya existe.' });
    const [result] = await db.execute(
      'INSERT INTO users(username,email,password,profile_picture) VALUES(?,?,?,NULL)',
      [username,email,password]
    );
    res.status(201).json({ userId: result.insertId, username, email });
  } catch (e) { res.status(500).json({ message:'Error interno.' }); }
};

exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const [users] = await db.execute(
      'SELECT id,username,email,password,role,profile_picture FROM users WHERE username=? OR email=?',
      [usernameOrEmail, usernameOrEmail]
    );
    if (!users.length || users[0].password!==password) return res.status(401).json({ message:'Credenciales inválidas.' });
    const u = users[0];
    const token = jwt.sign({ id:u.id,username:u.username,role:u.role,profilePicture:u.profile_picture }, secret, { expiresIn });
    res.json({ token, user: { id:u.id,username:u.username,email:u.email,role:u.role,profilePicture:u.profile_picture }});
  } catch(e){ res.status(500).json({message:'Error interno.'}); }
};