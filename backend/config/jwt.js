/* config/jwt.js */
module.exports = {
  secret: process.env.JWT_SECRET || 'una_clave_super_segura',
  expiresIn: '1h'
};