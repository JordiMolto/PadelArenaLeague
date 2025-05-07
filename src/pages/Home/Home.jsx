import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Explora Torneos y Ligas de Pádel GRATIS en tu zona!
            </h1>
            <p className={styles.heroSubtitle}>
              Plataforma web gratuita y flexible para organizar ligas y torneos
              de pádel no oficiales. ¡Conéctate con jugadores, administra
              resultados y mucho más!
            </p>
            <div className={styles.heroButtons}>
              <Link to="/auth" className={styles.primaryButton}>
                Comenzar Ahora
              </Link>
              <Link to="/ligas" className={styles.secondaryButton}>
                Explorar Ligas
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imagePlaceholder}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Características Principales</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>edit_note</span>
              <h3 className={styles.featureTitle}>Inscripción Simplificada</h3>
              <p className={styles.featureDescription}>
                Regístrate en ligas según la temporada en curso o en torneos
                específicos con solo unos clics.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>autorenew</span>
              <h3 className={styles.featureTitle}>Generación Automática</h3>
              <p className={styles.featureDescription}>
                La plataforma asigna los encuentros según inscripciones y
                disponibilidad semanal de los jugadores.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>leaderboard</span>
              <h3 className={styles.featureTitle}>
                Clasificación en Tiempo Real
              </h3>
              <p className={styles.featureDescription}>
                Resultados actualizados a medida que se disputan los partidos,
                generando automáticamente la tabla.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>groups</span>
              <h3 className={styles.featureTitle}>Gestión de Equipos</h3>
              <p className={styles.featureDescription}>
                Forma equipos, revisa estadísticas y consulta información sobre
                los participantes.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>event</span>
              <h3 className={styles.featureTitle}>Seguimiento de Encuentros</h3>
              <p className={styles.featureDescription}>
                Calendario de partidos con fechas, horarios y emparejamientos
                sugeridos.
              </p>
            </div>

            <div className={styles.featureCard}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>chat</span>
              <h3 className={styles.featureTitle}>Comunicación</h3>
              <p className={styles.featureDescription}>
                Sistema de mensajes para coordinar partidos y recibir
                notificaciones sobre encuentros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Regístrate</h3>
              <p className={styles.stepDescription}>
                Crea tu cuenta y perfil de jugador con tus datos y nivel de
                juego.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Inscríbete</h3>
              <p className={styles.stepDescription}>
                Únete a una liga o torneo e indica tu disponibilidad semanal.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Juega</h3>
              <p className={styles.stepDescription}>
                Recibe notificaciones de tus partidos programados y coordina con
                tu oponente.
              </p>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Registra</h3>
              <p className={styles.stepDescription}>
                Ingresa los resultados de tus partidos y sigue tu progreso en la
                clasificación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>¿Listo para comenzar?</h2>
          <p className={styles.ctaDescription}>
            Únete a nuestra comunidad de jugadores de pádel y disfruta de una
            experiencia de juego organizada y flexible.
          </p>
          <Link to="/auth" className={styles.ctaButton}>
            Registrarse Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
