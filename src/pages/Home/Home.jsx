import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from 'react';
import styles from "./Home.module.css";

// Datos Mock para Ligas Activas y Testimonios
const mockLigasActivas = [
  {
    id: "liga-primavera-2024-h",
    nombre: "Liga Primavera 2024 - Nivel Intermedio Hombres",
    descripcion: "Compite en formato liguilla durante la primavera. Ideal para mejorar tu juego.",
    fechaInicio: "15 de Abril, 2024",
    plazasRestantes: 5,
    jugadoresActivos: 27,
    partidosJugadosPercent: 75,
  },
  {
    id: "liga-primavera-2024-m",
    nombre: "Liga Primavera 2024 - Nivel Iniciación Mixta",
    descripcion: "Perfecta para empezar a competir en un ambiente divertido y social.",
    fechaInicio: "22 de Abril, 2024",
    plazasRestantes: 8,
    jugadoresActivos: 16,
    partidosJugadosPercent: 60,
  },
];

const mockTestimonios = [
  {
    id: 1,
    texto: "Antes organizábamos todo por WhatsApp y era un caos. Ahora con Padel Arena League todo va solo, ¡una maravilla!",
    nombre: "Carlos G.",
    equipo: "Los Revientapistas",
    // imagenUrl: 'url-a-imagen-real-o-placeholder'
  },
  {
    id: 2,
    texto: "La generación automática de partidos según nuestra disponibilidad es lo mejor. ¡Nos ahorra muchísimo tiempo!",
    nombre: "Ana F.",
    equipo: "Las Reinas del Padel",
    // imagenUrl: 'url-a-imagen-real-o-placeholder'
  },
  {
    id: 3,
    texto: "Muy fácil de usar y la clasificación siempre está actualizada. ¡Recomendado 100%!",
    nombre: "Javier M.",
    equipo: "Padel Trotters",
    // imagenUrl: 'url-a-imagen-real-o-placeholder'
  },
];

// Hook personalizado para IntersectionObserver (opcional, se puede integrar directamente)
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

