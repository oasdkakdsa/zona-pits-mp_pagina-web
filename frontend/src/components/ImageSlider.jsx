// frontend/src/components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HeroSlider.module.css'; // Asegúrate de que la ruta sea correcta

// Rutas de tus imágenes y contenido (ejemplo, DEBES COMPLETAR CON TUS 76 SLIDES)
const slidesData = [
  {
    id: 1,
    src: '/slider_images/slide_login.jpg', // Ruta de tu imagen en public/slider_images
    alt: 'Únete a nuestra comunidad',
    caption: 'Acceso Exclusivo a Soporte Especializado',
    description: '¿Aún no eres parte? Regístrate ahora y desbloquea un universo de manuales técnicos detallados, herramientas de diagnóstico avanzadas y el apoyo directo de expertos. ¡Optimiza tu maquinaria y maximiza tu productividad! Iniciar sesión es solo el comienzo.',
    buttons: [
      { text: 'Iniciar Sesión', to: '/login' },
      { text: 'Registrarse', to: '/register' },
    ],
  },
  {
    id: 2,
    src: '/slider_images/slide_nosotros.jpg',
    alt: 'Sobre Zona Pits MP',
    caption: 'Nuestra Pasión por la Maquinaria Pesada',
    description: 'Somos un equipo de profesionales dedicados a brindar soluciones integrales para el mundo de la maquinaria pesada. Con años de experiencia y un profundo conocimiento del sector, nuestra misión es ser tu aliado estratégico. Descubre quiénes somos y qué nos impulsa.',
    buttons: [
      { text: 'Conocer Más', to: '/about-us' },
    ],
  },
  {
    id: 3,
    src: '/slider_images/slide_tienda.jpg',
    alt: 'Tienda de repuestos y herramientas',
    caption: 'Encuentra Todo lo que Necesitas en Nuestra Tienda',
    description: 'Explora nuestro catálogo de repuestos originales, herramientas de alta calidad y equipos especializados para el mantenimiento y la reparación de tu maquinaria pesada. ¡Calidad y variedad a tu alcance!',
    buttons: [
      { text: 'Ir a la Tienda', to: '/shop' },
    ],
  },
  {
    id: 4,
    src: '/slider_images/slide_servicios.jpg',
    alt: 'Nuestros servicios especializados',
    caption: 'Servicios Integrales para el Cuidado de tu Maquinaria',
    description: 'Ofrecemos un amplio abanico de servicios diseñados para mantener tu maquinaria en óptimas condiciones: diagnóstico avanzado, mantenimiento preventivo, reparaciones especializadas y más. ¡Confía en nuestros expertos!',
    buttons: [
      { text: 'Ver Servicios', to: '/services' },
    ],
  },
  {
    id: 5,
    src: '/slider_images/slide_empleo.jpg',
    alt: 'Oportunidades de empleo',
    caption: 'Desarrolla tu Carrera Profesional con Nosotros',
    description: 'Buscamos talento apasionado por la maquinaria pesada. Si eres un profesional con experiencia y ganas de crecer, consulta nuestras oportunidades laborales y únete a nuestro equipo.',
    buttons: [
      { text: 'Ver Oportunidades', to: '/careers' },
    ],
  },
  {
    id: 6,
    src: '/slider_images/slide_capacitacion.jpg',
    alt: 'Cursos y capacitación técnica',
    caption: 'Invierte en tu Conocimiento con Nuestra Capacitación Especializada',
    description: 'Amplía tus habilidades y conocimientos con nuestros cursos y programas de capacitación técnica diseñados para profesionales de la maquinaria pesada. ¡Certifícate y destaca en tu campo!',
    buttons: [
      { text: 'Ver Cursos', to: '/training' },
    ],
  },
  // ... (AGREGA AQUÍ LOS OBJETOS PARA TUS OTRAS 70 IMÁGENES)
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null); // Ref para el temporizador del autoplay

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
        ),
      5000 // Cambia de slide cada 5 segundos
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]); // Reinicia el temporizador cada vez que cambia el slide

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.sliderContainer}>
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          // Aplica 'activeSlide' solo al slide actual para controlar la visibilidad y transición
          className={`${styles.slide} ${index === currentIndex ? styles.activeSlide : ''}`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className={styles.slideImage} // Aplica el estilo de imagen con zoom
          />
          <div className={styles.overlay}></div> {/* Overlay sobre la imagen */}
          <div className={styles.content}> {/* Contenido del slide */}
            <h2 className={styles.caption}>{slide.caption}</h2>
            <p className={styles.description}>{slide.description}</p>
            <div className={styles.buttons}>
              {slide.buttons &&
                slide.buttons.map((button, btnIndex) => (
                  <Link key={btnIndex} to={button.to} className={styles.button}>
                    {button.text}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      ))}

      {/* Flechas de navegación */}
      <button className={`${styles.arrow} ${styles.prev}`} onClick={prevSlide}>
        &lt;
      </button>
      <button className={`${styles.arrow} ${styles.next}`} onClick={nextSlide}>
        &gt;
      </button>

      {/* Puntos de paginación */}
      <div className={styles.dots}>
        {slidesData.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;