import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../services/supabase";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados para visibilidad de menús
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLigasTorneosMenu, setShowLigasTorneosMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Nuevos estados para sub-menús anidados
  const [showSubLigasMenu, setShowSubLigasMenu] = useState(false);
  const [showSubTorneosMenu, setShowSubTorneosMenu] = useState(false);

  // Refs para cerrar menús al hacer clic fuera
  const ligasTorneosMenuRef = useRef(null);
  const infoMenuRef = useRef(null);
  const mediaMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Nuevas refs para sub-menús anidados
  const subLigasMenuRef = useRef(null);
  const subTorneosMenuRef = useRef(null);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await signOut();
    navigate("/");
  };

  // Funciones toggle para los menús
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const toggleLigasTorneosMenu = () => setShowLigasTorneosMenu(!showLigasTorneosMenu);
  const toggleInfoMenu = () => setShowInfoMenu(!showInfoMenu);
  const toggleMediaMenu = () => setShowMediaMenu(!showMediaMenu);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  // Nuevas funciones toggle para sub-menús
  const toggleSubLigasMenu = (e) => {
    e.stopPropagation();
    setShowSubLigasMenu(!showSubLigasMenu);
    setShowSubTorneosMenu(false);
  };

  const toggleSubTorneosMenu = (e) => {
    e.stopPropagation();
    setShowSubTorneosMenu(!showSubTorneosMenu);
    setShowSubLigasMenu(false);
  };

  // Función para cerrar todos los menús al hacer clic en un enlace
  const handleLinkClick = () => {
    setShowMobileMenu(false);
    setShowLigasTorneosMenu(false);
    setShowMediaMenu(false);
    setShowInfoMenu(false);
    setShowUserMenu(false);
    setShowSubLigasMenu(false);
    setShowSubTorneosMenu(false);
  };

  // Hook genérico para clics fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ligasTorneosMenuRef.current && !ligasTorneosMenuRef.current.contains(event.target)) {
        setShowLigasTorneosMenu(false);
        setShowSubLigasMenu(false);
        setShowSubTorneosMenu(false);
      }
      if (infoMenuRef.current && !infoMenuRef.current.contains(event.target)) {
        setShowInfoMenu(false);
      }
      if (mediaMenuRef.current && !mediaMenuRef.current.contains(event.target)) {
        setShowMediaMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={handleLinkClick}>
          PAL (pal)
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <span className={styles.menuIcon}></span>
        </button>

        <div
          className={`${styles.navMenu} ${showMobileMenu ? styles.active : ""}`}
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink} onClick={handleLinkClick}>
                Inicio
              </Link>
            </li>

            {/* Ligas & Torneos (Principal Dropdown) */}
            <li
              className={`${styles.navItem} ${styles.hasDropdown}`}
              ref={ligasTorneosMenuRef}
            >
              <button
                className={styles.dropdownToggle}
                onClick={toggleLigasTorneosMenu}
              >
                Ligas & Torneos <span className={styles.dropdownIcon}></span>
              </button>
              <ul
                className={`${styles.dropdown} ${
                  showLigasTorneosMenu ? styles.show : ""
                }`}
              >
                {/* Sub-menú de Ligas */}
                <li className={`${styles.navItem} ${styles.hasSubDropdown}`} ref={subLigasMenuRef}>
                  <button
                    className={styles.subDropdownToggle}
                    onClick={toggleSubLigasMenu}
                  >
                    Ligas <span className={styles.dropdownIcon}></span>
                  </button>
                  <ul
                    className={`${styles.subDropdown} ${
                      showSubLigasMenu ? styles.show : ""
                    }`}
                  >
                    <li><Link to="/ligas/inscripcion" className={styles.dropdownLink} onClick={handleLinkClick}>Inscripción Liga</Link></li>
                    <li><Link to="/ligas/clasificacion" className={styles.dropdownLink} onClick={handleLinkClick}>Clasificación</Link></li>
                    <li><Link to="/ligas/resultados" className={styles.dropdownLink} onClick={handleLinkClick}>Resultados Ligas</Link></li>
                    <li><Link to="/ligas/equipos" className={styles.dropdownLink} onClick={handleLinkClick}>Equipos</Link></li>
                    <li><Link to="/ligas/encuentros" className={styles.dropdownLink} onClick={handleLinkClick}>Encuentros</Link></li>
                  </ul>
                </li>

                {/* Sub-menú de Torneos */}
                <li className={`${styles.navItem} ${styles.hasSubDropdown}`} ref={subTorneosMenuRef}>
                  <button
                    className={styles.subDropdownToggle}
                    onClick={toggleSubTorneosMenu}
                  >
                    Torneos <span className={styles.dropdownIcon}></span>
                  </button>
                  <ul
                    className={`${styles.subDropdown} ${
                      showSubTorneosMenu ? styles.show : ""
                    }`}
                  >
                    <li><Link to="/torneos/inscripcion" className={styles.dropdownLink} onClick={handleLinkClick}>Inscripción Torneo</Link></li>
                    <li><Link to="/torneos/cuadros" className={styles.dropdownLink} onClick={handleLinkClick}>Cuadros & Partidos</Link></li>
                    <li><Link to="/torneos/resultados" className={styles.dropdownLink} onClick={handleLinkClick}>Resultados Torneos</Link></li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Media (Nuevo Dropdown) */}
            <li
              className={`${styles.navItem} ${styles.hasDropdown}`}
              ref={mediaMenuRef}
            >
              <button
                className={styles.dropdownToggle}
                onClick={toggleMediaMenu}
              >
                Media <span className={styles.dropdownIcon}></span>
              </button>
              <ul
                className={`${styles.dropdown} ${
                  showMediaMenu ? styles.show : ""
                }`}
              >
                <li><Link to="/noticias" className={styles.dropdownLink} onClick={handleLinkClick}>Noticias</Link></li>
                <li><Link to="/galeria" className={styles.dropdownLink} onClick={handleLinkClick}>Galería</Link></li>
              </ul>
            </li>

            {/* Info (Nuevo Dropdown) */}
            <li
              className={`${styles.navItem} ${styles.hasDropdown}`}
              ref={infoMenuRef}
            >
              <button
                className={styles.dropdownToggle}
                onClick={toggleInfoMenu}
              >
                Info <span className={styles.dropdownIcon}></span>
              </button>
              <ul
                className={`${styles.dropdown} ${
                  showInfoMenu ? styles.show : ""
                }`}
              >
                <li><Link to="/reglamento" className={styles.dropdownLink} onClick={handleLinkClick}>Reglamento</Link></li>
                <li><Link to="/faq" className={styles.dropdownLink} onClick={handleLinkClick}>FAQ</Link></li>
              </ul>
            </li>
          </ul>

          {/* Iconos y Menú de Usuario a la derecha */}
          <div className={styles.navActions}>
            {/* Contacto (Icono) */}
            <Link to="/contacto" className={styles.iconLink} title="Contacto" onClick={handleLinkClick}>
              <span className="material-symbols-outlined">help</span>
            </Link>

            {/* Mensajes (Icono, solo si está autenticado) */}
            {isAuthenticated && (
              <Link to="/chat" className={styles.iconLink} title="Mensajes" onClick={handleLinkClick}>
                <span className="material-symbols-outlined">mail</span>
              </Link>
            )}

            {/* Menú Usuario / Login */}
            {isAuthenticated ? (
              <div
                className={`${styles.navItem} ${styles.hasDropdown}`}
                ref={userMenuRef}
              >
                <button
                  className={styles.iconButton}
                  onClick={toggleUserMenu}
                  title="Mi Cuenta"
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                </button>
                <ul
                  className={`${styles.dropdown} ${styles.userDropdown} ${
                    showUserMenu ? styles.show : ""
                  }`}
                >
                  <li><Link to="/dashboard" className={styles.dropdownLink} onClick={handleLinkClick}>Dashboard</Link></li>
                  <li><Link to="/profile" className={styles.dropdownLink} onClick={handleLinkClick}>Mi Perfil</Link></li>
                  <li>
                    <hr className={styles.dropdownDivider} />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownButton}
                    >
                      <span className="material-symbols-outlined">logout</span>{" "}
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/auth"
                className={styles.iconLink}
                title="Iniciar Sesión"
                onClick={handleLinkClick}
              >
                <span className="material-symbols-outlined">login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
