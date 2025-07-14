// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de haber instalado jwt-decode: npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log('Token expirado, cerrando sesión.');
          logout(); // Llama a la función de logout para limpiar todo
        } else {
          setUser(decodedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout(); // Si el token es inválido, cerrar sesión
      }
    }
    setLoading(false); // La carga inicial ha terminado
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const updateProfilePicture = (newPictureUrl) => {
    setUser(prevUser => ({
      ...prevUser,
      profilePicture: newPictureUrl // Actualiza la propiedad profilePicture
    }));
  };


  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout, updateProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};