require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
// servir estáticos
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));

// Rutas
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Ruta raíz
app.get('/', (req, res) => res.send('Servidor backend corriendo!'));

app.listen(port, () => console.log(`Backend corriendo en http://localhost:${port}`));