// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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