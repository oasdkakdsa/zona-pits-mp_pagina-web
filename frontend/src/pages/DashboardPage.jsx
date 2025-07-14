import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; 

const DEFAULT_PROFILE_PICTURE = '/default-avatar.png'; 

const DashboardPage = () => {
  const { user, token, loading, logout } = useAuth();

  const [usersData, setUsersData] = useState([]);
  const [usersFetchMessage, setUsersFetchMessage] = useState('');

  const getWelcomeMessage = (username, role) => {
    if (!username) return "Bienvenido/a";
    let genderSuffix = '';
    if (username.toLowerCase().endsWith('a') && username.toLowerCase() !== 'max') {
      genderSuffix = 'a';
    } else {
      genderSuffix = 'o';
    }
    let welcomeText = `Bienvenid${genderSuffix}`;
    if (role === 'admin') {
      welcomeText = `¡Bienvenid${genderSuffix}, Administrador(a)`;
    }
    return `${welcomeText}, ${username}!`;
  };

  useEffect(() => {
    if (user && user.role === 'admin' && token) {
      fetchUsers();
    } else if (user && user.role !== 'admin') {
      setUsersFetchMessage('No tienes permisos de administrador para ver la lista de usuarios.');
    } else if (!loading) {
      setUsersFetchMessage('Inicia sesión para acceder al dashboard.');
    }
  }, [user, token, loading]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Usuarios obtenidos:', response.data);
      setUsersData(response.data);
      setUsersFetchMessage('Lista de usuarios cargada exitosamente.');
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      if (error.response && error.response.status === 403) {
        setUsersFetchMessage('No tienes permisos para ver esta información. (Rol no autorizado)');
      } else if (error.response && error.response.status === 401) {
        setUsersFetchMessage('Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.');
        logout();
      } else {
        setUsersFetchMessage('Error al cargar la lista de usuarios.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-yellow-500 text-xl">
        Cargando dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 text-xl">
        <p>Acceso denegado. Por favor, inicia sesión para ver este contenido.</p>
        <Link to="/login" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="container mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {getWelcomeMessage(user.username, user.role)}
        </h1>

        {user.role === 'admin' ? (
          <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
              Panel de Administración
            </h2>
            <p className="text-lg mb-4">
              Aquí puedes gestionar usuarios, roles, configuraciones del sistema, y ver estadísticas avanzadas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Link to="/admin/users-management" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                Gestionar Usuarios
              </Link>
              <Link to="/admin/reports" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                Ver Reportes
              </Link>
              <Link to="/admin/settings" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                Configuración del Sistema
              </Link>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-300">
              Lista de Usuarios
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{usersFetchMessage}</p>
            <div className="overflow-x-auto bg-white dark:bg-gray-700 rounded-lg shadow">
              {usersData.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Foto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rol
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {usersData.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {u.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.profile_picture ? ( 
                            <img
                              src={u.profile_picture}
                              alt={`Perfil de ${u.username}`}
                              // **** ¡CAMBIO APLICADO AQUÍ! ****
                              className="block w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 min-w-10 min-h-10"
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_PICTURE; }}
                            />
                          ) : (
                            <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {u.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${u.role === 'admin'
                              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {usersFetchMessage === 'Lista de usuarios cargada exitosamente.' && usersData.length === 0
                    ? 'No hay usuarios registrados.'
                    : usersFetchMessage}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 p-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-200">
              Tu Panel de Usuario
            </h2>
            <p className="text-lg mb-4">
              Desde aquí puedes acceder a tus tickets de soporte, ver el estado de tus solicitudes y actualizar tu perfil.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/user/my-tickets" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                Mis Tickets
              </Link>
              <Link to="/user/profile" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300">
                Editar Perfil
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            ¡Explora las funcionalidades de tu portal!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;