// frontend/src/components/Navbar.jsx
import React, { useState } from 'react'; // Eliminado useEffect ya no necesario
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchOutline, IoNotificationsOutline, IoSunnyOutline, IoMoonOutline, IoMenu, IoClose } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

const DEFAULT_PROFILE_PICTURE = '/default-avatar.png';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      return true;
    } else {
      document.documentElement.classList.remove('dark');
      return false;
    }
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-950 bg-opacity-30 backdrop-blur-md shadow-xl py-4 sticky top-0 z-50 
                    dark:bg-gray-950 dark:bg-opacity-30 transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo (Vuelto a su estado original, horizontal y sin subtexto adicional) */}
        <div className="text-white text-3xl font-extrabold tracking-wide drop-shadow-lg">
          <Link to="/" className="hover:text-yellow-300 transition duration-300">Zona Pits MP</Link>
        </div>

        {/* Sección de Navegación Principal (Desktop) */}
        <div className="hidden md:flex space-x-7 items-center">
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                        transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5"
            >
              Dashboard
            </Link>
          )}
          <Link to="#" className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                                   transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5">Soporte Técnico</Link>
          <Link to="#" className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                                   transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5">Documentación</Link>
          <Link to="#" className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                                   transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5">Capacitación</Link>
          <Link to="#" className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                                   transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5">Comunidad</Link>
          <Link to="#" className="text-gray-200 dark:text-gray-50 px-4 py-2 rounded-full font-semibold text-lg
                                   transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 hover:shadow-md hover:-translate-y-0.5">Contacto</Link>
        </div>

        {/* Sección de Utilidades e Autenticación (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button className="text-gray-200 dark:text-gray-50 hover:text-yellow-400 transition-all duration-300 p-2 rounded-full
                               hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70">
              <IoSearchOutline className="w-6 h-6" />
            </button>
            <button className="text-gray-200 dark:text-gray-50 hover:text-yellow-400 transition-all duration-300 p-2 rounded-full
                               hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70">
              <IoNotificationsOutline className="w-6 h-6" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-gray-200 dark:text-gray-50 hover:text-yellow-400 transition-all duration-300 p-2 rounded-full
                               hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-700 dark:hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70"
            >
              {isDarkMode ? <IoSunnyOutline className="w-6 h-6" /> : <IoMoonOutline className="w-6 h-6" />}
            </button>
          </div>

          <div className="h-6 w-px bg-gray-700 dark:bg-gray-600"></div>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-5 py-2 rounded-full 
                                            flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 
                                            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-70">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_PICTURE; }}
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6" />
                )}
                <span className="font-semibold">{user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 transition-all duration-300 px-5 py-2 rounded-full 
                                   shadow-lg hover:shadow-xl hover:-translate-y-0.5 
                                   focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-70"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 px-5 py-2 rounded-full 
                                         shadow-lg hover:shadow-xl hover:-translate-y-0.5 
                                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70">
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Botón del Menú Móvil */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-70 p-2 rounded-md">
            {isMobileMenuOpen ? <IoClose className="w-7 h-7" /> : <IoMenu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil (visible solo cuando isMobileMenuOpen es true) */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-sm 
                    dark:bg-gray-900 dark:bg-opacity-90 shadow-lg px-4 py-3 transform 
                    transition-all duration-300 ease-in-out origin-top ${
                      isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
                    }`}
      >
        <div className="flex flex-col space-y-3">
          {isAuthenticated && (
            <Link onClick={toggleMobileMenu} to="/dashboard" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
          )}

          <Link onClick={toggleMobileMenu} to="#" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Soporte Técnico</Link>
          <Link onClick={toggleMobileMenu} to="#" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Documentación</Link>
          <Link onClick={toggleMobileMenu} to="#" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Capacitación</Link>
          <Link onClick={toggleMobileMenu} to="#" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Comunidad</Link>
          <Link onClick={toggleMobileMenu} to="#" className="block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium">Contacto</Link>
          
          <hr className="border-gray-700 dark:border-gray-600 my-2" />

          <button className="w-full text-left block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2">
            <IoSearchOutline className="w-5 h-5" /> <span>Buscar</span>
          </button>
          <button className="w-full text-left block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2">
            <IoNotificationsOutline className="w-5 h-5" /> <span>Notificaciones</span>
          </button>
          <button
            onClick={() => { toggleDarkMode(); toggleMobileMenu(); }}
            className="w-full text-left block text-gray-200 dark:text-gray-50 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
          >
            {isDarkMode ? <><IoSunnyOutline className="w-5 h-5" /> <span>Modo Claro</span></> : <><IoMoonOutline className="w-5 h-5" /> <span>Modo Oscuro</span></>}
          </button>

          {isAuthenticated ? (
            <>
              <Link onClick={toggleMobileMenu} to="/profile" className="w-full text-left block text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 mt-2 shadow-md">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_PICTURE; }}
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6" />
                )}
                <span>Mi Perfil ({user?.username})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium mt-2 shadow-md"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link onClick={toggleMobileMenu} to="/login" className="w-full text-left block text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-md text-base font-medium mt-2 shadow-md">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;