// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Importamos el componente de App (que ahora será nuestro layout principal)
import App from './App.jsx';
import './index.css';

// Importamos todas las páginas y componentes necesarios para las rutas
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx'; // Tu página de inicio con el contenido Hero y las Cards
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; 
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute'; // Importa ProtectedRoute aquí

// Definimos nuestras rutas con createBrowserRouter
const router = createBrowserRouter([
  {
    // La ruta principal '/' usará App como su componente de layout
    path: '/',
    element: <App />, // App ahora es tu layout principal con Navbar y AuthProvider
    errorElement: <NotFoundPage />, // Opcional: un elemento de error global para esta rama
    children: [
      // Rutas públicas que se renderizan dentro del <Outlet> de App
      {
        index: true, // Esto hace que HomePage se renderice en '/'
        element: <HomePage />,
      },
      {
        path: 'login', // Ruta para /login
        element: <LoginPage />,
      },
      {
        path: 'register', // Ruta para /register
        element: <RegisterPage />,
      },

      // Rutas Protegidas Generales (cualquier usuario autenticado)
      {
        element: <ProtectedRoute />, // ProtectedRoute actuará como un layout que verifica la autenticación
        children: [
          {
            path: 'dashboard', // Ruta para /dashboard
            element: <DashboardPage />,
          },
          {
            path: 'profile', // <-- NUEVO: Ruta para el perfil
            element: <ProfilePage />,
          },
        ],
      },

      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
  </React.StrictMode>,
);