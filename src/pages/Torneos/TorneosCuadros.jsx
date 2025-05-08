import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './Torneos.module.css'; // Crearemos este archivo CSS

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

// --- Mock Data ---
const mockTorneos = [
  { id: 'torneo-verano-2024', nombre: 'Torneo de Verano 2024 (Eliminatoria)', tipo: 'Eliminatoria Directa', categoria: 'Absoluta Masculina', totalRondas: 4, fechaInicio: '2024-08-01' },
  { id: 'torneo-invierno-femenino', nombre: 'Torneo Invierno Femenino (Liguilla + KO)', tipo: 'Liguilla + Eliminatoria', categoria: 'Absoluta Femenina', totalRondas: 3, fechaInicio: '2024-11-15' },
  { id: 'torneo-express-mixto', nombre: 'Torneo Express Mixto Fin de Semana', tipo: 'Express', categoria: 'Mixta', totalRondas: 3, fechaInicio: '2024-09-07' },
];

const mockPartidosPorTorneo = {
  'torneo-verano-2024': {
    1: [ // Octavos de Final (asumiendo 16 equipos para 4 rondas)
      { idPartido: 'tv24-r1-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Beta', resultado: '6-2, 6-3', ganadorId: 'Pareja Alfa', siguientePartidoId: 'tv24-r2-p1', status: 'Jugado' },
      { idPartido: 'tv24-r1-p2', equipoLocal: 'Pareja Gamma', equipoVisitante: 'Pareja Delta', resultado: 'Walkover (Gamma)', ganadorId: 'Pareja Gamma', siguientePartidoId: 'tv24-r2-p1', status: 'Jugado' },
      { idPartido: 'tv24-r1-p3', equipoLocal: 'Los Invencibles', equipoVisitante: 'Maestros del Padel', resultado: '7-6, 6-7, 6-4', ganadorId: 'Los Invencibles', siguientePartidoId: 'tv24-r2-p2', status: 'Jugado' },
      { idPartido: 'tv24-r1-p4', equipoLocal: 'Equipo Sorpresa', equipoVisitante: 'Los Favoritos', resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r2-p2', status: 'Pendiente' },
      // ... 4 partidos más para completar 8 de octavos
    ],
    2: [ // Cuartos de Final
      { idPartido: 'tv24-r2-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Gamma', resultado: '6-1, 6-0', ganadorId: 'Pareja Alfa', siguientePartidoId: 'tv24-r3-p1', status: 'Jugado' },
      { idPartido: 'tv24-r2-p2', equipoLocal: null, equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r3-p1', status: 'Por definir' }, // Esperando ganador de R1P3 vs R1P4
      // ... 2 partidos más para completar 4 de cuartos
    ],
    3: [ // Semifinales
      { idPartido: 'tv24-r3-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r4-p1', status: 'Por definir' },
      // ... 1 partido más
    ],
    4: [ // Final
      { idPartido: 'tv24-r4-p1', equipoLocal: null, equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: null, status: 'Por definir' },
    ]
  },
  // Lógica para liguilla + KO sería más compleja y se añadiría después
};

// --- Fin Mock Data ---

const TorneosCuadros = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState('');
  const [cuadro, setCuadro] = useState(null); // { 1: [...partidosRonda1], 2: [...partidosRonda2], ... }

  // Ref para animar el cuadro
  const [cuadroRef, isCuadroVisible] = useElementOnScreen({ threshold: 0.05 });

  useEffect(() => {
    setTorneos([{ id: '', nombre: 'Selecciona un torneo...' }, ...mockTorneos]);
  }, []);

  useEffect(() => {
    if (torneoSeleccionadoId && mockPartidosPorTorneo[torneoSeleccionadoId]) {
      setCuadro(mockPartidosPorTorneo[torneoSeleccionadoId]);
    } else {
      setCuadro(null);
    }
  }, [torneoSeleccionadoId]);

  const torneoSeleccionado = useMemo(() => {
    return mockTorneos.find(t => t.id === torneoSeleccionadoId);
  }, [torneoSeleccionadoId]);

  const renderNombreEquipo = (nombre) => {
    return nombre || <span className={styles.equipoPorDefinir}>Por definir</span>;
  };

  const getStatusClass = (status) => {
    if (status === 'Jugado') return styles.statusJugado;
    if (status === 'Pendiente') return styles.statusPendiente;
    // Podríamos añadir más clases si es necesario
    return styles.statusPorDefinir; 
  };

  return (
    <div className={styles.profileContainer}> {/* Asume estructura similar a Ligas */} 
      <div className={styles.container}>
        <div className={styles.profileCard}> {/* Se modificará en Torneos.module.css */} 
          <h1 className={styles.pageTitle}>Cuadros y Partidos de Torneos</h1>
          <p className={styles.pageDescription}>
            Selecciona un torneo para ver su cuadro de enfrentamientos y el estado de los partidos.
          </p>

          <div className={styles.filtrosContainerCuadros}> {/* Clase para el contenedor de filtros */} 
            <div className={styles.filtroItemCuadro}> {/* Clase para cada item de filtro */} 
              <label htmlFor="torneoSelectCuadros">Torneo:</label>
              <select id="torneoSelectCuadros" value={torneoSeleccionadoId} onChange={(e) => setTorneoSeleccionadoId(e.target.value)}>
                {torneos.map(torneo => (
                  <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {torneoSeleccionado && cuadro ? (
            <div 
              ref={cuadroRef} 
              className={`${styles.cuadroTorneoContainer} ${styles.sectionAnimate} ${isCuadroVisible ? styles.visible : ''}`}
            >
              <h2 className={styles.subPageTitle}>{torneoSeleccionado.nombre} - {torneoSeleccionado.tipo}</h2>
              <div className={styles.rondasContainer}>
                {Object.entries(cuadro).map(([numeroRonda, partidosRonda]) => (
                  <div key={`ronda-${numeroRonda}`} className={styles.rondaColumna}>
                    <h3 className={styles.rondaTitulo}>Ronda {numeroRonda}</h3>
                    <div className={styles.partidosEnRondaContainer}>
                      {partidosRonda.map(partido => (
                        <div key={partido.idPartido} className={`${styles.partidoCardTorneo} ${getStatusClass(partido.status)}`}>
                          <div className={styles.equipoInfoTorneo}>
                            <span className={partido.ganadorId === partido.equipoLocal ? styles.ganador : ''}>
                              {renderNombreEquipo(partido.equipoLocal)}
                            </span>
                            <span className={styles.vs}>vs</span>
                            <span className={partido.ganadorId === partido.equipoVisitante ? styles.ganador : ''}>
                              {renderNombreEquipo(partido.equipoVisitante)}
                            </span>
                          </div>
                          {partido.status === 'Jugado' && (
                            <div className={styles.resultadoTorneo}>{partido.resultado}</div>
                          )}
                          {partido.status !== 'Jugado' && (
                            <div className={styles.statusPartidoTorneo}>{partido.status}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : torneoSeleccionadoId ? (
            <p className={styles.infoMessage}>No hay datos del cuadro disponibles para este torneo.</p>
          ) : (
            <p className={styles.infoMessage}>Selecciona un torneo para visualizar el cuadro.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TorneosCuadros; 