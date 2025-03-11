import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../services/supabase';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLigasMenu, setShowLigasMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleLigasMenu = () => {
    setShowLigasMenu(!showLigasMenu);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Padel Arena League
        </Link>

        <button 
          className={styles.mobileMenuButton} 
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <span className={styles.menuIcon}></span>
        </button>

        <div className={`${styles.navMenu} ${showMobileMenu ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>Inicio</Link>
            </li>
            
            <li className={`${styles.navItem} ${styles.hasDropdown}`}>
              <button 
                className={styles.dropdownToggle} 
                onClick={toggleLigasMenu}
              >
                Ligas & Torneos
                <span className={styles.dropdownIcon}></span>
              </button>
              
              <ul className={`${styles.dropdown} ${showLigasMenu ? styles.show : ''}`}>
                <li>
                  <Link to="/ligas" className={styles.dropdownLink}>Ligas</Link>
                </li>
                <li>
                  <Link to="/ligas/inscripcion" className={styles.dropdownLink}>Inscripción</Link>
                </li>
                <li>
                  <Link to="/ligas/clasificacion" className={styles.dropdownLink}>Clasificación</Link>
                </li>
                <li>
                  <Link to="/ligas/resultados" className={styles.dropdownLink}>Resultados</Link>
                </li>
                <li>
                  <Link to="/ligas/equipos" className={styles.dropdownLink}>Equipos</Link>
                </li>
                <li>
                  <Link to="/ligas/encuentros" className={styles.dropdownLink}>Encuentros</Link>
                </li>
                <li>
                  <Link to="/torneos" className={styles.dropdownLink}>Torneos</Link>
                </li>
              </ul>
            </li>
            
            <li className={styles.navItem}>
              <Link to="/noticias" className={styles.navLink}>Noticias</Link>
            </li>
            
            <li className={styles.navItem}>
              <Link to="/galeria" className={styles.navLink}>Galería</Link>
            </li>
            
            <li className={styles.navItem}>
              <Link to="/reglamento" className={styles.navLink}>Reglamento</Link>
            </li>
            
            <li className={styles.navItem}>
              <Link to="/faq" className={styles.navLink}>FAQ</Link>
            </li>
            
            <li className={styles.navItem}>
              <Link to="/contacto" className={styles.navLink}>Contacto</Link>
            </li>
          </ul>

          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
                <Link to="/chat" className={styles.navLink}>
                  Mensajes
                </Link>
                <Link to="/profile" className={styles.navLink}>
                  Mi Perfil
                </Link>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/auth" className={styles.loginButton}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 