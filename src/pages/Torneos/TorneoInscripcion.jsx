import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Torneos.module.css'; // Reutilizaremos y expandiremos Torneos.module.css

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

// --- Mock Data para el Torneo de Ejemplo y FAQs ---
const torneoEjemplo = {
  id: 'torneo-verano-exp-2025',
  nombre: 'Torneo Verano Exprés 2025',
  subtitulo: 'Compite en un torneo exprés, demuestra tu nivel y alcanza la final.',
  fechaTorneo: 'Sábado 10 de Agosto, 2025 (Todo el día)',
  plazasLimitadas: '16 equipos/parejas',
  costo: 'Gratuito',
  formato: 'Dobles', // Podría ser un array si hay varias opciones ['Dobles', 'Individual']
  categoria: 'Mixto', // Podría ser un array ['Masculino', 'Femenino', 'Mixto']
  numeroRondas: 4, // Estimado para eliminatoria directa con 16
  cierreInscripcion: '5 de Agosto, 2025',
  inicioEnfrentamientos: '10 de Agosto, 2025 - 09:00h',
  fechaFinal: '10 de Agosto, 2025 - 19:00h (aprox)',
  premios: 'Trofeos para campeones y subcampeones. Material deportivo.',
  reglasPrincipales: 'Sistema de eliminatoria directa. Partidos al mejor de 3 sets (super tie-break en el tercero).',
  detallesAdicionales: 'Se juega en una única jornada intensiva. Ideal para medir tu nivel rápidamente.',
};

const faqsTorneo = [
  {
    id: 'faqT1',
    pregunta: '¿Puedo modificar mi inscripción una vez realizada?',
    respuesta: 'Sí, puedes contactar a la organización para modificar los datos de tu equipo hasta la fecha de cierre de inscripciones. Después de esa fecha, los cambios estarán sujetos a disponibilidad y criterio del organizador.'
  },
  {
    id: 'faqT2',
    pregunta: '¿Qué sucede si no puedo jugar un partido programado?',
    respuesta: 'En torneos exprés, la asistencia es crucial. Si no puedes jugar, informa a la organización lo antes posible. Dependiendo del reglamento específico del torneo y el tiempo de aviso, se podría considerar W.O. (Walkover).'
  },
  {
    id: 'faqT3',
    pregunta: '¿Cómo se asignan los enfrentamientos iniciales?',
    respuesta: 'Los enfrentamientos iniciales se asignan mediante sorteo puro una vez cerradas las inscripciones. El cuadro se publicará antes del inicio del torneo.'
  },
  {
    id: 'faqT4',
    pregunta: '¿Cómo se reportan los resultados de los partidos?',
    respuesta: 'Los resultados deben ser reportados a la mesa de control designada por la organización inmediatamente después de finalizar cada partido. Uno de los equipos/jugadores será el responsable de comunicarlo.'
  }
];

