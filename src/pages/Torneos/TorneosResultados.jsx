import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom'; // Asegurarse de importar Link
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

// --- Mock Data Ampliado ---
const mockCategorias = ['Todas', 'Masculino', 'Femenino', 'Mixto'];
const mockFormatos = ['Todos', 'Individual', 'Dobles', 'Equipos'];
const mockEstadosPartido = ['Todos', 'Finalizado', 'Incomparecencia', 'Reprogramado', 'Pendiente'];

const mockTorneos = [
  {
    id: 'torneo-verano-2024', 
    nombre: 'Torneo de Verano 2024', 
    tipo: 'Eliminatoria Directa', 
    categoria: 'Masculino', 
    formato: 'Dobles', 
    totalRondas: 4, 
    fechaInicio: '2024-08-01',
    ganador: { nombre: 'Pareja Alfa', imagenUrl: '' },
    subcampeon: { nombre: 'Los Invencibles', imagenUrl: '' },
    semifinalistas: ['Pareja Gamma', 'Equipo Sorpresa'],
    partidosDisputados: 7,
    porcentajeParticipacion: 87.5 
  },
  {
    id: 'torneo-invierno-femenino',
    nombre: 'Torneo Invierno Femenino',
    tipo: 'Liguilla + Eliminatoria',
    categoria: 'Femenino',
    formato: 'Dobles',
    totalRondas: 3, 
    fechaInicio: '2024-11-15',
    ganador: { nombre: 'Damas de Hierro', imagenUrl: '' },
    subcampeon: { nombre: 'Reinas de la Pista', imagenUrl: '' },
    semifinalistas: [],
    partidosDisputados: 2,
    porcentajeParticipacion: 100
  },
  { id: 'torneo-express-mixto', nombre: 'Torneo Express Mixto', tipo: 'Express', categoria: 'Mixto', formato: 'Dobles', totalRondas: 3, fechaInicio: '2024-09-07' },
];

const mockPartidosPorTorneo = {
  'torneo-verano-2024': {
    1: [ 
      { idPartido: 'tv24-r1-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Beta', resultado: '6-2, 6-3', ganadorId: 'Pareja Alfa', status: 'Finalizado', fecha: '2024-08-02', observaciones: 'Sin incidencias.' },
      { idPartido: 'tv24-r1-p2', equipoLocal: 'Pareja Gamma', equipoVisitante: 'Pareja Delta', resultado: 'W/O Local', ganadorId: 'Pareja Gamma', status: 'Incomparecencia', fecha: '2024-08-02', observaciones: 'Visitante no se presentó.' },
      { idPartido: 'tv24-r1-p3', equipoLocal: 'Los Invencibles', equipoVisitante: 'Maestros del Padel', resultado: '7-6, 6-7, 6-4', ganadorId: 'Los Invencibles', status: 'Finalizado', fecha: '2024-08-03', observaciones: 'Partido muy igualado.' },
      { idPartido: 'tv24-r1-p4', equipoLocal: 'Equipo Sorpresa', equipoVisitante: 'Los Favoritos', resultado: '6-0, 6-0', ganadorId: 'Equipo Sorpresa', status: 'Finalizado', fecha: '2024-08-03' },
    ],
    2: [ 
      { idPartido: 'tv24-r2-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Gamma', resultado: '6-1, 6-0', ganadorId: 'Pareja Alfa', status: 'Finalizado', fecha: '2024-08-10' },
      { idPartido: 'tv24-r2-p2', equipoLocal: 'Los Invencibles', equipoVisitante: 'Equipo Sorpresa', resultado: null, status: 'Pendiente', fecha: '2024-08-11' }, 
    ],
    3: [ 
      { idPartido: 'tv24-r3-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Ganador R2P2', resultado: null, status: 'Pendiente', fecha: '2024-08-18' },
    ],
    4: [ 
      { idPartido: 'tv24-r4-p1', equipoLocal: 'Ganador R3P1', equipoVisitante: 'Ganador R3P2', resultado: null, status: 'Pendiente', fecha: '2024-09-01' },
    ]
  },
  'torneo-invierno-femenino': {
    1: [ 
        { idPartido: 'tif24-fg-p1', equipoLocal: 'Damas de Hierro', equipoVisitante: 'Reinas de la Pista', resultado: '6-3, 6-4', ganadorId: 'Damas de Hierro', status: 'Finalizado', fecha: '2024-11-16' },
        { idPartido: 'tif24-fg-p2', equipoLocal: 'Amazonas Padel', equipoVisitante: 'Guerreras de la Red', resultado: 'Cancelado', ganadorId: null, status: 'No disputado', fecha: '2024-11-16', observaciones: 'Lluvia intensa.' },
    ]
  }
};
// --- Fin Mock Data ---

