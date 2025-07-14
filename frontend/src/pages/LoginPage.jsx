// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ¡IMPORTA useAuth AQUÍ!

function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // ¡OBTEN LA FUNCIÓN 'login' DEL CONTEXTO!

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/login', { // Confirma la URL de tu API de login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            }

            console.log('Inicio de sesión exitoso:', data);

            // *** CAMBIO CLAVE AQUÍ: Llama a la función login del AuthContext ***
            login(data.token); // Esto actualiza el estado en AuthContext Y guarda el token en localStorage
 
            // Redirige al usuario a una página después del login exitoso
            navigate('/dashboard'); 

        } catch (err) {
            setError(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
            console.error('Error de inicio de sesión:', err);
        } finally {
            setLoading(false);
        }
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

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="usernameOrEmail"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            Usuario o Correo Electrónico
                        </label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
                            placeholder="Tu usuario o email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
                            placeholder="**********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                    <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-yellow-500 hover:text-yellow-600 font-bold transition duration-300">
                            Regístrate aquí
                        </Link>
                    </p>
                    <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
                        <Link to="#" className="text-blue-500 hover:text-blue-600 transition duration-300">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;