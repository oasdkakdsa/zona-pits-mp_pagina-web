// backend/app.js
require('dotenv').config(); // Asegura que las variables de entorno se carguen al inicio
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth'); // Estas rutas ahora solo tendrán /google y /finalize-google-registration
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' })); // Asegúrate que tu frontend tiene este origen
app.use(express.json());
// servir estáticos
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));

// Usa las rutas importadas
app.use('/api/auth', authRoutes); // Aquí es donde tu ruta /api/auth/google se monta
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.listen(port, () => {
  console.log(`Backend de Zona Pits MP corriendo en http://localhost:${port}`);
});