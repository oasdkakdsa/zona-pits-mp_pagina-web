// frontend/src/components/SideVideoColumn.jsx
import React from 'react';
import { IoCloseCircleOutline, IoPlayCircleOutline } from 'react-icons/io5'; // Importa iconos de cierre y play

function SideVideoColumn({ isOpen, onClose }) {
  // Define un array de videos de ejemplo para cada sección.
  const tipsVideos = [
    { id: 1, title: 'Tip 1: Mantenimiento Preventivo de Motores', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Tip+1' },
    { id: 2, title: 'Tip 2: Inspección Diaria de Trenes de Rodaje', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Tip+2' },
    { id: 3, title: 'Tip 3: Optimización del Consumo de Combustible', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Tip+3' },
  ];

  const webinarVideos = [
    { id: 1, title: 'Webinar: Diagnóstico Avanzado de Fallas Hidráulicas', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Webinar+1' },
    { id: 2, title: 'Charla: Seguridad en Operación de Maquinaria Pesada', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Webinar+2' },
    { id: 3, title: 'Webinar: Tendencias en Tecnología de Maquinaria 2025', thumbnail: 'https://via.placeholder.com/150x80?text=Video+Webinar+3' },
  ];

  // Función placeholder para reproducir video
  const playVideo = (videoTitle) => {
    alert(`Reproduciendo video: "${videoTitle}" (Funcionalidad de reproducción se implementará con los videos reales)`);
    // Aquí es donde integrarías un reproductor de video (ej. iframe de YouTube, o un modal)
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-2xl p-6 transform transition-transform duration-500 ease-in-out z-[100]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">Contenido Exclusivo</h2>
        <button onClick={onClose} className="bg-transparent p-0 text-gray-300 hover:text-white transition-colors duration-300">
          <IoCloseCircleOutline className="w-8 h-8" />
        </button>
      </div>

      {/* Sección 1: TIPS DE MANTENIMIENTO Y OPERACIÓN */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">TIPS DE MANTENIMIENTO Y OPERACIÓN</h3>
        <div className="space-y-4">
          {tipsVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => playVideo(video.title)}
            >
              <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded" />
              <p className="text-gray-100 text-sm font-medium flex-grow">{video.title}</p>
              <IoPlayCircleOutline className="w-6 h-6 text-yellow-500" />
            </div>
          ))}
          {tipsVideos.length === 0 && (
            <p className="text-gray-400">Videos de tips próximos...</p>
          )}
        </div>
      </div>

      {/* Sección 2: WEBINAR Y CHARLAS TÉCNICAS */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">WEBINAR Y CHARLAS TÉCNICAS</h3>
        <div className="space-y-4">
          {webinarVideos.map((video) => (
            <div
              key={video.id}
              className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => playVideo(video.title)}
            >
              <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded" />
              <p className="text-gray-100 text-sm font-medium flex-grow">{video.title}</p>
              <IoPlayCircleOutline className="w-6 h-6 text-yellow-500" />
            </div>
          ))}
          {webinarVideos.length === 0 && (
            <p className="text-gray-400">Videos de webinars próximos...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideVideoColumn;