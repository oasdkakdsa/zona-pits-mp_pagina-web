// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa tu contexto de autenticación

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        // Puedes mostrar un spinner o un mensaje de carga mientras se verifica el token
        return <div>Cargando autenticación...</div>;
    }

    if (!isAuthenticated) {
        // Si no está autenticado, redirige al login
        return <Navigate to="/login" replace />;
    }

    // Si se especifican roles permitidos y el usuario no tiene uno de ellos
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirige a una página de "Acceso Denegado" o al dashboard
        console.warn(`Acceso denegado. Rol del usuario: ${user.role}, Roles permitidos: ${allowedRoles.join(', ')}`);
        return <Navigate to="/dashboard" replace />; // O a una página de error 403
    }

    // Si está autenticado y tiene el rol correcto, renderiza el componente hijo
    return <Outlet />; // Outlet renderiza el componente anidado en las rutas
};

export default ProtectedRoute;