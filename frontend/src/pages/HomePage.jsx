// frontend/src/pages/HomePage.jsx
import React from 'react';
import ImageSlider from '../components/ImageSlider';

const HomePage = () => {
  return (
    <>
      {/* Sección Hero: El contenedor principal del slider */}
      {/* h-[750px] define una altura fija. Puedes ajustarla a h-[800px] si prefieres más alto. */}
      {/* overflow-hidden es crucial para contener el efecto de zoom */}
      <section className="relative w-full h-[750px] overflow-hidden">
        <ImageSlider />
      </section>

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