import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './Torneos.module.css'; // Reutilizaremos estilos

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

// Partidos de ejemplo (solo los finalizados)
const mockPartidosPorTorneo = {
  'torneo-verano-2024': {
    1: [ // Octavos
      { idPartido: 'tv24-r1-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Beta', resultado: '6-2, 6-3', ganadorId: 'Pareja Alfa', status: 'Jugado', fecha: '2024-08-02' },
      { idPartido: 'tv24-r1-p2', equipoLocal: 'Pareja Gamma', equipoVisitante: 'Pareja Delta', resultado: 'Walkover (Gamma)', ganadorId: 'Pareja Gamma', status: 'Jugado', fecha: '2024-08-02' },
      { idPartido: 'tv24-r1-p3', equipoLocal: 'Los Invencibles', equipoVisitante: 'Maestros del Padel', resultado: '7-6, 6-7, 6-4', ganadorId: 'Los Invencibles', status: 'Jugado', fecha: '2024-08-03' },
      { idPartido: 'tv24-r1-p5', equipoLocal: 'Equipo X', equipoVisitante: 'Equipo Y', resultado: '6-0, 6-1', ganadorId: 'Equipo X', status: 'Jugado', fecha: '2024-08-03' },
    ],
    2: [ // Cuartos
      { idPartido: 'tv24-r2-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Gamma', resultado: '6-1, 6-0', ganadorId: 'Pareja Alfa', status: 'Jugado', fecha: '2024-08-05' },
      // ...más partidos de cuartos jugados
    ],
    // No incluimos rondas sin partidos jugados o torneos sin resultados
  },
  'torneo-invierno-femenino': {
    1: [ // Fase de grupos (simulada como ronda)
        { idPartido: 'tif24-fg-p1', equipoLocal: 'Damas de Hierro', equipoVisitante: 'Reinas de la Pista', resultado: '6-3, 6-4', ganadorId: 'Damas de Hierro', status: 'Jugado', fecha: '2024-11-16' },
        { idPartido: 'tif24-fg-p2', equipoLocal: 'Amazonas Padel', equipoVisitante: 'Guerreras de la Red', resultado: 'Cancelado', ganadorId: null, status: 'Cancelado', fecha: '2024-11-16' },
    ]
  }
};
// --- Fin Mock Data ---

