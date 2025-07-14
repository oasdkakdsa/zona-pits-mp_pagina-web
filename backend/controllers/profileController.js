const db = require('../config/db');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

exports.getProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.execute('SELECT id,username,email,role,profile_picture FROM users WHERE id=?',[userId]);
    if (!rows.length) return res.status(404).json({ message:'Usuario no encontrado.' });
    res.json({ user: rows[0] });
  } catch(e){ res.status(500).json({message:'Error interno.'}); }
};

exports.uploadPicture = async (req, res) => {
  if (!req.file) return res.status(400).json({ message:'Archivo faltante.' });
  const userId = req.user.id;
  const newUrl = `${req.protocol}://${req.get('host')}/uploads/profile_pictures/${req.file.filename}`;
  try {
    const [old] = await db.execute('SELECT profile_picture FROM users WHERE id=?',[userId]);
    const oldUrl = old[0].profile_picture;
    if (oldUrl && oldUrl!==newUrl) {
      const oldFile = path.basename(oldUrl);
      await fs.unlink(path.join(__dirname,'..','uploads','profile_pictures',oldFile)).catch(()=>{});
    }
    await db.execute('UPDATE users SET profile_picture=? WHERE id=?',[newUrl,userId]);
    const [urows] = await db.execute('SELECT id,username,email,role,profile_picture FROM users WHERE id=?',[userId]);
    const u = urows[0];
    const token = jwt.sign({id:u.id,username:u.username,role:u.role,profilePicture:u.profile_picture},secret,{expiresIn});
    res.json({ profilePictureUrl:newUrl, token });
  } catch(e){ await fs.unlink(req.file.path).catch(()=>{}); res.status(500).json({message:'Error interno.'}); }
};