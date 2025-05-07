import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './Ligas.module.css';

const LigaDetail = () => {
  const { ligaId } = useParams();

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
          <h1 className={styles.pageTitle}>{ligaInfo.nombre}</h1>
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