const TorneosResultados = () => {
  const [torneosDisponibles, setTorneosDisponibles] = useState([]);
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState('');
  
  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [filtroRonda, setFiltroRonda] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [rondasOptions, setRondasOptions] = useState(['Todas']);

  // Refs para animación
  const [filtrosRef, isFiltrosVisible] = useElementOnScreen({ threshold: 0.1 });
  const [ganadoresRef, isGanadoresVisible] = useElementOnScreen({ threshold: 0.1 });
  const [resultadosTablaRef, isResultadosTablaVisible] = useElementOnScreen({ threshold: 0.05 });
  const [accionesRef, isAccionesVisible] = useElementOnScreen({ threshold: 0.1 });

  // Cargar torneos disponibles para el selector principal (filtrado por categoría y formato)
  useEffect(() => {
    const filtrados = mockTorneos.filter(t => 
      (filtroCategoria === 'Todas' || t.categoria === filtroCategoria) &&
      (filtroFormato === 'Todos' || t.formato === filtroFormato)
    );
    setTorneosDisponibles([{ id: '', nombre: 'Selecciona un torneo...' }, ...filtrados]);
    setTorneoSeleccionadoId(''); 
  }, [filtroCategoria, filtroFormato]);

  // Actualizar opciones de ronda cuando cambia el torneo seleccionado
  useEffect(() => {
    if (torneoSeleccionadoId) {
      const torneoData = mockTorneos.find(t => t.id === torneoSeleccionadoId);
      if (torneoData) {
        const options = ['Todas'];
        for (let i = 1; i <= torneoData.totalRondas; i++) {
          options.push(`Ronda ${i}`);
        }
        setRondasOptions(options);
      }
    } else {
      setRondasOptions(['Todas']);
    }
    setFiltroRonda('Todas'); 
  }, [torneoSeleccionadoId]);

  const torneoSeleccionadoData = useMemo(() => {
    return mockTorneos.find(t => t.id === torneoSeleccionadoId);
  }, [torneoSeleccionadoId]);

  const resultadosFiltrados = useMemo(() => {
    if (!torneoSeleccionadoId || !mockPartidosPorTorneo[torneoSeleccionadoId]) return [];

    const partidosDelTorneo = mockPartidosPorTorneo[torneoSeleccionadoId];
    let todosLosResultados = [];

    Object.keys(partidosDelTorneo).forEach(numRonda => {
      partidosDelTorneo[numRonda].forEach(partido => {
        todosLosResultados.push({ ...partido, rondaNum: parseInt(numRonda, 10) });
      });
    });

    if (filtroRonda !== 'Todas') {
      const numeroRondaSel = parseInt(filtroRonda.split(' ')[1], 10);
      todosLosResultados = todosLosResultados.filter(r => r.rondaNum === numeroRondaSel);
    }
    if (filtroEstado !== 'Todos') {
      todosLosResultados = todosLosResultados.filter(r => r.status === filtroEstado);
    }
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      todosLosResultados = todosLosResultados.filter(r =>
        (r.equipoLocal?.toLowerCase().includes(busquedaLower)) ||
        (r.equipoVisitante?.toLowerCase().includes(busquedaLower))
      );
    }
    
    return todosLosResultados.sort((a, b) => {
        if (a.rondaNum !== b.rondaNum) return a.rondaNum - b.rondaNum;
        if (a.fecha && b.fecha) return new Date(a.fecha) - new Date(b.fecha);
        return 0;
    });

  }, [torneoSeleccionadoId, filtroRonda, filtroEstado, busqueda]);

  const handlePartidoClick = (partido) => {
    alert(
`Detalle del Partido (ID: ${partido.idPartido}):
Fecha: ${partido.fecha ? new Date(partido.fecha).toLocaleString() : 'N/A'}
Ronda: ${partido.rondaNum}
Local: ${partido.equipoLocal || '-'}
Visitante: ${partido.equipoVisitante || '-'}
Resultado: ${partido.resultado || '-'}
Estado: ${partido.status}
Observaciones: ${partido.observaciones || 'Ninguna'}
`
    );
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Finalizado': return { text: 'Finalizado', icon: '✅', className: styles.statusFinalizado };
      case 'Incomparecencia': return { text: 'Incomp.', icon: '❌', className: styles.statusIncomparecencia };
      case 'Reprogramado': return { text: 'Reprogr.', icon: '🔁', className: styles.statusReprogramado };
      case 'Pendiente': return { text: 'Pendiente', icon: '⏳', className: styles.statusPendiente };
      case 'No disputado': return { text: 'No Jugado', icon: '🚫', className: styles.statusNoDisputado };
      default: return { text: status || 'N/A', icon: '❔', className: styles.statusDesconocido };
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Resultados de Torneos</h1>
          <p className={styles.pageDescription}>
            Consulta todos los partidos disputados, ganadores por ronda y el historial de torneos.
          </p>

          {/* --- Filtros --- */}
          <div 
            ref={filtrosRef}
            className={`${styles.filtrosContainerResultados} ${styles.sectionAnimate} ${isFiltrosVisible ? styles.visible : ''}`}
          >
            <div className={styles.filtroItemTorneo}>
              <label htmlFor="filtroCategoriaRes">Categoría:</label>
              <select id="filtroCategoriaRes" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {mockCategorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemTorneo}>
              <label htmlFor="filtroFormatoRes">Formato:</label>
              <select id="filtroFormatoRes" value={filtroFormato} onChange={(e) => setFiltroFormato(e.target.value)}>
                {mockFormatos.map(form => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemTorneo}>
              <label htmlFor="torneoSelectResultados">Torneo:</label>
              <select id="torneoSelectResultados" value={torneoSeleccionadoId} onChange={(e) => setTorneoSeleccionadoId(e.target.value)} disabled={torneosDisponibles.length <= 1 && filtroCategoria === 'Todas' && filtroFormato === 'Todos'}>
                {torneosDisponibles.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
             <div className={styles.filtroItemTorneo}>
              <label htmlFor="rondaFiltroResultados">Ronda:</label>
              <select id="rondaFiltroResultados" value={filtroRonda} onChange={(e) => setFiltroRonda(e.target.value)} disabled={!torneoSeleccionadoId}>
                {rondasOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemTorneo}>
              <label htmlFor="filtroEstadoResultados">Estado:</label>
              <select id="filtroEstadoResultados" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} disabled={!torneoSeleccionadoId}>
                {mockEstadosPartido.map(est => <option key={est} value={est}>{est}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemTorneoFullWidth}>
              <label htmlFor="busquedaEquipoResultados">Buscar Jugador/Equipo:</label>
              <input type="text" id="busquedaEquipoResultados" placeholder="Nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} disabled={!torneoSeleccionadoId}/>
            </div>
          </div>

          {/* --- Ganadores del Torneo (Destacado) --- */}
          {torneoSeleccionadoData && (torneoSeleccionadoData.ganador || torneoSeleccionadoData.subcampeon) && (
            <div 
              ref={ganadoresRef}
              className={`${styles.ganadoresTorneoContainer} ${styles.sectionAnimate} ${isGanadoresVisible ? styles.visible : ''}`}
            >
              <h2 className={styles.subPageTitleSmall}>Podio: {torneoSeleccionadoData.nombre}</h2>
              <div className={styles.podioGrid}>
                {torneoSeleccionadoData.ganador && (
                  <div className={styles.podioItem}>
                    <span className={styles.podioIcon}>🥇</span>
                    <span className={styles.podioNombre}>{torneoSeleccionadoData.ganador.nombre}</span>
                    <span className={styles.podioRol}>Campeón</span>
                  </div>
                )}
                {torneoSeleccionadoData.subcampeon && (
                  <div className={styles.podioItem}>
                    <span className={styles.podioIcon}>🥈</span>
                    <span className={styles.podioNombre}>{torneoSeleccionadoData.subcampeon.nombre}</span>
                    <span className={styles.podioRol}>Subcampeón</span>
                  </div>
                )}
                {torneoSeleccionadoData.semifinalistas && torneoSeleccionadoData.semifinalistas.length > 0 && (
                  <div className={styles.podioItemSemifinalistas}>
                    <span className={styles.podioIcon}>🥉</span>
                    <span className={styles.podioRol}>Semifinalistas: {torneoSeleccionadoData.semifinalistas.join(', ')}</span>
                  </div>
                )}
              </div>
              <div className={styles.podioStats}>
                <span>Partidos Disputados: {torneoSeleccionadoData.partidosDisputados || 'N/A'}</span>
                <span>Participación: {torneoSeleccionadoData.porcentajeParticipacion ? `${torneoSeleccionadoData.porcentajeParticipacion}%` : 'N/A'}</span>
              </div>
            </div>
          )}

          {/* --- Listado de Resultados (Tabla) --- */}
          {torneoSeleccionadoId ? (
            <div 
              ref={resultadosTablaRef}
              className={`${styles.resultadosTablaContainer} ${styles.sectionAnimate} ${isResultadosTablaVisible ? styles.visible : ''}`}
            > 
              <h2 className={styles.subPageTitle}>Resultados Detallados: {torneoSeleccionadoData?.nombre}</h2>
              {resultadosFiltrados.length > 0 ? (
                <div className={styles.tablaResponsiveContainer}>
                    <table className={styles.tablaResultados}>
                        <thead>
                            <tr>
                                <th>Ronda</th>
                                <th>Fecha</th>
                                <th>Equipo Local</th>
                                <th>Resultado</th>
                                <th>Equipo Visitante</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadosFiltrados.map(partido => {
                                const statusInfo = getStatusInfo(partido.status);
                                return (
                                    <tr key={partido.idPartido} onClick={() => handlePartidoClick(partido)} className={`${styles.filaResultado} ${statusInfo.className}`}>
                                        <td>Ronda {partido.rondaNum}</td>
                                        <td>{partido.fecha ? new Date(partido.fecha).toLocaleDateString() : '-'}</td>
                                        <td>{partido.equipoLocal || '-'}</td>
                                        <td className={styles.marcador}>{partido.resultado || '-'}</td>
                                        <td>{partido.equipoVisitante || '-'}</td>
                                        <td> <span className={styles.statusIcon}>{statusInfo.icon}</span> {statusInfo.text}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
              ) : (
                <p className={styles.infoMessage}>No hay resultados que coincidan con los filtros seleccionados.</p>
              )}
            </div>
          ) : (
            <p className={styles.infoMessage}>Selecciona un torneo para ver los resultados.</p>
          )}

          {/* --- CTA y Navegación --- */}
          {torneoSeleccionadoData && (
             <div 
              ref={accionesRef}
              className={`${styles.navegacionComplementaria} ${styles.sectionAnimate} ${isAccionesVisible ? styles.visible : ''}`}
            >
              <Link to={`/torneos/cuadros?torneo=${torneoSeleccionadoId}`} className={styles.navLinkComplementario}> Ver Cuadro del Torneo</Link>
              <Link to="/torneos/inscripcion" className={styles.navLinkComplementario}>Inscribirse a otro Torneo</Link>
              {/* <Link to={`/torneos/clasificacion-global`} className={styles.navLinkComplementario}>Clasificación Inter-Torneos</Link> */} 
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TorneosResultados; 