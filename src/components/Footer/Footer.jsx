import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Padel Arena League</h3>
            <p className={styles.footerDescription}>
              Plataforma web gratuita y flexible diseñada para la gestión automática de ligas y torneos de pádel no oficiales.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Enlaces Rápidos</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/" className={styles.footerLink}>Inicio</Link>
              </li>
              <li>
                <Link to="/ligas" className={styles.footerLink}>Ligas</Link>
              </li>
              <li>
                <Link to="/torneos" className={styles.footerLink}>Torneos</Link>
              </li>
              <li>
                <Link to="/noticias" className={styles.footerLink}>Noticias</Link>
              </li>
              <li>
                <Link to="/contacto" className={styles.footerLink}>Contacto</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Información</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/reglamento" className={styles.footerLink}>Reglamento</Link>
              </li>
              <li>
                <Link to="/faq" className={styles.footerLink}>Preguntas Frecuentes</Link>
              </li>
              <li>
                <Link to="/privacidad" className={styles.footerLink}>Política de Privacidad</Link>
              </li>
              <li>
                <Link to="/terminos" className={styles.footerLink}>Términos y Condiciones</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contacto</h3>
            <ul className={styles.contactInfo}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <a href="mailto:info@padelarenaleague.com" className={styles.contactLink}>
                  info@padelarenaleague.com
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>📱</span>
                <a href="tel:+34600000000" className={styles.contactLink}>
                  +34 600 000 000
                </a>
              </li>
            </ul>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                FB
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                TW
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                IG
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Padel Arena League. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 