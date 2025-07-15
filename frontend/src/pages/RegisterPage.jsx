// frontend/src/pages/RegisterPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige al usuario a la página de login, ya que el registro es vía Google
    navigate('/login', { replace: true });
    // Opcional: mostrar un mensaje antes de redirigir
    // alert('El registro se realiza a través del inicio de sesión con Google. Serás redirigido a la página de inicio de sesión.');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 p-4">
      <div className="text-center text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold mb-4">Redirigiendo...</h2>
        <p>El registro se realiza a través del inicio de sesión con Google.</p>
        <p>Si no eres redirigido automáticamente, haz clic <Link to="/login" className="text-yellow-500 hover:underline">aquí</Link>.</p>
      </div>
    </div>
  );
}

export default RegisterPage;