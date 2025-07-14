// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Para navegar de vuelta a la página de login

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    // En un paso posterior, aquí haremos la llamada a la API del backend
    console.log('Intentando registrar usuario:', { username, email, password });

    try {
      // Aquí iría el fetch a tu backend, por ejemplo:
      // const response = await fetch('http://localhost:3000/api/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, email, password }),
      // });
      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Error en el registro');
      // }

      // console.log('Registro exitoso:', data);
      // setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Después de un registro exitoso, podrías redirigir
      // navigate('/login');

      // Simulación de éxito/fracaso para pruebas iniciales
      if (username && email && password) {
        setSuccess('¡Registro simulado exitoso! Ahora puedes iniciar sesión.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Por favor, completa todos los campos.');
      }

    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado durante el registro.');
      console.error('Error de registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Registrarse
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Crea tu cuenta para acceder a todo el contenido.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">¡Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">¡Éxito! </strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
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
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
              placeholder="**********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-bold transition duration-300">
              Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;