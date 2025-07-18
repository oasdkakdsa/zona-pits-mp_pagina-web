// frontend/src/pages/OnboardingRolePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function OnboardingRolePage() {
  const [googlePayload, setGooglePayload] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' por defecto (gratis)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Recuperar los datos de Google del localStorage
    const storedPayload = localStorage.getItem('googleOnboardingPayload');
    if (storedPayload) {
      setGooglePayload(JSON.parse(storedPayload));
    } else {
      // Si no hay datos, significa que no vinimos de un primer login de Google, redirigir
      navigate('/login', { replace: true });
    }

    // Limpiar el localStorage después de obtener los datos
    return () => {
      localStorage.removeItem('googleOnboardingPayload');
    };
  }, [navigate]);

  if (!googlePayload) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">Cargando datos de usuario...</p>
      </div>
    );
  }

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setError(''); // Limpiar errores al cambiar de rol
  };

  const handleFinalizeRegistration = async () => {
    setError('');
    setLoading(true);

    let paymentConfirmed = false; // Asumimos falso por defecto

    if (selectedRole === 'admin') {
      // --- Lógica para el PAGO (SIMULACIÓN) ---
      // Aquí es donde integrarías tu pasarela de pago (ej. Stripe, PayPal, etc.).
      // Por ejemplo, podrías abrir un modal de Stripe Checkout o redirigir.
      console.log('Iniciando proceso de pago para rol de administrador...');
      try {
        // En un entorno real, esto sería una llamada a tu backend
        // para iniciar el flujo de pago y esperar una confirmación de la pasarela.
        // Por ahora, lo simulamos como exitoso para probar el flujo.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un retraso de 1.5 segundos
        paymentConfirmed = true; // Si el pago fue exitoso
        console.log('Pago simulado exitoso.');
      } catch (paymentError) {
        setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        setLoading(false);
        console.error('Error de pago:', paymentError);
        return;
      }
    }

    try {
      // Enviar los datos a tu nuevo endpoint del backend
      const response = await axios.post('http://localhost:3000/api/auth/finalize-google-registration', {
        email: googlePayload.email,
        name: googlePayload.name,
        picture: googlePayload.picture,
        role: selectedRole,
        paymentConfirmed: paymentConfirmed // Enviar la confirmación de pago
      });

      if (response.data.token) {
        login(response.data.token); // Iniciar sesión con el JWT de tu aplicación
        navigate('/dashboard'); // Redirigir al dashboard
      } else {
        throw new Error('No se recibió el token de autenticación del servidor al finalizar el registro.');
      }

    } catch (err) {
      console.error('Error al finalizar el registro:', err);
      setError(err.response?.data?.message || err.message || 'Ocurrió un error al finalizar tu registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          ¡Bienvenido, {googlePayload.name || googlePayload.email}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Para comenzar, por favor selecciona el tipo de cuenta que deseas:
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">¡Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Opción Cliente (Gratis) */}
          <div
            className={`p-6 border rounded-lg cursor-pointer transition duration-300 ${
              selectedRole === 'user' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg' : 'border-gray-300 dark:border-gray-700 hover:border-yellow-400'
            }`}
            onClick={() => handleRoleSelection('user')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cuenta Cliente</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Acceso a soporte básico y seguimiento de tickets.</p>
            <p className="text-green-600 dark:text-green-400 font-bold mt-2 text-lg">Gratis</p>
          </div>

          {/* Opción Administrador (Pago) */}
          <div
            className={`p-6 border rounded-lg cursor-pointer transition duration-300 ${
              selectedRole === 'admin' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg' : 'border-gray-300 dark:border-gray-700 hover:border-yellow-400'
            }`}
            onClick={() => handleRoleSelection('admin')}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cuenta Administrador</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Gestión completa de usuarios, máquinas y tickets.</p>
            <p className="text-yellow-600 dark:text-yellow-400 font-bold mt-2 text-lg">$9.99/mes</p>
          </div>
        </div>

        {/* Mensaje si el administrador está seleccionado */}
        {selectedRole === 'admin' && (
          <p className="text-blue-600 dark:text-blue-400 mb-6">
            Al seleccionar "Administrador", se te pedirá realizar el pago en el siguiente paso.
          </p>
        )}

        <button
          onClick={handleFinalizeRegistration}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Continuar con el Registro'}
        </button>
      </div>
    </div>
  );
}

export default OnboardingRolePage;