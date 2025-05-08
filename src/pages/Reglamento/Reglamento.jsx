import React, { useRef, useState, useEffect } from 'react';
import styles from './Reglamento.module.css';

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

const Reglamento = () => {
  const [contentRef, isContentVisible] = useElementOnScreen({ threshold: 0.05 }); // Threshold bajo para que se active pronto

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Reglamento Oficial de Padel Arena League</h1>

          <div
            ref={contentRef}
            className={`${styles.reglamentoContent} ${styles.sectionAnimate} ${isContentVisible ? styles.visible : ''}`}
          >
            <section id="introduccion">
              <h2>1. Introducción</h2>
              <p>Este documento establece las reglas y normativas oficiales para todos los partidos y torneos organizados bajo el nombre de Padel Arena League. El objetivo es asegurar un juego justo, deportivo y divertido para todos los participantes.</p>
              <p>Todos los jugadores, equipos y personal asociado deben adherirse a este reglamento.</p>
            </section>

            <section id="puntuacion">
              <h2>2. Sistema de Puntuación</h2>
              <p>Los partidos se jugarán al mejor de 3 sets. Cada set se juega a 6 juegos, con diferencia de 2.</p>
              <p>En caso de empate a 6 juegos, se jugará un tie-break a 7 puntos, con diferencia de 2.</p>
              <p>La puntuación dentro de cada juego sigue el sistema tradicional: 15, 30, 40, Juego. En caso de 40-40 (Deuce), se jugará con ventaja (AD) o punto de oro, según se especifique para el torneo.</p>
            </section>

            <section id="conducta">
              <h2>3. Código de Conducta</h2>
              <p>Se espera que todos los participantes mantengan un comportamiento deportivo ejemplar dentro y fuera de la pista.</p>
              <p>Cualquier acto de indisciplina, falta de respeto hacia oponentes, árbitros o público, o daño intencionado a las instalaciones podrá ser sancionado.</p>
              <p>Las sanciones pueden variar desde advertencias verbales hasta la descalificación del torneo o la expulsión de la liga.</p>
            </section>

            <section id="equipamiento">
              <h2>4. Equipamiento</h2>
              <p>Los jugadores deben utilizar palas de pádel reglamentarias.</p>
              <p>Se requiere el uso de calzado deportivo adecuado para pistas de pádel.</p>
              <p>La vestimenta debe ser deportiva y apropiada para la práctica del pádel.</p>
            </section>

            <section id="otros">
              <h2>5. Disposiciones Adicionales</h2>
              <p>Las decisiones del árbitro o del juez de silla son finales durante el partido.</p>
              <p>Cualquier situación no contemplada en este reglamento será resuelta por el Comité Organizador de Padel Arena League.</p>
              <p>Este reglamento puede ser actualizado periódicamente. La versión más reciente estará siempre disponible en la web oficial.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reglamento; 