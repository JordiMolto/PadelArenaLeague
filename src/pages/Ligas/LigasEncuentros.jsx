// src/pages/Ligas/LigasEncuentros.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css'; // Reutilizaremos y expandiremos

// --- Mock Data ---
// Reutilizamos mockLigas
const mockLigas = [
  { id: 'liga-verano-int', nombre: 'Liga Verano (Intermedio)', tipo: 'Temporada Regular', categoria: 'Intermedio', zona: 'Club Central', temporada: 'Verano 2024', jornadaActualNum: 3, totalJornadas: 5 },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', tipo: 'Temporada Regular', categoria: 'Avanzado', zona: 'Polideportivo Norte', temporada: 'Invierno 2024', jornadaActualNum: 2, totalJornadas: 3 },
  // ... otras ligas
];

const mockEncuentrosPorLiga = {
  'liga-verano-int': {
    1: [ // Jornada 1
      { idPartido: 'p1', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: '2024-07-15 19:00', resultado: '6-2, 6-3', status: 'Jugado' },
      { idPartido: 'p2', idEquipoLocal: 'equ3', nombreEquipoLocal: 'Viboras Team', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-16 20:00', resultado: '7-5, 6-4', status: 'Jugado' },
    ],
    2: [ // Jornada 2
      { idPartido: 'p3', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: '2024-07-22 18:00', resultado: '6-4, 3-6, 6-1', status: 'Jugado' },
      { idPartido: 'p4', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-23 21:00', resultado: '6-1, 6-0', status: 'Jugado' },
    ],
    3: [ // Jornada 3 (Actual)
      { idPartido: 'p5', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-29 19:30', resultado: null, status: 'Pendiente' },
      { idPartido: 'p6', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: null, resultado: null, status: 'Próximo' }, // Sin fecha acordada aún
    ],
    4: [ // Jornada 4 (Futura)
       { idPartido: 'p7', idEquipoLocal: 'equ4', nombreEquipoLocal: 'Los Martillos', idEquipoVisitante: 'equ1', nombreEquipoVisitante: 'Los Dinámicos', fechaHora: null, resultado: null, status: 'Próximo' },
       { idPartido: 'p8', idEquipoLocal: 'equ3', nombreEquipoLocal: 'Viboras Team', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: null, resultado: null, status: 'Próximo' },
    ],
     5: [ // Jornada 5 (Futura)
       { idPartido: 'p9', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: null, resultado: null, status: 'Próximo' },
       { idPartido: 'p10', idEquipoLocal: 'equ4', nombreEquipoLocal: 'Los Martillos', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: null, resultado: null, status: 'Próximo' },
    ],
  },
  'liga-invierno-av': {
     1: [
        { idPartido: 'p11', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: '2024-01-10 20:00', resultado: '6-1, 6-2', status: 'Jugado' },
     ],
     2: [ // Actual
        { idPartido: 'p12', idEquipoLocal: 'equ6', nombreEquipoLocal: 'Furia Roja', idEquipoVisitante: 'equ5', nombreEquipoVisitante: 'Titanes del Padel', fechaHora: '2024-01-17 20:00', resultado: null, status: 'Pendiente' },
     ],
      3: [ // Futura
        { idPartido: 'p13', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: null, resultado: null, status: 'Próximo' },
     ],
  }
};

// --- Fin Mock Data ---

const LigasEncuentros = () => {
  const [ligas, setLigas] = useState([]);
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState('Actual'); // Puede ser 'Actual' o un número
  const [jornadasOptions, setJornadasOptions] = useState(['Actual']); // Opciones para el selector
  const [jornadaActualNum, setJornadaActualNum] = useState(null); // El número real de la jornada actual
  const [encuentrosMostrados, setEncuentrosMostrados] = useState([]);

  useEffect(() => {
    // Cargar ligas para el selector
    setLigas([{ id: '', nombre: 'Selecciona una liga...' }, ...mockLigas]);
  }, []);

  // Efecto para actualizar opciones de jornada y cargar encuentros cuando cambia la liga
  useEffect(() => {
    if (ligaSeleccionadaId) {
      const ligaData = mockLigas.find(l => l.id === ligaSeleccionadaId);
      const encuentrosLiga = mockEncuentrosPorLiga[ligaSeleccionadaId];
      
      if (ligaData && encuentrosLiga) {
        const numJornadas = ligaData.totalJornadas || Object.keys(encuentrosLiga).length; // Usar totalJornadas si existe
        const actualNum = ligaData.jornadaActualNum;
        setJornadaActualNum(actualNum);
        
        // Generar opciones para el selector de jornada
        const options = ['Actual'];
        if (actualNum > 1) options.push('Anterior');
        for (let i = 1; i <= numJornadas; i++) {
          options.push(`${i}`);
        }
         if (actualNum < numJornadas) options.push('Siguiente');
        setJornadasOptions(options);
        
        // Cargar encuentros de la jornada actual por defecto
        setJornadaSeleccionada('Actual'); // Resetear a 'Actual' al cambiar de liga
        const numToShow = actualNum;
        setEncuentrosMostrados(encuentrosLiga[numToShow] || []);

      } else {
        // Limpiar si la liga no tiene datos
        setJornadasOptions(['Actual']);
        setJornadaActualNum(null);
        setEncuentrosMostrados([]);
         setJornadaSeleccionada('Actual');
      }
    } else {
      // Limpiar si no hay liga seleccionada
      setJornadasOptions(['Actual']);
      setJornadaActualNum(null);
      setEncuentrosMostrados([]);
       setJornadaSeleccionada('Actual');
    }
  }, [ligaSeleccionadaId]);

  // Efecto para cargar encuentros cuando cambia la jornada seleccionada
  useEffect(() => {
     if (ligaSeleccionadaId && jornadaActualNum !== null) {
        const encuentrosLiga = mockEncuentrosPorLiga[ligaSeleccionadaId];
        let numToShow = jornadaActualNum;

        if (jornadaSeleccionada === 'Actual') {
            numToShow = jornadaActualNum;
        } else if (jornadaSeleccionada === 'Anterior') {
            numToShow = Math.max(1, jornadaActualNum - 1);
        } else if (jornadaSeleccionada === 'Siguiente') {
            const totalJornadas = mockLigas.find(l => l.id === ligaSeleccionadaId)?.totalJornadas || Object.keys(encuentrosLiga).length;
            numToShow = Math.min(totalJornadas, jornadaActualNum + 1);
        } else {
            // Es un número específico
            numToShow = parseInt(jornadaSeleccionada, 10);
        }
        
        setEncuentrosMostrados(encuentrosLiga[numToShow] || []);
     }
  }, [jornadaSeleccionada, ligaSeleccionadaId, jornadaActualNum]); // Depende de estos 3

  const handleJornadaChange = (e) => {
      setJornadaSeleccionada(e.target.value);
  }
  
  const getJornadaDisplayNumber = () => {
      if (jornadaSeleccionada === 'Actual') return jornadaActualNum;
      if (jornadaSeleccionada === 'Anterior') return Math.max(1, jornadaActualNum - 1);
      if (jornadaSeleccionada === 'Siguiente') {
          const totalJornadas = mockLigas.find(l => l.id === ligaSeleccionadaId)?.totalJornadas || Object.keys(mockEncuentrosPorLiga[ligaSeleccionadaId] || {}).length;
          return Math.min(totalJornadas, jornadaActualNum + 1);
      }
      return parseInt(jornadaSeleccionada, 10);
  }

  const ligaSeleccionadaNombre = mockLigas.find(l => l.id === ligaSeleccionadaId)?.nombre || '';
  const jornadaDisplayNum = ligaSeleccionadaId && jornadaActualNum ? getJornadaDisplayNumber() : null;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Encuentros de las Ligas</h1>
          <p className={styles.pageDescription}>
            Selecciona una liga y una jornada para ver los partidos programados y los resultados.
          </p>

          <div className={styles.filtrosContainerEncuentros}> {/* Nueva clase */}
            <div className={styles.filtroItem}>
              <label htmlFor="ligaSelectEncuentros">Liga:</label>
              <select id="ligaSelectEncuentros" value={ligaSeleccionadaId} onChange={(e) => setLigaSeleccionadaId(e.target.value)}>
                {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="jornadaSelect">Jornada:</label>
              <select id="jornadaSelect" value={jornadaSeleccionada} onChange={handleJornadaChange} disabled={!ligaSeleccionadaId}>
                {jornadasOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === 'Actual' ? `Jornada Actual (${jornadaActualNum || '?'})` : 
                     opt === 'Anterior' ? `Jornada Anterior (${Math.max(1, (jornadaActualNum || 1) - 1)})` :
                     opt === 'Siguiente' ? `Próxima Jornada (${Math.min((mockLigas.find(l => l.id === ligaSeleccionadaId)?.totalJornadas || 0), (jornadaActualNum || 0) + 1)})` :
                     `Jornada ${opt}`
                    }
                  </option>
                ))}
              </select>
            </div>
             {/* Aquí podrían ir más filtros (categoría, equipo) */}
          </div>

          {ligaSeleccionadaId && jornadaDisplayNum ? (
            <div className={styles.encuentrosContainer}>
              <h2 className={styles.subPageTitle}>{ligaSeleccionadaNombre} - Jornada {jornadaDisplayNum}</h2>
              {encuentrosMostrados.length > 0 ? (
                encuentrosMostrados.map(partido => (
                  <div key={partido.idPartido} className={styles.encuentroCard}>
                     <div className={styles.equipoInfo}>
                        <span className={styles.equipoLocal}>{partido.nombreEquipoLocal}</span>
                        <span className={styles.vs}>vs</span>
                        <span className={styles.equipoVisitante}>{partido.nombreEquipoVisitante}</span>
                    </div>
                    <div className={styles.resultadoInfo}>
                        {partido.status === 'Jugado' ? (
                             <span className={`${styles.resultado} ${styles.statusJugado}`}>{partido.resultado}</span>
                        ) : (
                            <span className={`${styles.resultado} ${partido.status === 'Pendiente' ? styles.statusPendiente : styles.statusProximo}`}>                        {partido.status}
                            </span>
                        )}
                    </div>
                     <div className={styles.fechaHoraInfo}>
                        {partido.fechaHora ? new Date(partido.fechaHora).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Fecha/Hora pendiente'}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.infoMessage}>No hay encuentros programados para esta jornada.</p>
              )}
               {/* Botones de navegación entre jornadas podrían ir aquí */}
            </div>
          ) : (
            <p className={styles.infoMessage}>{ligaSeleccionadaId ? 'Cargando jornadas...' : 'Selecciona una liga para ver los encuentros.'}</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default LigasEncuentros; 