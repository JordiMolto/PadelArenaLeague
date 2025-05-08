import React, { useState, useEffect, useRef } from 'react';
import styles from './FAQ.module.css';

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

const FAQ = () => {
  // Estado para controlar qué pregunta está abierta
  const [activeIndex, setActiveIndex] = useState(null);

  // Ref para animación del contenedor principal de FAQs
  const [faqContainerRef, isFaqContainerVisible] = useElementOnScreen({ threshold: 0.05 });

  // Datos de ejemplo (en un caso real, vendrían de una API/BD)
  const faqs = [
    {
      categoria: "Inscripciones",
      preguntas: [
        {
          id: 1,
          pregunta: "¿Cómo me inscribo en una liga?",
          respuesta: "Para inscribirte en una liga, debes crear una cuenta en nuestra plataforma y seguir estos pasos: 1) Accede a la sección 'Ligas', 2) Selecciona la liga de tu nivel, 3) Completa el formulario de inscripción y realiza el pago correspondiente."
        },
        {
          id: 2,
          pregunta: "¿Puedo cambiar de liga una vez inscrito?",
          respuesta: "Sí, es posible cambiar de liga antes del inicio de la temporada. Contacta con el administrador a través del chat y solicita el cambio. Una vez iniciada la temporada, no se permiten cambios hasta la siguiente."
        }
      ]
    },
    {
      categoria: "Partidos",
      preguntas: [
        {
          id: 3,
          pregunta: "¿Cómo se organizan los partidos?",
          respuesta: "Los partidos se organizan semanalmente según la disponibilidad indicada por los jugadores. El sistema genera automáticamente los emparejamientos y sugiere horarios compatibles para todos los participantes."
        },
        {
          id: 4,
          pregunta: "¿Qué sucede si no puedo asistir a un partido?",
          respuesta: "Debes notificar tu ausencia con al menos 24 horas de antelación a través de la plataforma. El partido se reprogramará si es posible, o se aplicará el reglamento vigente sobre partidos no jugados."
        }
      ]
    },
    {
      categoria: "Puntuación",
      preguntas: [
        {
          id: 5,
          pregunta: "¿Cómo funciona el sistema de puntuación?",
          respuesta: "Cada victoria suma 3 puntos, el empate 1 punto y la derrota 0 puntos. Además, se tienen en cuenta sets a favor y en contra para posibles desempates en la clasificación."
        },
        {
          id: 6,
          pregunta: "¿Cómo se registran los resultados?",
          respuesta: "Al finalizar el partido, cualquiera de los jugadores puede registrar el resultado en la plataforma. El equipo contrario debe confirmar el resultado para que sea oficial."
        }
      ]
    },
    {
      categoria: "Técnico",
      preguntas: [
        {
          id: 7,
          pregunta: "¿Qué hago si tengo problemas técnicos con la app?",
          respuesta: "Si experimentas problemas técnicos, primero intenta cerrar sesión y volver a entrar. Si el problema persiste, contacta con soporte técnico a través del formulario de contacto o envía un email a soporte@padelarenaleague.com"
        },
        {
          id: 8,
          pregunta: "¿Cómo actualizo mi disponibilidad horaria?",
          respuesta: "Puedes actualizar tu disponibilidad en cualquier momento desde tu perfil. Los cambios se aplicarán para la organización de partidos de la siguiente semana."
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Preguntas Frecuentes</h1>
          
          <div 
            ref={faqContainerRef}
            className={`${styles.faqContainer} ${styles.sectionAnimate} ${isFaqContainerVisible ? styles.visible : ''}`}
          >
            {faqs.map((categoria, categoriaIndex) => (
              <div key={categoriaIndex} className={styles.categoriaContainer}>
                <h2 className={styles.categoriaTitle}>{categoria.categoria}</h2>
                <div className={styles.preguntasContainer}>
                  {categoria.preguntas.map((faq, index) => {
                    const isActive = activeIndex === `${categoriaIndex}-${index}`;
                    return (
                      <div 
                        key={faq.id} 
                        className={`${styles.faqItem} ${isActive ? styles.active : ''}`}
                      >
                        <button
                          className={styles.faqButton}
                          onClick={() => toggleQuestion(`${categoriaIndex}-${index}`)}
                        >
                          <span className={styles.pregunta}>{faq.pregunta}</span>
                          <span className={styles.arrow}>
                            {isActive ? '−' : '+'}
                          </span>
                        </button>
                        <div 
                          className={styles.respuestaContainer}
                          style={{
                            maxHeight: isActive ? '500px' : '0',
                          }}
                        >
                          <div className={styles.respuesta}>
                            {faq.respuesta}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 