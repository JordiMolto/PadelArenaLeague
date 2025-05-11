import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './Ligas.module.css';

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

const LigaDetail = () => {
  const { ligaId } = useParams();

  // Refs para animar secciones
  const [clasificacionRef, isClasificacionVisible] = useElementOnScreen({ threshold: 0.1 });
  const [partidosRef, isPartidosVisible] = useElementOnScreen({ threshold: 0.1 });
  const [equiposRef, isEquiposVisible] = useElementOnScreen({ threshold: 0.1 });

  // Aquí iría la lógica para cargar los datos de la liga específica usando ligaId
  // Datos de ejemplo:
  const ligaInfo = {
    nombre: `Detalles Liga ${ligaId}`,
    descripcion: `Información detallada sobre la ${ligaId}, incluyendo clasificación, partidos, equipos, etc.`,
    // ... más datos
  };

  if (!ligaInfo) {
    return <div>Liga no encontrada</div>; // O un componente NotFound
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h2 className={styles.pageTitle}>{ligaInfo.nombre}</h2>
          <p className={styles.pageDescription}>{ligaInfo.descripcion}</p>

          {/* Aquí irían las subsecciones: Clasificación, Partidos, Equipos */}
          <div className={styles.subSections}>
             {/* Ejemplo de cómo podrían mostrarse las secciones */}
             <section>
                <h2>Clasificación</h2>
                {/* Contenido de Clasificación */}
                 <p>(Tabla de clasificación...)</p>
             </section>
             <section>
                <h2>Próximos Partidos</h2>
                 {/* Contenido de Partidos */}
                 <p>(Lista de partidos...)</p>
             </section>
              <section>
                <h2>Equipos Participantes</h2>
                 {/* Contenido de Equipos */}
                 <p>(Lista de equipos...)</p>
             </section>
          </div>

          <Link to="/ligas" className={styles.backButton}>Volver a Ligas</Link>
        </div>
      </div>
    </div>
  );
};

export default LigaDetail; 