const TorneosResultados = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState('');
  const [rondaFiltro, setRondaFiltro] = useState('Todas');
  const [busquedaEquipo, setBusquedaEquipo] = useState('');
  const [rondasOptions, setRondasOptions] = useState(['Todas']);

  // Ref para animar el contenedor de resultados
  const [resultadosRef, isResultadosVisible] = useElementOnScreen({ threshold: 0.05 });

  useEffect(() => {
    setTorneos([{ id: '', nombre: 'Selecciona un torneo...' }, ...mockTorneos]);
  }, []);

  useEffect(() => {
    if (torneoSeleccionadoId) {
      const torneoData = mockTorneos.find(t => t.id === torneoSeleccionadoId);
      if (torneoData) {
        const numRondas = torneoData.totalRondas || 0;
        const options = ['Todas'];
        for (let i = 1; i <= numRondas; i++) {
          options.push(`Ronda ${i}`);
        }
        setRondasOptions(options);
        setRondaFiltro('Todas'); // Resetear filtro de ronda
      }
    } else {
      setRondasOptions(['Todas']);
      setRondaFiltro('Todas');
    }
  }, [torneoSeleccionadoId]);

  const resultadosFiltrados = useMemo(() => {
    if (!torneoSeleccionadoId) return [];

    const partidosDelTorneo = mockPartidosPorTorneo[torneoSeleccionadoId];
    if (!partidosDelTorneo) return [];

    let todosLosResultados = [];
    Object.keys(partidosDelTorneo).forEach(numRonda => {
      partidosDelTorneo[numRonda].forEach(partido => {
        if (partido.status === 'Jugado' || partido.status === 'Cancelado') { // Solo partidos con estado final
          todosLosResultados.push({ ...partido, ronda: parseInt(numRonda, 10) });
        }
      });
    });

    if (rondaFiltro !== 'Todas') {
      const numeroRondaSeleccionada = parseInt(rondaFiltro.split(' ')[1], 10);
      todosLosResultados = todosLosResultados.filter(r => r.ronda === numeroRondaSeleccionada);
    }

    if (busquedaEquipo) {
      const busquedaLower = busquedaEquipo.toLowerCase();
      todosLosResultados = todosLosResultados.filter(r =>
        (r.equipoLocal?.toLowerCase().includes(busquedaLower)) ||
        (r.equipoVisitante?.toLowerCase().includes(busquedaLower))
      );
    }
    
    return todosLosResultados.sort((a, b) => {
        if (a.ronda !== b.ronda) return a.ronda - b.ronda;
        if (a.fecha && b.fecha) return new Date(a.fecha) - new Date(b.fecha);
        return 0;
    });

  }, [torneoSeleccionadoId, rondaFiltro, busquedaEquipo]);

  const torneoSeleccionadoNombre = mockTorneos.find(t => t.id === torneoSeleccionadoId)?.nombre || '';

  const getStatusClassResultado = (status) => {
    if (status === 'Jugado') return styles.statusJugado; // Reutilizar clase existente
    if (status === 'Cancelado') return styles.statusCancelado; // Crear esta clase si no existe
    return '';
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Resultados de Torneos</h1>
          <p className={styles.pageDescription}>
            Consulta los resultados de los partidos finalizados de los torneos.
          </p>

          <div className={`${styles.filtrosContainerCuadros} ${styles.filtrosResultadosTorneo}`}> {/* Reutilizar y añadir clase específica si es necesario */}
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="torneoSelectResultados">Torneo:</label>
              <select id="torneoSelectResultados" value={torneoSeleccionadoId} onChange={(e) => setTorneoSeleccionadoId(e.target.value)}>
                {torneos.map(torneo => <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="rondaFiltroResultados">Ronda:</label>
              <select id="rondaFiltroResultados" value={rondaFiltro} onChange={(e) => setRondaFiltro(e.target.value)} disabled={!torneoSeleccionadoId}>
                {rondasOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="busquedaEquipoResultados">Buscar Equipo:</label>
              <input
                type="text"
                id="busquedaEquipoResultados"
                placeholder="Nombre del equipo..."
                value={busquedaEquipo}
                onChange={(e) => setBusquedaEquipo(e.target.value)}
                disabled={!torneoSeleccionadoId}
              />
            </div>
          </div>

          {torneoSeleccionadoId ? (
            <div 
              ref={resultadosRef} 
              className={`${styles.resultadosContainerTorneo} ${styles.sectionAnimate} ${isResultadosVisible ? styles.visible : ''}`}
            > 
              <h2 className={styles.subPageTitle}>
                Resultados: {torneoSeleccionadoNombre}
                {rondaFiltro !== 'Todas' && ` - ${rondaFiltro}`}
              </h2>
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map(partido => (
                  <div key={partido.idPartido} className={`${styles.partidoCardTorneo} ${styles.resultadoCard} ${getStatusClassResultado(partido.status)}`}>
                    <div className={styles.equipoInfoTorneo}>
                      <span className={partido.ganadorId === partido.equipoLocal ? styles.ganador : ''}>
                        {partido.equipoLocal || 'Equipo Pendiente'}
                      </span>
                      <span className={styles.vs}>vs</span>
                      <span className={partido.ganadorId === partido.equipoVisitante ? styles.ganador : ''}>
                        {partido.equipoVisitante || 'Equipo Pendiente'}
                      </span>
                    </div>
                    <div className={styles.resultadoTorneo}>
                      {partido.resultado || partido.status}
                    </div>
                    <div className={styles.metaPartidoTorneo}> 
                      <span>Ronda {partido.ronda}</span>
                      {partido.fecha && <span>{new Date(partido.fecha).toLocaleDateString('es-ES')}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.infoMessage}>
                  No hay resultados que coincidan con los filtros seleccionados para este torneo.
                </p>
              )}
            </div>
          ) : (
            <p className={styles.infoMessage}>Selecciona un torneo para ver los resultados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TorneosResultados; 