// frontend/src/pages/HomePage.jsx
import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider';
import SideVideoColumn from '../components/SideVideoColumn'; // Importa el nuevo componente
import { IoInformationCircleOutline } from 'react-icons/io5'; // Icono para el botón

const HomePage = () => {
  const [isColumnOpen, setIsColumnOpen] = useState(false);

  const toggleColumn = () => {
    setIsColumnOpen(!isColumnOpen);
  };

  return (
    <>
      {/* Sección Hero y Columna Lateral */}
      {/* Contenedor principal que permite posicionar la columna lateral */}
      <div className="relative w-full overflow-hidden">
        {/* Slider */}
        <section className="relative w-full h-[750px]">
          <ImageSlider />
        </section>

        {/* Botón Flotante para abrir la columna lateral */}
        <button
          onClick={toggleColumn}
          className={`fixed top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 p-3 rounded-full bg-yellow-500 text-white shadow-lg z-50
                      hover:bg-yellow-600 transition-all duration-300 ease-in-out
                      ${isColumnOpen ? 'rotate-180 -translate-x-full mr-2' : ''} /* Gira y mueve el botón si la columna está abierta */
                      animate-bounce-slow`} /* Animación de rebote sutil */
          style={{ marginRight: isColumnOpen ? '26rem' : '0rem' }} // Ajusta el margen para mover el botón junto con la columna
        >
          <IoInformationCircleOutline className="w-8 h-8" /> {/* Icono de información */}
        </button>


        {/* Columna Lateral de Videos */}
        <SideVideoColumn isOpen={isColumnOpen} onClose={toggleColumn} />
      </div>

      {/* Resto del contenido de tu página principal (sin cambios) */}
      <main className="flex-grow container mx-auto p-8 mt-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">Portal de Soporte Técnico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Diagnósticos y Solución de Problemas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-yellow-500/30">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Diagnósticos y Solución de Problemas</h3>
            <p className="text-gray-600 dark:text-gray-300">Encuentra guías paso a paso para identificar y solucionar fallas comunes en diferentes modelos de maquinaria.</p>
          </div>
          {/* Card 2: Manuales y Esquemas Actualizados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-yellow-500/30">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Manuales y Esquemas Actualizados</h3>
            <p className="text-gray-600 dark:text-gray-300">Acceso instantáneo a manuales de servicio, diagramas eléctricos e hidráulicos oficiales.</p>
          </div>
          {/* Card 3: Capacitación y Cursos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-yellow-500/30">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-50">Capacitación Continua Online</h3>
            <p className="text-gray-600 dark:text-gray-300">Cursos especializados y videos tutoriales para técnicos que buscan certificar sus habilidades.</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;