const TorneoInscripcion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoria: torneoEjemplo.categoria, // Preseleccionar si solo hay una
    formato: torneoEjemplo.formato,   // Preseleccionar si solo hay una
    nombreEquipoJugador: '',
    nombreCapitan: '',
    emailCapitan: '',
    nombreJugador2: '', // Opcional si es individual
    emailJugador2: '',   // Opcional si es individual
    disponibilidadPreferente: '', // Podría ser un selector o texto
    puedeEntreSemana: false,
    puedeFinSemana: true, // Preseleccionar si el torneo es en finde
    observaciones: '',
    aceptaReglamento: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Refs para animación de secciones
  const [heroRef, isHeroVisible] = useElementOnScreen({ threshold: 0.1 });
  const [resumenRef, isResumenVisible] = useElementOnScreen({ threshold: 0.1 });
  const [comoFuncionaRef, isComoFuncionaVisible] = useElementOnScreen({ threshold: 0.1 });
  const [formRef, isFormVisible] = useElementOnScreen({ threshold: 0.1 });
  const [faqRef, isFaqVisible] = useElementOnScreen({ threshold: 0.1 });
  const [ctaFinalRef, isCtaFinalVisible] = useElementOnScreen({ threshold: 0.1 });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.aceptaReglamento) {
      setError('Debes aceptar el reglamento para inscribirte.');
      return;
    }
    if (!formData.nombreEquipoJugador || !formData.nombreCapitan || !formData.emailCapitan) {
      setError('Por favor, completa los campos obligatorios del equipo/jugador y capitán.');
      return;
    }
    // Validaciones adicionales (ej. formato email, si es dobles que estén los datos del jugador 2)

    console.log('Inscripción a Torneo enviada:', formData);
    setSuccess(`¡Inscripción exitosa para ${formData.nombreEquipoJugador} en ${torneoEjemplo.nombre}! Pronto recibirás más detalles.`);
    // Aquí se podría resetear el formulario o redirigir
    // setFormData({ ...initialFormData }); 
  };

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('inscripcion-torneo-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.torneoPageContainer}> {/* Nueva clase base para la página */} 
      <div className={styles.container}>

        {/* 1. Hero Section + CTA Directo */}
        <section 
          ref={heroRef}
          className={`${styles.heroTorneoInscripcion} ${styles.sectionAnimate} ${isHeroVisible ? styles.visible : ''}`}
        >
          <h1 className={styles.heroTorneoTitulo}>Inscripción Abierta: {torneoEjemplo.nombre}</h1>
          <p className={styles.heroTorneoSubtitulo}>{torneoEjemplo.subtitulo}</p>
          <div className={styles.heroTorneoInfoBadges}>
            <span>📅 {torneoEjemplo.fechaTorneo}</span>
            <span>🎟️ {torneoEjemplo.plazasLimitadas}</span>
            <span>💰 {torneoEjemplo.costo}</span>
          </div>
          <button onClick={scrollToForm} className={`button ${styles.heroTorneoCTA}`}> 
            🔵 Inscribirme ahora &rarr;
          </button>
        </section>

        {/* 2. Resumen del Torneo */}
        <section 
          ref={resumenRef}
          className={`${styles.resumenTorneoSection} ${styles.sectionAnimate} ${isResumenVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.sectionTitleTorneo}>Resumen del Torneo</h2>
          <div className={styles.resumenTorneoGrid}>
            <div className={styles.resumenItem}><strong>Nombre:</strong> {torneoEjemplo.nombre}</div>
            <div className={styles.resumenItem}><strong>Formato:</strong> {torneoEjemplo.formato}</div>
            <div className={styles.resumenItem}><strong>Categoría:</strong> {torneoEjemplo.categoria}</div>
            <div className={styles.resumenItem}><strong>Rondas Estimadas:</strong> {torneoEjemplo.numeroRondas} (Eliminatoria Directa)</div>
            <div className={styles.resumenItem}><strong>Cierre Inscripción:</strong> {torneoEjemplo.cierreInscripcion}</div>
            <div className={styles.resumenItem}><strong>Inicio:</strong> {torneoEjemplo.inicioEnfrentamientos}</div>
            <div className={styles.resumenItem}><strong>Final Estimada:</strong> {torneoEjemplo.fechaFinal}</div>
            <div className={styles.resumenItem}><strong>Plazas:</strong> {torneoEjemplo.plazasLimitadas}</div>
            <div className={styles.resumenItem}><strong>Premios:</strong> {torneoEjemplo.premios}</div>
            <div className={styles.resumenItemFull}><strong>Reglas Principales:</strong> {torneoEjemplo.reglasPrincipales}</div>
            {torneoEjemplo.detallesAdicionales && 
              <div className={styles.resumenItemFull}><strong>Detalles:</strong> {torneoEjemplo.detallesAdicionales}</div>
            }
            <div className={styles.resumenItemFull}>
                <Link to="/reglamento" className={styles.linkReglamento}>Ver Reglamento Completo</Link>
            </div>
          </div>
        </section>

        {/* 3. Cómo funciona */}
        <section 
          ref={comoFuncionaRef}
          className={`${styles.comoFuncionaTorneo} ${styles.sectionAnimate} ${isComoFuncionaVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.sectionTitleTorneo}>¿Cómo Funciona la Inscripción y el Torneo?</h2>
          <div className={styles.pasosTorneoGrid}>
            <div className={styles.pasoTorneoItem}>
              <span className={`material-symbols-outlined ${styles.pasoTorneoIcon}`}>how_to_reg</span>
              <h4>1. Inscribe tu Equipo/Jugador</h4>
              <p>Completa el formulario con los datos requeridos y acepta las condiciones.</p>
            </div>
            <div className={styles.pasoTorneoItem}>
              <span className={`material-symbols-outlined ${styles.pasoTorneoIcon}`}>assignment</span>
              <h4>2. Publicación del Cuadro</h4>
              <p>Una vez cerradas las inscripciones, se sorteará y publicará el cuadro oficial.</p>
            </div>
            <div className={styles.pasoTorneoItem}>
              <span className={`material-symbols-outlined ${styles.pasoTorneoIcon}`}>sports_tennis</span>
              <h4>3. Juega tus Partidos</h4>
              <p>Asiste en las fechas y horarios indicados para tus enfrentamientos.</p>
            </div>
            <div className={styles.pasoTorneoItem}>
              <span className={`material-symbols-outlined ${styles.pasoTorneoIcon}`}>emoji_events</span>
              <h4>4. Resultados y Ganadores</h4>
              <p>Sigue el avance del torneo y los resultados en tiempo real en la plataforma.</p>
            </div>
          </div>
          <div className={styles.ctaComoFuncionaTorneo}>
            <Link to={`/torneos/cuadros?torneo=${torneoEjemplo.id}`} className={`button-outline ${styles.linkCuadroTorneo}`}> 
              ¿Consultar cuadro de un torneo anterior?
            </Link>
          </div>
        </section>

        {/* 4. Formulario de inscripción */}
        <section 
          id="inscripcion-torneo-form" 
          ref={formRef}
          className={`${styles.formularioTorneoSection} ${styles.sectionAnimate} ${isFormVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.sectionTitleTorneo}>Formulario de Inscripción</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
          
          <form onSubmit={handleSubmit} className={styles.formTorneo}>
            {/* Selección de Categoría y Formato (si el torneo tuviera varias opciones) */}
            {/* Por ahora, tomamos los del torneoEjemplo directamente */}
            <p className={styles.infoPreseleccion}>Inscripción para: <strong>{torneoEjemplo.categoria} - {torneoEjemplo.formato}</strong></p>

            <div className={styles.formGroupTorneo}>
              <label htmlFor="nombreEquipoJugador">Nombre del Equipo / Jugador (Individual):</label>
              <input type="text" id="nombreEquipoJugador" name="nombreEquipoJugador" value={formData.nombreEquipoJugador} onChange={handleInputChange} required placeholder="Ej: Los Imparables / Juan Pérez" />
            </div>

            <div className={styles.formRowTorneo}>
              <div className={styles.formGroupTorneo}>
                <label htmlFor="nombreCapitan">Nombre del Capitán / Jugador Principal:</label>
                <input type="text" id="nombreCapitan" name="nombreCapitan" value={formData.nombreCapitan} onChange={handleInputChange} required placeholder="Nombre completo" />
              </div>
              <div className={styles.formGroupTorneo}>
                <label htmlFor="emailCapitan">Email del Capitán / Jugador Principal:</label>
                <input type="email" id="emailCapitan" name="emailCapitan" value={formData.emailCapitan} onChange={handleInputChange} required placeholder="tuemail@ejemplo.com" />
              </div>
            </div>

            {torneoEjemplo.formato === 'Dobles' && (
              <div className={styles.formRowTorneo}>
                <div className={styles.formGroupTorneo}>
                  <label htmlFor="nombreJugador2">Nombre del Jugador 2:</label>
                  <input type="text" id="nombreJugador2" name="nombreJugador2" value={formData.nombreJugador2} onChange={handleInputChange} required={torneoEjemplo.formato === 'Dobles'} placeholder="Nombre completo del compañero" />
                </div>
                <div className={styles.formGroupTorneo}>
                  <label htmlFor="emailJugador2">Email del Jugador 2:</label>
                  <input type="email" id="emailJugador2" name="emailJugador2" value={formData.emailJugador2} onChange={handleInputChange} required={torneoEjemplo.formato === 'Dobles'} placeholder="email.companero@ejemplo.com" />
                </div>
              </div>
            )}
            
            <div className={styles.formGroupTorneo}>
                <label htmlFor="disponibilidadPreferente">Preferencia Horaria (si aplica para el torneo):</label>
                <input type="text" id="disponibilidadPreferente" name="disponibilidadPreferente" value={formData.disponibilidadPreferente} onChange={handleInputChange} placeholder="Ej: Sábado por la mañana, Domingo tarde" />
            </div>
            
            {/* Checkboxes de disponibilidad general (pueden no ser necesarios para torneo exprés) */}
            {/* <div className={styles.formGroupTorneo}>
              <label>Disponibilidad General:</label>
              <div className={styles.checkboxContainerTorneo}>
                <label><input type="checkbox" name="puedeEntreSemana" checked={formData.puedeEntreSemana} onChange={handleInputChange} /> Entre Semana</label>
                <label><input type="checkbox" name="puedeFinSemana" checked={formData.puedeFinSemana} onChange={handleInputChange} /> Fin de Semana</label>
              </div>
            </div> */}

            <div className={styles.formGroupTorneo}>
              <label htmlFor="observaciones">Observaciones (opcional):</label>
              <textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows="3" placeholder="Alergias, información adicional..."></textarea>
            </div>

            <div className={styles.formGroupTorneoCheckbox}>
              <input type="checkbox" id="aceptaReglamento" name="aceptaReglamento" checked={formData.aceptaReglamento} onChange={handleInputChange} required />
              <label htmlFor="aceptaReglamento">He leído y acepto el <Link to="/reglamento" target="_blank">reglamento del torneo</Link> y la <Link to="/privacidad" target="_blank">política de privacidad</Link>.</label>
            </div>

            <div className={styles.formActionsTorneo}>
              <button type="submit" className={`button ${styles.submitButtonTorneo}`}>🔵 Inscribir Equipo</button>
            </div>
          </form>
        </section>

        {/* 5. FAQ Específicas */}
        <section 
          ref={faqRef}
          className={`${styles.faqTorneoSection} ${styles.sectionAnimate} ${isFaqVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.sectionTitleTorneo}>Preguntas Frecuentes del Torneo</h2>
          <div className={styles.faqListTorneo}>
            {faqsTorneo.map(faq => (
              <div key={faq.id} className={`${styles.faqItemTorneo} ${activeFaq === faq.id ? styles.active : ''}`}>
                <button className={styles.faqQuestionTorneo} onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.pregunta}</span>
                  <span className={styles.faqIconTorneo}>{activeFaq === faq.id ? '−' : '+'}</span>
                </button>
                {activeFaq === faq.id && (
                  <div className={styles.faqAnswerTorneo}>{faq.respuesta}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 6. CTA Final */}
        <section 
          ref={ctaFinalRef}
          className={`${styles.ctaFinalTorneo} ${styles.sectionAnimate} ${isCtaFinalVisible ? styles.visible : ''}`}
        >
          <h2 className={styles.ctaFinalTorneoTitulo}>¡No te quedes fuera! Plazas limitadas.</h2>
          <button onClick={scrollToForm} className={`button ${styles.heroTorneoCTA}`}> 
            🔵 Inscribirme ahora
          </button>
          <p className={styles.dudasContactoTorneo}>
            ¿Dudas sobre el torneo? <Link to="/contacto">Contacta con nosotros <span className="material-symbols-outlined">contact_support</span></Link>
          </p>
        </section>

      </div>
    </div>
  );
};

export default TorneoInscripcion; 