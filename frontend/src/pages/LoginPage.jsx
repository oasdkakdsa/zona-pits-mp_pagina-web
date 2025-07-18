import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const LoginPage = () => {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Función de éxito para Google Login
    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        try {
            console.log('Token de Google recibido:', credentialResponse.credential);
            const response = await axios.post('http://localhost:3000/api/auth/google', {
                idToken: credentialResponse.credential,
            });

            console.log('Respuesta del backend (Google):', response.data);
            login(response.data.token);
            setSuccessMessage('Inicio de sesión con Google exitoso. Redireccionando...');
            navigate('/dashboard');
        } catch (err) {
            console.error('Error en la autenticación de Google:', err);
            setError(err.response?.data?.message || 'Error en la autenticación de Google.');
        }
    };

    // Función de error para Google Login
    const handleGoogleError = () => {
        console.error('Error en el inicio de sesión de Google (cliente).');
        setError('No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-yellow-500">Iniciar Sesión</h2>
                {error && <p className="bg-red-600 p-3 rounded mb-4 text-center">{error}</p>}
                {successMessage && <p className="bg-green-600 p-3 rounded mb-4 text-center">{successMessage}</p>}

                <div className="mt-6 flex flex-col items-center">
                    <p className="text-gray-300 mb-3 text-center">Inicia sesión con tu cuenta de Google:</p>
                    {/* Componente de GoogleLogin */}
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        use
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
=======
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { LogIn, Lock, Zap } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError('');
    try {
      const idToken = response.credential;
      const res = await axios.post('http://localhost:3000/api/auth/google', { idToken });
      if (res.data.token) {
        login(res.data.token);
        navigate('/dashboard');
      } else {
        throw new Error('No recibimos token del servidor');
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Error al iniciar sesión con Google.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Bienvenido</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Accede al portal de maquinaria pesada</p>
        </div>

        {error && (
          <div className="flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md p-3 mb-6">
            <Lock size={16} className="mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mb-6">
          {/* <GoogleOAuthProvider clientId="168786462680-4c83krupj1iu7lbsp6vo89k4vfp4b1mu.apps.googleusercontent.com"> */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"// o "outline", "filled_black"
              size="large"
              width="100%"
              shape="circle" // o "circle", "square", "pill"
            >
              <button
                disabled={loading}
                className="w-full flex items-center justify-center border border-gray-900 dark:border-gray-200 rounded-md py-2 transition hover:bg-gray-900 dark:hover:bg-gray-700 disabled:opacity-50 bg-transparent"
              >
                <LogIn className="mr-2 text-gray-900 dark:text-gray-200" size={20} />
                <span className="text-gray-900 dark:text-gray-200 font-medium">
                  {loading ? 'Iniciando...' : 'Continuar con Google'}
                </span>
              </button>
            </GoogleLogin>
          </GoogleOAuthProvider>
        </div>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-6">
          <span className="flex-grow border-t border-gray-300 dark:border-gray-600"></span>
          <span className="px-2">Seguro y confiable</span>
          <span className="flex-grow border-t border-gray-300 dark:border-gray-600"></span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="p-2 mb-2">
              <Lock size={18} className="text-gray-600 dark:text-gray-300" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-xs">Encriptado</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-2 mb-2">
              <Zap size={18} className="text-gray-600 dark:text-gray-300" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-xs">Rápido</span>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Al continuar, aceptas nuestros{' '}
          <Link to="/terms" className="underline text-blue-600 dark:text-blue-400">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="underline text-blue-600 dark:text-blue-400">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 45e89fa511c8979c490a31f369219132a9395eb5
