// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // Importa Google OAuth components
import axios from 'axios'; // Importa axios para hacer peticiones HTTP

function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Mantener el estado de carga para el botón de Google
  const navigate = useNavigate();
  const { login } = useAuth();

  // Función que se ejecuta cuando el inicio de sesión con Google es exitoso
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      console.log('Credenciales de Google recibidas:', credentialResponse);
      const idToken = credentialResponse.credential; // Este es el ID Token de Google

      // Envía el ID Token de Google a tu backend para verificación y autenticación
      const response = await axios.post('http://localhost:3000/api/auth/google', { idToken }); // CAMBIA ESTA URL a la de tu backend si es diferente

      if (response.data.token) {
        login(response.data.token); // Llama a la función login del AuthContext con el JWT de tu app
        navigate('/dashboard'); // Redirige al dashboard
      } else {
        throw new Error('No se recibió el token de autenticación del servidor.');
      }
    } catch (err) {
      console.error('Error al iniciar sesión con Google:', err);
      setError(err.response?.data?.message || err.message || 'Error al iniciar sesión con Google. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función que se ejecuta si el inicio de sesión con Google falla
  const handleGoogleError = () => {
    console.error('Inicio de sesión con Google fallido');
    setError('No se pudo completar el inicio de sesión con Google. Inténtalo de nuevo.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Iniciar Sesión
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Accede a tu portal de soporte de maquinaria pesada.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">¡Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Contenedor del botón de Google Login */}
        <div className="flex justify-center mb-6">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              // Puedes personalizar el botón con clases de Tailwind si usas un componente de botón personalizado
              // theme="filled_blue" // o "outline", "filled_black"
              // size="large" // o "medium", "small"
              // type="standard" // o "icon"
              // shape="rectangular" // o "circle", "square", "pill"
              // text="signin_with" // "signin_with", "signup_with", "continue_with"
            />
          </GoogleOAuthProvider>
        </div>

        {/* Mensaje o enlace para usuarios no registrados (ahora se registrarán via Google) */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
          Al iniciar sesión con Google, aceptas nuestros{' '}
          <Link to="/terms" className="text-yellow-500 hover:text-yellow-600 font-bold transition duration-300">
            Términos de Servicio
          </Link>
          {' y '}
          <Link to="/privacy" className="text-yellow-500 hover:text-yellow-600 font-bold transition duration-300">
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default LoginPage;