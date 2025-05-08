import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Ligas.module.css'; // Usará el CSS compartido

// Hook useElementOnScreen 
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const callbackFunction = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [containerRef, options]);
  return [containerRef, isVisible];
};

// Datos de ejemplo ampliados para las ligas disponibles
const ligasDisponibles = [
  {
    id: 'liga-verano-2024-int',
    nombre: 'Liga Verano 2024 - Nivel Intermedio',
    descripcion: 'Compite durante los meses de verano en un ambiente relajado y mejora tu juego.',
    fechaInicio: '01/07/2024',
    fechaFin: '31/08/2024',
    formato: 'Dobles Mixto',
    plazasRestantes: 5,
    tags: ['🔥 Novedad', '✔️ Mixto'],
  },
  {
    id: 'liga-invierno-2024-av',
    nombre: 'Liga Invierno 2024 - Nivel Avanzado',
    descripcion: 'Para jugadores experimentados que buscan un mayor desafío competitivo.',
    fechaInicio: '01/11/2024',
    fechaFin: '20/12/2024',
    formato: 'Dobles Masculino',
    plazasRestantes: 2,
    tags: ['⏳ Últimos días'],
  },
  {
    id: 'liga-primavera-2024-ini',
    nombre: 'Liga Primavera 2024 - Iniciación',
    descripcion: 'Perfecta para empezar a competir, conocer gente y disfrutar del pádel.',
    fechaInicio: '15/04/2024',
    fechaFin: '15/06/2024',
    formato: 'Dobles Femenino',
    plazasRestantes: 10,
    tags: [],
  },
];

