// frontend/src/App.jsx
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Importa el proveedor de autenticación

// Importa tus componentes de página
import Navbar from './components/Navbar'; // Tu Navbar existente

// Importa Outlet, que es crucial para los layouts en react-router-dom v6+
import { Outlet } from 'react-router-dom';

function App() {
  return (
      <AuthProvider> {/* AuthProvider envuelve todo el layout */}
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Navbar /> {/* La Navbar está aquí, fuera del Outlet */}

          {/* El Outlet renderizará la página actual (HomePage, LoginPage, DashboardPage, etc.) */}
          {/* según la ruta definida en main.jsx */}
          <main className="flex-grow"> {/* Puedes ajustar el estilo de tu main si lo necesitas */}
            <Outlet />
          </main>

          {/* Tu footer original de HomePage.jsx que estaba dentro de App.jsx */}
          <footer className="bg-gray-800 dark:bg-gray-950 text-gray-400 p-6 text-center shadow-inner">
            <div className="container mx-auto">
              <p className="text-sm">&copy; 2025 Zona Pits MP. Portal Integral para Técnicos de Soporte. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    // </Router> // ELIMINAR ESTA ETIQUETA
  );
}

export default App;