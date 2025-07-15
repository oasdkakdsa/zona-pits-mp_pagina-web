// frontend/src/components/ImageSlider.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HeroSlider.module.css'; // Importa los estilos CSS

// Datos originales de los slides (ajusta según tus IDs reales)
const originalSlidesData = [
  {
    id: 1, // Acceso exclusivo a Soporte Especializado
    src: '/slider_images/slide_soporte.jpg',
    alt: 'Soporte Especializado',
    caption: 'Acceso Exclusivo a Soporte Especializado',
    description: 'Nuestros expertos están listos para asistirte 24/7 con diagnósticos precisos y soluciones rápidas para tu maquinaria pesada.',
    buttons: [{ text: 'Solicitar Soporte', to: '/support' }],
  },
  {
    id: 2, // Nuestra pasión por la maquinaria pesada
    src: '/slider_images/slide_pasion.jpg',
    alt: 'Maquinaria Pesada',
    caption: 'Nuestra Pasión por la Maquinaria Pesada',
    description: 'En ZONA PITS MP, transformamos la complejidad mecánica en soluciones eficientes y duraderas para tu negocio.',
    buttons: [],
  },
  {
    id: 3, // Encuentra todo lo que necesitas en nuestra tienda
    src: '/slider_images/slide_tienda.jpg',
    alt: 'Tienda de Repuestos',
    caption: 'Encuentra Todo lo que Necesitas en Nuestra Tienda',
    description: 'Amplio catálogo de repuestos originales y de alta calidad para mantener tu maquinaria operando al máximo rendimiento.',
    buttons: [{ text: 'Explorar Tienda', to: '/store' }],
  },
  {
    id: 4, // Servicios Integrales para el cuidado de tu maquinaria
    src: '/slider_images/slide_servicios.jpg',
    alt: 'Servicios Integrales',
    caption: 'Servicios Integrales para el Cuidado de Tu Maquinaria',
    description: 'Ofrecemos mantenimiento preventivo, correctivo y predictivo, asegurando la máxima vida útil y eficiencia de tus equipos.',
    buttons: [{ text: 'Ver Servicios', to: '/services' }],
  },
  {
    id: 5, // Capacitación
    src: '/slider_images/slide_capacitacion.jpg',
    alt: 'Capacitación',
    caption: 'Invierte en tu conocimiento con nuestra capacitación especializada',
    description: 'Amplía tus habilidades y conocimientos con nuestros cursos y programas de capacitación técnica diseñados para profesionales de la maquinaria pesada.',
    buttons: [{ text: 'Ver Cursos', to: '/training' }],
  },
  {
    id: 6, // Carrera profesional
    src: '/slider_images/slide_carrera.jpg',
    alt: 'Carrera Profesional',
    caption: 'Desarrolla tu carrera profesional con nosotros',
    description: 'Buscamos talento apasionado por la maquinaria pesada. Si eres un profesional con experiencia y ganas de crecer, consulta nuestras oportunidades laborales y únete a nuestro equipo.',
    buttons: [{ text: 'Ver Oportunidades', to: '/careers' }],
  },
];


function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define el orden y combinación de los slides
  const slidesData = [
    // NUEVO SLIDE INTRODUCTORIO - EN PRIMER LUGAR
    {
      id: 'intro-slide',
      src: '/slider_images/slide_intro_zonapits.jpeg', // Asegúrate de tener esta imagen o cámbiala
      alt: 'ZONA PITS MP Introducción',
      caption: 'ZONA PITS MP',
      description: 'Zona del Portal Integral para Técnicos de Soporte de Maquinaria Pesada. Tu aliado en diagnóstico, mantenimiento y capacitación para optimizar tu maquinaria pesada.',
      buttons: [ // ¡AÑADIDOS DE NUEVO LOS BOTONES DE INICIAR SESIÓN Y REGISTRARSE!
        { text: 'Iniciar Sesión', to: '/login' },
        { text: 'Registrarse', to: '/register' },
      ],
    },
    // El resto de slides en el orden especificado
    originalSlidesData.find(slide => slide.id === 2), // 1. "Nuestra pasion por la maquinaria pesada"
    {
      id: 'combined-training-career', // 2. Combinación de capacitación y carrera
      src: '/slider_images/slide_capacitacion.jpg', // Puedes elegir la imagen que prefieras
      alt: 'Capacitación y Carrera Profesional',
      caption: 'Invierte en tu Conocimiento y Desarrolla tu Carrera Profesional con Nosotros',
      description: `Amplía tus habilidades y conocimientos con nuestros cursos y programas de capacitación técnica diseñados para profesionales de la maquinaria pesada. ¡Certifícate y destaca en tu campo! También buscamos talento apasionado por la maquinaria pesada. Si eres un profesional con experiencia y ganas de crecer, consulta nuestras oportunidades laborales y únete a nuestro equipo.`,
      buttons: [
        { text: 'Ver Cursos', to: '/training' },
        { text: 'Ver Oportunidades', to: '/careers' },
      ],
    },
    originalSlidesData.find(slide => slide.id === 1), // 3. "Acceso exclusivo a Soporte Especializado"
    originalSlidesData.find(slide => slide.id === 4), // 4. "Servicios Integrales para el cuidado de tu maquinaria"
    originalSlidesData.find(slide => slide.id === 3), // 5. "Encuentra todo lo que necesitas en nuestra tienda"
  ].filter(Boolean); // .filter(Boolean) para remover posibles 'undefined' si un ID no se encuentra

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slidesData.length) % slidesData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.sliderContainer}>
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
        >
          <img src={slide.src} alt={slide.alt} className={styles.slideImage} />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <h2 className={styles.caption}>{slide.caption}</h2>
            <p className={styles.description}>{slide.description}</p>
            {slide.buttons && slide.buttons.length > 0 && (
              <div className={styles.buttons}>
                {slide.buttons.map((button, btnIndex) => (
                  <Link key={btnIndex} to={button.to} className={styles.button}>
                    {button.text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Flechas de navegación */}
      <button onClick={prevSlide} className={`${styles.arrow} ${styles.prev}`}>
        &#10094; {/* Carácter de flecha izquierda */}
      </button>
      <button onClick={nextSlide} className={`${styles.arrow} ${styles.next}`}>
        &#10095; {/* Carácter de flecha derecha */}
      </button>

      {/* Puntos de navegación */}
      <div className={styles.dots}>
        {slidesData.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;