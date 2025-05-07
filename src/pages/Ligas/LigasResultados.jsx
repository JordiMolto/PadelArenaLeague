import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css';

// --- Mock Data ---
// Reutilizamos mockLigas y mockEncuentrosPorLiga de LigasEncuentros.jsx
// En una aplicación real, estos datos vendrían de un contexto, store o API.
const mockLigas = [
  { id: 'liga-verano-int', nombre: 'Liga Verano (Intermedio)', temporada: 'Verano 2024', jornadaActualNum: 3, totalJornadas: 5 },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', temporada: 'Invierno 2024', jornadaActualNum: 2, totalJornadas: 3 },
  { id: 'liga-express-mixta', nombre: 'Liga Express Mixta', temporada: 'Primavera 2024', jornadaActualNum: 1, totalJornadas: 1 },
];

const mockEncuentrosPorLiga = {
  'liga-verano-int': {
    1: [
      { idPartido: 'p1', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: '2024-07-15 19:00', resultado: '6-2, 6-3', status: 'Jugado' },
      { idPartido: 'p2', idEquipoLocal: 'equ3', nombreEquipoLocal: 'Viboras Team', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-16 20:00', resultado: '7-5, 6-4', status: 'Jugado' },
    ],
    2: [
      { idPartido: 'p3', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: '2024-07-22 18:00', resultado: '6-4, 3-6, 6-1', status: 'Jugado' },
      { idPartido: 'p4', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-23 21:00', resultado: '6-1, 6-0', status: 'Jugado' },
    ],
    3: [
      { idPartido: 'p5', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-29 19:30', resultado: 'Cancelado', status: 'Cancelado' }, // Ejemplo de cancelado
      { idPartido: 'p6', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: null, resultado: null, status: 'Pendiente' },
    ],
    // ... más jornadas y partidos
  },
  'liga-invierno-av': {
     1: [
        { idPartido: 'p11', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: '2024-01-10 20:00', resultado: '6-1, 6-2', status: 'Jugado' },
     ],
     2: [
        { idPartido: 'p12', idEquipoLocal: 'equ6', nombreEquipoLocal: 'Furia Roja', idEquipoVisitante: 'equ5', nombreEquipoVisitante: 'Titanes del Padel', fechaHora: '2024-01-17 20:00', resultado: 'Walkover (Visitante no se presentó)', status: 'Walkover' }, // Ejemplo Walkover
     ],
      3: [
        { idPartido: 'p13', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: null, resultado: null, status: 'Pendiente' },
     ],
  }
};
// --- Fin Mock Data ---

const LigasResultados = () => {
  const [ligas, setLigas] = useState([]);
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [jornadaFiltro, setJornadaFiltro] = useState('Todas'); // 'Todas' o un número de jornada
  const [busquedaEquipo, setBusquedaEquipo] = useState('');
  const [jornadasOptions, setJornadasOptions] = useState(['Todas']);

  useEffect(() => {
    setLigas([{ id: '', nombre: 'Selecciona una liga...' }, ...mockLigas]);
  }, []);

  useEffect(() => {
    if (ligaSeleccionadaId) {
      const ligaData = mockLigas.find(l => l.id === ligaSeleccionadaId);
      if (ligaData) {
        const numJornadas = ligaData.totalJornadas || 0;
        const options = ['Todas'];
        for (let i = 1; i <= numJornadas; i++) {
          options.push(`${i}`);
        }
        setJornadasOptions(options);
        setJornadaFiltro('Todas'); // Resetear filtro de jornada al cambiar de liga
      }
    } else {
      setJornadasOptions(['Todas']);
      setJornadaFiltro('Todas');
    }
  }, [ligaSeleccionadaId]);

  const resultadosFiltrados = useMemo(() => {
    if (!ligaSeleccionadaId) return [];

    const encuentrosDeLiga = mockEncuentrosPorLiga[ligaSeleccionadaId];
    if (!encuentrosDeLiga) return [];

    let todosLosResultados = [];
    Object.keys(encuentrosDeLiga).forEach(numJornada => {
      encuentrosDeLiga[numJornada].forEach(partido => {
        if (partido.status === 'Jugado' || partido.status === 'Walkover' || partido.status === 'Cancelado') { // Incluimos diferentes estados finales
          todosLosResultados.push({ ...partido, jornada: parseInt(numJornada, 10) });
        }
      });
    });

    // Filtrar por jornada seleccionada
    if (jornadaFiltro !== 'Todas') {
      todosLosResultados = todosLosResultados.filter(r => r.jornada === parseInt(jornadaFiltro, 10));
    }

    // Filtrar por búsqueda de equipo
    if (busquedaEquipo) {
      const busquedaLower = busquedaEquipo.toLowerCase();
      todosLosResultados = todosLosResultados.filter(r =>
        r.nombreEquipoLocal.toLowerCase().includes(busquedaLower) ||
        r.nombreEquipoVisitante.toLowerCase().includes(busquedaLower)
      );
    }
    
    // Ordenar por jornada y luego por fecha si existe
    return todosLosResultados.sort((a, b) => {
        if (a.jornada !== b.jornada) {
            return a.jornada - b.jornada;
        }
        if (a.fechaHora && b.fechaHora) {
            return new Date(a.fechaHora) - new Date(b.fechaHora);
        }
        return 0;
    });

  }, [ligaSeleccionadaId, jornadaFiltro, busquedaEquipo]);

  const ligaSeleccionadaNombre = mockLigas.find(l => l.id === ligaSeleccionadaId)?.nombre || '';

  const getStatusClass = (status) => {
    if (status === 'Jugado') return styles.statusJugado;
    if (status === 'Walkover') return styles.statusPendiente; // Podríamos crear un estilo específico para Walkover
    if (status === 'Cancelado') return styles.statusCancelado; // Podríamos crear un estilo específico para Cancelado
    return '';
  };


  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Resultados de Ligas</h1>
          <p className={styles.pageDescription}>
            Consulta los resultados de los partidos finalizados. Filtra por liga, jornada o equipo.
          </p>

          <div className={styles.filtrosContainerEncuentros}> {/* Reutilizamos clase de filtros de encuentros */}
            <div className={styles.filtroItem}>
              <label htmlFor="ligaSelectResultados">Liga:</label>
              <select id="ligaSelectResultados" value={ligaSeleccionadaId} onChange={(e) => setLigaSeleccionadaId(e.target.value)}>
                {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="jornadaFiltroResultados">Jornada:</label>
              <select id="jornadaFiltroResultados" value={jornadaFiltro} onChange={(e) => setJornadaFiltro(e.target.value)} disabled={!ligaSeleccionadaId}>
                {jornadasOptions.map(opt => (
                  <option key={opt} value={opt}>{opt === 'Todas' ? 'Todas las Jornadas' : `Jornada ${opt}`}</option>
                ))}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="busquedaEquipoResultados">Buscar por Equipo:</label>
              <input
                type="text"
                id="busquedaEquipoResultados"
                placeholder="Nombre del equipo..."
                value={busquedaEquipo}
                onChange={(e) => setBusquedaEquipo(e.target.value)}
                disabled={!ligaSeleccionadaId}
              />
            </div>
          </div>

          {ligaSeleccionadaId ? (
            <div className={styles.encuentrosContainer}> {/* Reutilizamos clase de container de encuentros */}
              <h2 className={styles.subPageTitle}>
                Resultados: {ligaSeleccionadaNombre}
                {jornadaFiltro !== 'Todas' && ` - Jornada ${jornadaFiltro}`}
              </h2>
              {resultadosFiltrados.length > 0 ? (
                resultadosFiltrados.map(partido => (
                  <div key={partido.idPartido} className={styles.encuentroCard}>
                    <div className={styles.equipoInfo}>
                      <span className={styles.equipoLocal}>{partido.nombreEquipoLocal}</span>
                      <span className={styles.vs}>vs</span>
                      <span className={styles.equipoVisitante}>{partido.nombreEquipoVisitante}</span>
                    </div>
                    <div className={styles.resultadoInfo}>
                      <span className={`${styles.resultado} ${getStatusClass(partido.status)}`}>
                        {partido.resultado || partido.status}
                      </span>
                    </div>
                    <div className={styles.fechaHoraInfo}>
                      Jornada {partido.jornada}
                      {partido.fechaHora && ` - ${new Date(partido.fechaHora).toLocaleDateString('es-ES')}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.infoMessage}>
                  No hay resultados que coincidan con los filtros seleccionados.
                </p>
              )}
            </div>
          ) : (
            <p className={styles.infoMessage}>Selecciona una liga para ver los resultados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasResultados; 