const Home = () => {
  // Usar el hook para cada sección
  // Ajustar el threshold según se necesite (0.1 significa que el 10% de la sección debe estar visible)
  const [howItWorksRef, isHowItWorksVisible] = useElementOnScreen({ threshold: 0.1 });
  const [featuresRef, isFeaturesVisible] = useElementOnScreen({ threshold: 0.1 });
  const [ligasActivasRef, isLigasActivasVisible] = useElementOnScreen({ threshold: 0.1 });
  const [testimoniosRef, isTestimoniosVisible] = useElementOnScreen({ threshold: 0.1 });
  const [faqRef, isFaqVisible] = useElementOnScreen({ threshold: 0.1 });

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Tu liga de pádel, automatizada y sin complicaciones
            </h1>
            <p className={styles.heroSubtitle}>
              Regístrate gratis y deja que la plataforma se encargue de organizar partidos, resultados y clasificación según tu disponibilidad.
            </p>
            <div className={styles.heroButtons}>
              {/* Enlace a /auth o sección de inscripción si estuviera en la misma página */}
              <Link to="/auth" className={styles.primaryButton}>
                Comenzar Ahora
              </Link>
              {/* Enlace interno a la sección "Cómo funciona" */}
              <a href="#como-funciona" className={styles.secondaryButton}>
                Ver cómo funciona
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* Mantenemos el placeholder, idealmente reemplazar con imagen relevante */}
            <div className={styles.imagePlaceholder}></div>
          </div>
        </div>
      </section>

      {/* Cómo funciona Section */}
      <section 
        id="como-funciona" 
        ref={howItWorksRef} 
        className={`${styles.howItWorks} ${styles.sectionAnimate} ${isHowItWorksVisible ? styles.visible : ''}`}
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIconContainer}>
                <span className={`material-symbols-outlined ${styles.stepIcon}`}>how_to_reg</span>
              </div>
              <h3 className={styles.stepTitle}>1. Inscríbete</h3>
              <p className={styles.stepDescription}>
                Elige la liga activa que mejor se adapte a tu nivel y categoría.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIconContainer}>
                 <span className={`material-symbols-outlined ${styles.stepIcon}`}>calendar_clock</span>
              </div>
              <h3 className={styles.stepTitle}>2. Indica Disponibilidad</h3>
              <p className={styles.stepDescription}>
                Marca tus horarios preferidos y la plataforma generará los encuentros automáticamente.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepIconContainer}>
                <span className={`material-symbols-outlined ${styles.stepIcon}`}>scoreboard</span>
              </div>
              <h3 className={styles.stepTitle}>3. Juega y Sigue</h3>
              <p className={styles.stepDescription}>
                Disputa tus partidos, reporta el resultado y consulta la clasificación en tiempo real.
              </p>
            </div>
          </div>
           <div className={styles.ctaHowItWorks}>
              <Link to="/ligas/clasificacion" className={styles.primaryButtonOutline}>
                Explora una liga activa
              </Link>
           </div>
        </div>
      </section>

      {/* Beneficios Section (Reutilizando .features) */}
      <section 
        ref={featuresRef} 
        className={`${styles.features} ${styles.sectionAnimate} ${isFeaturesVisible ? styles.visible : ''}`}
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Por Qué Padel Arena League?</h2>
          <div className={styles.featureGrid}> 
            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>smart_toy</span>
              <h3 className={styles.featureTitle}>Automatización Completa</h3>
              <p className={styles.featureDescription}>
                Partidos generados automáticamente según la disponibilidad indicada. ¡Olvídate de coordinar!
              </p>
            </div>
            <div className={styles.featureCard}>
               <span className={`material-symbols-outlined ${styles.featureIcon}`}>no_accounts</span> 
               <h3 className={styles.featureTitle}>Sin Gestión Manual</h3>
               <p className={styles.featureDescription}>
                  Adiós a los grupos de WhatsApp, hojas de cálculo o buscar árbitros. Todo centralizado.
               </p>
             </div>
            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>leaderboard</span>
              <h3 className={styles.featureTitle}>Resultados y Ranking en Vivo</h3>
              <p className={styles.featureDescription}>
                Introduce los resultados y la clasificación se actualiza al instante para todos.
              </p>
            </div>
             <div className={styles.featureCard}>
               <span className={`material-symbols-outlined ${styles.featureIcon}`}>sports_tennis</span>
               <h3 className={styles.featureTitle}>Diseñado para Amateurs</h3>
               <p className={styles.featureDescription}>
                 Enfocado en la flexibilidad y la diversión para jugadores de todos los niveles y clubes.
               </p>
             </div>
             <div className={styles.featureCard}>
               <span className={`material-symbols-outlined ${styles.featureIcon}`}>price_check</span>
               <h3 className={styles.featureTitle}>100% Gratuito</h3>
               <p className={styles.featureDescription}>
                 Sin costes ocultos ni comisiones. Disfruta de la organización de tus ligas sin pagar nada.
               </p>
             </div>
             {/* Podría ir otro beneficio como comunicación integrada */}
          </div>
        </div>
      </section>

      {/* Ligas Activas Section */}
      <section 
        ref={ligasActivasRef} 
        className={`${styles.ligasActivas} ${styles.sectionAnimate} ${isLigasActivasVisible ? styles.visible : ''}`}
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ligas con Inscripción Abierta</h2>
          <div className={styles.ligasGrid}>
            {mockLigasActivas.map((liga) => (
              <div key={liga.id} className={styles.ligaCard}>
                <h3 className={styles.ligaNombre}>{liga.nombre}</h3>
                <p className={styles.ligaDescripcion}>{liga.descripcion}</p>
                <div className={styles.ligaInfo}>
                  <span>📅 Inicio: {liga.fechaInicio}</span>
                  <span>⚡ Plazas: {liga.plazasRestantes} restantes</span>
                </div>
                 <div className={styles.ligaStats}>
                   <span>{liga.jugadoresActivos} jugadores activos</span>
                   <span>{liga.partidosJugadosPercent}% partidos jugados</span>
                 </div>
                <Link to="/ligas/inscripcion" className={styles.ligaCTAButton}>
                  ¡Únete ahora!
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section 
        ref={testimoniosRef} 
        className={`${styles.testimonios} ${styles.sectionAnimate} ${isTestimoniosVisible ? styles.visible : ''}`}
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Lo Que Dicen Nuestros Jugadores</h2>
          <div className={styles.testimoniosGrid}>
            {mockTestimonios.map((testimonio) => (
              <div key={testimonio.id} className={styles.testimonioCard}>
                <span className={`material-symbols-outlined ${styles.testimonioIcon}`}>format_quote</span>
                <p className={styles.testimonioTexto}>"{testimonio.texto}"</p>
                <div className={styles.testimonioAutor}>
                  {/* <img src={testimonio.imagenUrl || 'placeholder.jpg'} alt={testimonio.nombre} className={styles.testimonioAvatar} /> */}
                   <span className={`material-symbols-outlined ${styles.testimonioAvatarPlaceholder}`}>account_circle</span> 
                  <div className={styles.autorInfo}>
                    <span className={styles.autorNombre}>{testimonio.nombre}</span>
                    <span className={styles.autorEquipo}>{testimonio.equipo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Destacadas Section */}
      <section 
        ref={faqRef} 
        className={`${styles.faqDestacadas} ${styles.sectionAnimate} ${isFaqVisible ? styles.visible : ''}`}
      >
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqPregunta}>¿Cuánto cuesta usar Padel Arena League?</h3>
              <p className={styles.faqRespuesta}>¡Absolutamente nada! La plataforma es y será siempre 100% gratuita para jugadores y organizadores de ligas amateur.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqPregunta}>¿Puedo elegir cuándo jugar mis partidos?</h3>
              <p className={styles.faqRespuesta}>Sí. Al inscribirte indicas tu disponibilidad semanal y la plataforma genera los enfrentamientos intentando respetarla al máximo.</p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqPregunta}>¿Qué pasa si no puedo jugar un partido asignado?</h3>
              <p className={styles.faqRespuesta}>Debes comunicarte con tu rival. Si no se llega a un acuerdo para reprogramar o no se juega, se aplica el reglamento (normalmente incomparecencia).</p>
            </div>
          </div>
          <div className={styles.ctaFaq}>
             <Link to="/faq" className={styles.secondaryButton}>Ver todas las preguntas</Link>
          </div>
        </div>
      </section>

      {/* El Footer se renderiza desde Layout.jsx, no es necesario aquí */}
    </div>
  );
};

export default Home;