const LigaInscripcion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ligaSeleccionada: '',
    nombreEquipo: '',
    nombreCapitan: '',
    emailCapitan: '',
    nombreJugador2: '',
    emailJugador2: '',
    disponibilidad: {
      lvMananas: false,
      lvTardes: false,
      lvNoches: false,
      fdsMananas: false,
      fdsTardes: false,
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Refs para animación
  const [heroRef, isHeroVisible] = useElementOnScreen({ threshold: 0.1 });
  const [ligasAbiertasRef, isLigasAbiertasVisible] = useElementOnScreen({ threshold: 0.1 });
  const [comoFuncionaRef, isComoFuncionaVisible] = useElementOnScreen({ threshold: 0.1 });
  const [beneficiosRef, isBeneficiosVisible] = useElementOnScreen({ threshold: 0.1 });
  const [formRef, isFormVisible] = useElementOnScreen({ threshold: 0.1 });
  const [faqRef, isFaqVisible] = useElementOnScreen({ threshold: 0.1 });
  const [ctaFinalRef, isCtaFinalVisible] = useElementOnScreen({ threshold: 0.1 });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        disponibilidad: {
          ...prev.disponibilidad,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLigaSelectFromCard = (ligaId) => {
    setFormData(prev => ({ ...prev, ligaSeleccionada: ligaId }));
    // Opcional: Scroll suave al formulario
    const formElement = document.getElementById('inscripcion-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.ligaSeleccionada || !formData.nombreEquipo || !formData.nombreCapitan || !formData.emailCapitan || !formData.nombreJugador2 || !formData.emailJugador2) {
      setError('Por favor, completa todos los campos obligatorios del equipo.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.emailCapitan) || !/\S+@\S+\.\S+/.test(formData.emailJugador2)) {
        setError('Por favor, introduce direcciones de email válidas.');
        return;
    }
    const disponibilidadSeleccionada = Object.values(formData.disponibilidad).some(value => value);
    if (!disponibilidadSeleccionada) {
        setError('Por favor, selecciona al menos una franja de disponibilidad.');
        return;
    }

    console.log('Inscripción enviada:', formData);
    setSuccess(`¡Inscripción exitosa para ${formData.nombreEquipo} en la liga seleccionada! Pronto recibirás más detalles.`);
    
    setFormData({
      ligaSeleccionada: '',
      nombreEquipo: '',
      nombreCapitan: '',
      emailCapitan: '',
      nombreJugador2: '',
      emailJugador2: '',
      disponibilidad: {
        lvMananas: false,
        lvTardes: false,
        lvNoches: false,
        fdsMananas: false,
        fdsTardes: false,
      }
    });
  };

  return (
    <div className={styles.profileContainer}> {/* Mantener clase base si aplica */} 
      <div className={styles.container}>
        
        {/* 1. Hero Section */}
        <section 
          ref={heroRef} 
          className={`${styles.inscripcionHero} ${styles.sectionAnimate} ${isHeroVisible ? styles.visible : ''}`}
        >
            <h1 className={styles.pageTitle}>Forma parte de la liga de pádel más flexible y automatizada</h1>
            <p className={styles.pageDescription}>
                Elige tu liga, crea tu equipo y empieza a competir según tu disponibilidad. 
                Sin horarios fijos, sin papeleos, sin complicaciones.
            </p>
            <a href="#inscripcion-form" className={`button ${styles.heroCTAButtonInscripcion}`}> {/* Botón primario */} 
                🔵 Inscribirme ahora
            </a>
        </section>

        {/* 2. Ligas Abiertas (Cards) */}
        <section 
          ref={ligasAbiertasRef} 
          className={`${styles.ligasAbiertasSection} ${styles.sectionAnimate} ${isLigasAbiertasVisible ? styles.visible : ''}`}
        >
             <h2 className={styles.subPageTitle}>Ligas Abiertas para Inscripción</h2>
             {ligasDisponibles.length > 0 ? (
                <div className={styles.ligasDisponiblesGrid}>
                    {ligasDisponibles.map(liga => (
                        <div key={liga.id} className={styles.ligaCardInscripcion}>
                            <div className={styles.ligaCardTags}>
                                {liga.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                            </div>
                            <h3>{liga.nombre}</h3>
                            <p>{liga.descripcion}</p>
                            <div className={styles.ligaCardInfo}>
                                <span>📅 {liga.fechaInicio} - {liga.fechaFin}</span>
                                <span>🎾 {liga.formato}</span>
                                {liga.plazasRestantes !== undefined && <span>⚡ {liga.plazasRestantes} plazas</span>}
                            </div>
                            <button 
                                onClick={() => handleLigaSelectFromCard(liga.id)}
                                className={`button-outline ${styles.ligaCardCTA}`} 
                            >
                                Inscribirse en esta liga
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.infoMessage}>No hay ligas con inscripción abierta en este momento. ¡Vuelve pronto!</p>
            )}
        </section>

        {/* 3. Cómo funciona la inscripción? */}
        <section 
          ref={comoFuncionaRef} 
          className={`${styles.comoFuncionaInscripcion} ${styles.sectionAnimate} ${isComoFuncionaVisible ? styles.visible : ''}`}
        >
            <h2 className={styles.subPageTitle}>¿Cómo funciona la inscripción?</h2>
            <div className={styles.inscripcionPasosGrid}>
                <div className={styles.pasoItem}>
                    <span className={`material-symbols-outlined ${styles.pasoIcon}`}>playlist_add_check</span>
                    <h4>1. Elige y Crea</h4>
                    <p>Selecciona la liga que te interesa y rellena los datos de tu equipo.</p>
                </div>
                 <div className={styles.pasoItem}>
                    <span className={`material-symbols-outlined ${styles.pasoIcon}`}>event_available</span>
                    <h4>2. Marca Horarios</h4>
                    <p>Indica las franjas horarias en las que tu equipo puede jugar.</p>
                </div>
                 <div className={styles.pasoItem}>
                    <span className={`material-symbols-outlined ${styles.pasoIcon}`}>schedule_send</span>
                    <h4>3. Recibe Partidos</h4>
                    <p>La plataforma te asignará rivales y partidos automáticamente.</p>
                </div>
            </div>
            <div className={styles.enlacesReglamentoFaq}>
                <Link to="/reglamento" className={styles.enlaceSecundario}>Ver Reglamento</Link>
                <Link to="/faq" className={styles.enlaceSecundario}>Preguntas Frecuentes</Link>
            </div>
        </section>

        {/* 4. ¿Qué incluye la inscripción? */}
        <section 
          ref={beneficiosRef} 
          className={`${styles.beneficiosInscripcion} ${styles.sectionAnimate} ${isBeneficiosVisible ? styles.visible : ''}`}
        >
            <h2 className={styles.subPageTitle}>¿Qué obtienes al inscribirte?</h2>
            <ul className={styles.beneficiosList}>
                <li><span className="material-symbols-outlined">check_circle</span> Acceso gratuito a toda la temporada</li>
                <li><span className="material-symbols-outlined">check_circle</span> Clasificación actualizada en tiempo real</li>
                <li><span className="material-symbols-outlined">check_circle</span> Estadísticas detalladas por jugador y equipo</li>
                <li><span className="material-symbols-outlined">check_circle</span> Comunicación directa con rivales (próximamente)</li>
                <li><span className="material-symbols-outlined">check_circle</span> Flexibilidad horaria para tus partidos</li>
                <li><span className="material-symbols-outlined">check_circle</span> ¡Mucha diversión y pádel!</li>
            </ul>
        </section>
        
        {/* 5. Formulario de Inscripción */}
        <section 
          id="inscripcion-form" 
          ref={formRef} 
          className={`${styles.formularioSection} ${styles.sectionAnimate} ${isFormVisible ? styles.visible : ''}`}
        > 
          <h2 className={styles.subPageTitle}>Formulario de Inscripción</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label htmlFor="ligaSeleccionada">Liga Seleccionada:</label>
              <select
                id="ligaSeleccionada"
                name="ligaSeleccionada"
                value={formData.ligaSeleccionada}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              >
                <option value="">-- Elige una liga del formulario o haz clic arriba --</option>
                {ligasDisponibles.map(liga => (
                  <option key={liga.id} value={liga.id}>{liga.nombre}</option>
                ))}
              </select>
            </div>

            <h3 className={styles.formSectionTitle}>Datos del Equipo</h3>
            <div className={styles.formGroup}>
              <label htmlFor="nombreEquipo">Nombre del Equipo:</label>
              <input
                type="text"
                id="nombreEquipo"
                name="nombreEquipo"
                value={formData.nombreEquipo}
                onChange={handleInputChange}
                required
                className={styles.formInput}
                placeholder="Ej: Los Gladiadores del Pádel"
              />
            </div>
            
            <h3 className={styles.formSectionTitle}>Integrantes (Formato Dobles)</h3>
            <div className={styles.formRow}> 
              <div className={styles.formGroup}>
                <label htmlFor="nombreCapitan">Nombre del Capitán/Jugador 1:</label>
                <input type="text" id="nombreCapitan" name="nombreCapitan" value={formData.nombreCapitan} onChange={handleInputChange} required className={styles.formInput} placeholder="Nombre completo"/>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emailCapitan">Email del Capitán/Jugador 1:</label>
                <input type="email" id="emailCapitan" name="emailCapitan" value={formData.emailCapitan} onChange={handleInputChange} required className={styles.formInput} placeholder="tuemail@dominio.com"/>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreJugador2">Nombre del Jugador 2:</label>
                <input type="text" id="nombreJugador2" name="nombreJugador2" value={formData.nombreJugador2} onChange={handleInputChange} required className={styles.formInput} placeholder="Nombre completo"/>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emailJugador2">Email del Jugador 2:</label>
                <input type="email" id="emailJugador2" name="emailJugador2" value={formData.emailJugador2} onChange={handleInputChange} required className={styles.formInput} placeholder="email.companero@dominio.com"/>
              </div>
            </div>

             <h3 className={styles.formSectionTitle}>Disponibilidad Semanal</h3>
             <p className={styles.availabilityHint}>Marca todas las franjas en las que tu equipo suele estar disponible para jugar.</p>
            <div className={styles.formGroup}>
              <div className={styles.checkboxGroupContainer}>
                <div className={styles.checkboxColumn}>
                    <strong>Lunes a Viernes:</strong>
                    <div className={styles.checkboxItem}>
                        <input type="checkbox" id="lvMananas" name="lvMananas" checked={formData.disponibilidad.lvMananas} onChange={handleInputChange} />
                        <label htmlFor="lvMananas">Mañanas (9h-14h)</label>
                    </div>
                    <div className={styles.checkboxItem}>
                        <input type="checkbox" id="lvTardes" name="lvTardes" checked={formData.disponibilidad.lvTardes} onChange={handleInputChange} />
                        <label htmlFor="lvTardes">Tardes (16h-20h)</label>
                    </div>
                    <div className={styles.checkboxItem}>
                        <input type="checkbox" id="lvNoches" name="lvNoches" checked={formData.disponibilidad.lvNoches} onChange={handleInputChange} />
                        <label htmlFor="lvNoches">Noches (20h-23h)</label>
                    </div>
                </div>
                <div className={styles.checkboxColumn}>
                    <strong>Fines de Semana:</strong>
                     <div className={styles.checkboxItem}>
                        <input type="checkbox" id="fdsMananas" name="fdsMananas" checked={formData.disponibilidad.fdsMananas} onChange={handleInputChange} />
                        <label htmlFor="fdsMananas">Sáb/Dom Mañanas</label>
                    </div>
                    <div className={styles.checkboxItem}>
                        <input type="checkbox" id="fdsTardes" name="fdsTardes" checked={formData.disponibilidad.fdsTardes} onChange={handleInputChange} />
                        <label htmlFor="fdsTardes">Sáb/Dom Tardes</label>
                    </div>
                </div>
              </div>
            </div>

            <p className={styles.privacyNote}>🔒 Tus datos solo se usarán para la gestión de la liga y la comunicación entre jugadores.</p>

            <div className={styles.formActions}>
              <button type="submit" className={`button ${styles.submitButtonInscripcion}`}>Confirmar Inscripción</button> 
            </div>
          </form>
        </section>

        {/* 6. FAQ */}
        <section 
          ref={faqRef} 
          className={`${styles.faqSectionInscripcion} ${styles.sectionAnimate} ${isFaqVisible ? styles.visible : ''}`}
        >
            <h2 className={styles.subPageTitle}>Preguntas Rápidas sobre Inscripción</h2>
            <div className={styles.faqListInscripcion}> 
                <div className={styles.faqItemInscripcion}>
                    <h4>¿Cuánto cuesta inscribirse?</h4>
                    <p>¡Es totalmente GRATIS! No hay cuotas de inscripción ni comisiones.</p>
                </div>
                <div className={styles.faqItemInscripcion}>
                    <h4>¿Cómo se asignan los partidos si marco varias disponibilidades?</h4>
                    <p>El sistema busca coincidencias con la disponibilidad de tus rivales y propone una fecha/hora. Siempre puedes comunicarte para ajustar.</p>
                </div>
                 <div className={styles.faqItemInscripcion}>
                    <h4>¿Puedo cambiar mi disponibilidad después de inscribirme?</h4>
                    <p>Sí, podrás ajustar tu disponibilidad semanal desde tu panel de control una vez iniciada la liga (función próximamente disponible).</p>
                </div>
                 <div className={styles.faqItemInscripcion}>
                    <h4>¿Necesito reservar pista?</h4>
                    <p>Sí, la reserva de la pista y el pago (si aplica) corre a cargo de los jugadores que disputan el encuentro.</p>
                </div>
            </div>
        </section>

        {/* 7. CTA Final */}
        <section 
          ref={ctaFinalRef} 
          className={`${styles.ctaFinalInscripcion} ${styles.sectionAnimate} ${isCtaFinalVisible ? styles.visible : ''}`}
        >
            <h2>¿Listo para competir con libertad?</h2>
            <a href="#inscripcion-form" className={`button ${styles.heroCTAButtonInscripcion}`}> 
                🔵 Inscribirme ahora
            </a>
            <p>¿Tienes dudas? <Link to="/contacto" className={styles.enlaceContactoFinal}>Contáctanos <span className="material-symbols-outlined">contact_support</span></Link></p>
        </section>

      </div>
    </div>
  );
};

export default LigaInscripcion; 