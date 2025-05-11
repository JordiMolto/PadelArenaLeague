import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
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

// --- Mock Data Ampliado ---
const mockCategorias = ['Todas', 'Masculino', 'Femenino', 'Mixto'];
const mockFormatos = ['Todos', 'Individual', 'Dobles', 'Equipos'];
// (totalRondas ahora es solo un número)
const mockTorneos = [
  { id: 'torneo-verano-2024', nombre: 'Torneo de Verano 2024', tipo: 'Eliminatoria Directa', categoria: 'Masculino', formato: 'Dobles', totalRondas: 4, fechaInicio: '2024-08-01', clasificadosSemi: ['Pareja Alfa', 'Equipo Sorpresa'], partidosJugados: 5, incomparecencias: 1, proximoPartido: 'Final - Por definir (01/09)' },
  { id: 'torneo-invierno-femenino', nombre: 'Torneo Invierno Femenino', tipo: 'Liguilla + Eliminatoria', categoria: 'Femenino', formato: 'Dobles', totalRondas: 3, fechaInicio: '2024-11-15', clasificadosSemi: ['Las Reinas', 'Las Amazonas'], partidosJugados: 10, incomparecencias: 0, proximoPartido: 'Semi 2 - 20/11' },
  { id: 'torneo-express-mixto', nombre: 'Torneo Express Mixto Fin de Semana', tipo: 'Express', categoria: 'Mixto', formato: 'Dobles', totalRondas: 3, fechaInicio: '2024-09-07', clasificadosSemi: [], partidosJugados: 0, incomparecencias: 0, proximoPartido: 'Ronda 1 - 07/09' },
];

const mockPartidosPorTorneo = {
  'torneo-verano-2024': {
    1: [ 
      { idPartido: 'tv24-r1-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Beta', resultado: '6-2, 6-3', ganadorId: 'Pareja Alfa', siguientePartidoId: 'tv24-r2-p1', status: 'Finalizado', fecha: '2024-08-02' },
      { idPartido: 'tv24-r1-p2', equipoLocal: 'Pareja Gamma', equipoVisitante: 'Pareja Delta', resultado: 'Walkover (Gamma)', ganadorId: 'Pareja Gamma', siguientePartidoId: 'tv24-r2-p1', status: 'Finalizado', fecha: '2024-08-02' },
      { idPartido: 'tv24-r1-p3', equipoLocal: 'Los Invencibles', equipoVisitante: 'Maestros del Padel', resultado: '7-6, 6-7, 6-4', ganadorId: 'Los Invencibles', siguientePartidoId: 'tv24-r2-p2', status: 'Finalizado', fecha: '2024-08-03' },
      { idPartido: 'tv24-r1-p4', equipoLocal: 'Equipo Sorpresa', equipoVisitante: 'Los Favoritos', resultado: '6-0, 6-0', ganadorId: 'Equipo Sorpresa', siguientePartidoId: 'tv24-r2-p2', status: 'Finalizado', fecha: '2024-08-03' },
    ],
    2: [ 
      { idPartido: 'tv24-r2-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: 'Pareja Gamma', resultado: '6-1, 6-0', ganadorId: 'Pareja Alfa', siguientePartidoId: 'tv24-r3-p1', status: 'Finalizado', fecha: '2024-08-10' },
      { idPartido: 'tv24-r2-p2', equipoLocal: 'Los Invencibles', equipoVisitante: 'Equipo Sorpresa', resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r3-p1', status: 'Pendiente', fecha: '2024-08-11' },
    ],
    3: [ 
      { idPartido: 'tv24-r3-p1', equipoLocal: 'Pareja Alfa', equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r4-p1', status: 'Por definir', fecha: '2024-08-18' },
      { idPartido: 'tv24-r3-p2', equipoLocal: null, equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: 'tv24-r4-p1', status: 'Por definir', fecha: '2024-08-18' },
    ],
    4: [ 
      { idPartido: 'tv24-r4-p1', equipoLocal: null, equipoVisitante: null, resultado: null, ganadorId: null, siguientePartidoId: null, status: 'Por definir', fecha: '2024-09-01' },
    ]
  },
};
// --- Fin Mock Data ---

const TorneosCuadros = () => {
  const [torneosDisponibles, setTorneosDisponibles] = useState([]);
  const [torneoSeleccionadoId, setTorneoSeleccionadoId] = useState('');
  const [cuadro, setCuadro] = useState(null);
  
  // Nuevos estados para filtros
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [filtroRondaLista, setFiltroRondaLista] = useState('Todas'); // Para la lista de partidos
  const [busquedaJugadorEquipo, setBusquedaJugadorEquipo] = useState('');
  const [rondasOptionsLista, setRondasOptionsLista] = useState(['Todas']);


  // Refs para animación
  const [filtrosRef, isFiltrosVisible] = useElementOnScreen({ threshold: 0.1 });
  const [avanceRef, isAvanceVisible] = useElementOnScreen({ threshold: 0.1 });
  const [cuadroRef, isCuadroVisible] = useElementOnScreen({ threshold: 0.05 });
  const [listaPartidosRef, isListaPartidosVisible] = useElementOnScreen({ threshold: 0.05 });
  const [accionesRef, isAccionesVisible] = useElementOnScreen({ threshold: 0.1 });

  // Cargar torneos disponibles filtrados por categoría y formato
  useEffect(() => {
    const filtrados = mockTorneos.filter(t => 
      (filtroCategoria === 'Todas' || t.categoria === filtroCategoria) &&
      (filtroFormato === 'Todos' || t.formato === filtroFormato)
    );
    setTorneosDisponibles([{ id: '', nombre: 'Selecciona un torneo...' }, ...filtrados]);
    setTorneoSeleccionadoId(''); // Resetear selección si cambian filtros
  }, [filtroCategoria, filtroFormato]);

  // Cargar cuadro y opciones de ronda para la lista cuando se selecciona un torneo
  useEffect(() => {
    if (torneoSeleccionadoId && mockPartidosPorTorneo[torneoSeleccionadoId]) {
      setCuadro(mockPartidosPorTorneo[torneoSeleccionadoId]);
      const torneoData = mockTorneos.find(t => t.id === torneoSeleccionadoId);
      if (torneoData) {
        const options = ['Todas'];
        for (let i = 1; i <= torneoData.totalRondas; i++) {
          options.push(`Ronda ${i}`);
        }
        setRondasOptionsLista(options);
      }
    } else {
      setCuadro(null);
      setRondasOptionsLista(['Todas']);
    }
    setFiltroRondaLista('Todas'); // Resetear filtro de ronda de la lista
    setBusquedaJugadorEquipo(''); // Resetear búsqueda
  }, [torneoSeleccionadoId]);

  const torneoSeleccionado = useMemo(() => {
    return mockTorneos.find(t => t.id === torneoSeleccionadoId);
  }, [torneoSeleccionadoId]);

  // Lógica para la lista de partidos programados
  const partidosProgramadosFiltrados = useMemo(() => {
    if (!cuadro) return [];
    let lista = [];
    Object.entries(cuadro).forEach(([numRonda, partidosRonda]) => {
      partidosRonda.forEach(p => lista.push({ ...p, numRonda: parseInt(numRonda) }))
    });

    if (filtroRondaLista !== 'Todas') {
      const rondaNum = parseInt(filtroRondaLista.split(' ')[1]);
      lista = lista.filter(p => p.numRonda === rondaNum);
    }
    if (busquedaJugadorEquipo) {
      const busquedaLower = busquedaJugadorEquipo.toLowerCase();
      lista = lista.filter(p => 
        (p.equipoLocal?.toLowerCase().includes(busquedaLower)) ||
        (p.equipoVisitante?.toLowerCase().includes(busquedaLower))
      );
    }
    return lista.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
  }, [cuadro, filtroRondaLista, busquedaJugadorEquipo]);


  const renderNombreEquipo = (nombre) => {
    return nombre || <span className={styles.equipoPorDefinir}>Por definir</span>;
  };

  const getStatusClassBracket = (status) => {
    if (status === 'Jugado') return styles.statusJugadoBracket; // Clase específica para bracket
    if (status === 'Pendiente') return styles.statusPendienteBracket;
    return styles.statusPorDefinirBracket; 
  };
  
  const getStatusClassLista = (status) => {
     if (status === 'Finalizado' || status === 'Jugado') return styles.statusFinalizadoLista;
     if (status === 'Pendiente') return styles.statusPendienteLista;
     if (status === 'Reprogramado') return styles.statusReprogramadoLista;
     if (status === 'No disputado' || status === 'Cancelado') return styles.statusNoDisputadoLista;
     return styles.statusPorDefinirLista;
  };


  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>
            {torneoSeleccionado ? `Cuadro del Torneo: ${torneoSeleccionado.nombre}` : 'Cuadros y Partidos de Torneos'}
          </h1>
          <p className={styles.pageDescription}>
            Consulta los emparejamientos, resultados y clasificaciones actualizadas.
          </p>

          {/* --- Filtros --- */}
          <div 
            ref={filtrosRef}
            className={`${styles.filtrosContainerCuadros} ${styles.sectionAnimate} ${isFiltrosVisible ? styles.visible : ''}`}
          >
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="filtroCategoriaTorneo">Categoría:</label>
              <select id="filtroCategoriaTorneo" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {mockCategorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="filtroFormatoTorneo">Formato:</label>
              <select id="filtroFormatoTorneo" value={filtroFormato} onChange={(e) => setFiltroFormato(e.target.value)}>
                {mockFormatos.map(form => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemCuadro}>
              <label htmlFor="torneoSelectCuadros">Torneo:</label>
              <select 
                id="torneoSelectCuadros" 
                value={torneoSeleccionadoId} 
                onChange={(e) => setTorneoSeleccionadoId(e.target.value)}
                disabled={torneosDisponibles.length <= 1 && filtroCategoria === 'Todas' && filtroFormato === 'Todos'}
              >
                {torneosDisponibles.map(torneo => (
                  <option key={torneo.id} value={torneo.id}>{torneo.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Avance del Torneo --- */}
          {torneoSeleccionado && (
            <div 
              ref={avanceRef}
              className={`${styles.avanceTorneoContainer} ${styles.sectionAnimate} ${isAvanceVisible ? styles.visible : ''}`}
            >
              <h3 className={styles.avanceTorneoTitulo}>Avance del Torneo</h3>
              <div className={styles.avanceTorneoGrid}>
                <div>🏅 Clasificados a Semis/Final: {torneoSeleccionado.clasificadosSemi?.join(', ') || 'N/A'}</div>
                <div>📊 Partidos Jugados: {torneoSeleccionado.partidosJugados}</div>
                <div>⚠️ Incomparecencias: {torneoSeleccionado.incomparecencias}</div>
                <div>🕒 Próximo Partido Clave: {torneoSeleccionado.proximoPartido}</div>
              </div>
            </div>
          )}

          {/* --- Cuadro Visual (Bracket) --- */}
          {torneoSeleccionado && cuadro ? (
            <div 
              ref={cuadroRef} 
              className={`${styles.cuadroTorneoContainer} ${styles.sectionAnimate} ${isCuadroVisible ? styles.visible : ''}`}
            >
              <h2 className={styles.subPageTitle}>Cuadro Visual: {torneoSeleccionado.nombre}</h2>
              <div className={styles.rondasContainer}>
                {Object.entries(cuadro).map(([numeroRonda, partidosRonda]) => (
                  <div key={`ronda-${numeroRonda}`} className={styles.rondaColumna}>
                    <h3 className={styles.rondaTitulo}>Ronda {numeroRonda}</h3>
                    <div className={styles.partidosEnRondaContainer}>
                      {partidosRonda.map(partido => (
                        <div key={partido.idPartido} className={`${styles.partidoCardTorneo} ${getStatusClassBracket(partido.status)}`}>
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
            <p className={styles.infoMessage}>Selecciona un torneo para visualizar el cuadro y los partidos.</p>
          )}

          {/* --- Lista de Partidos Programados --- */}
          {torneoSeleccionado && (
            <div 
              ref={listaPartidosRef}
              className={`${styles.listaPartidosContainer} ${styles.sectionAnimate} ${isListaPartidosVisible ? styles.visible : ''}`}
            >
              <h2 className={styles.subPageTitle}>Lista de Partidos</h2>
              <div className={styles.filtrosListaPartidos}>
                <div className={styles.filtroItemCuadro}>
                    <label htmlFor="filtroRondaLista">Ronda:</label>
                    <select id="filtroRondaLista" value={filtroRondaLista} onChange={(e) => setFiltroRondaLista(e.target.value)}>
                        {rondasOptionsLista.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div className={styles.filtroItemCuadro}>
                    <label htmlFor="busquedaPartido">Buscar Jugador/Equipo:</label>
                    <input type="text" id="busquedaPartido" value={busquedaJugadorEquipo} onChange={(e) => setBusquedaJugadorEquipo(e.target.value)} placeholder="Nombre..." />
                </div>
              </div>

              {partidosProgramadosFiltrados.length > 0 ? (
                <div className={styles.tablaResponsiveContainer}>
                    <table className={styles.tablaPartidos}>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Ronda</th>
                                <th>Equipo Local</th>
                                <th>Equipo Visitante</th>
                                <th>Estado</th>
                                <th>Resultado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partidosProgramadosFiltrados.map(p => (
                                <tr key={p.idPartido} className={getStatusClassLista(p.status)}>
                                    <td>{p.fecha ? new Date(p.fecha).toLocaleDateString() : '-'}</td>
                                    <td>Ronda {p.numRonda}</td>
                                    <td>{renderNombreEquipo(p.equipoLocal)}</td>
                                    <td>{renderNombreEquipo(p.equipoVisitante)}</td>
                                    <td>{p.status}</td>
                                    <td>{p.resultado || '-'}</td>
                                    <td>
                                      <button className={styles.botonDetallesPartido} onClick={() => alert('Ver detalles: ' + p.idPartido)}>
                                        Ver
                                      </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              ) : (
                <p className={styles.infoMessage}>No hay partidos que coincidan con los filtros para esta lista.</p>
              )}
            </div>
          )}
          
          {/* --- Acciones Interactivas --- */}
          {torneoSeleccionado && (
            <div 
              ref={accionesRef}
              className={`${styles.accionesTorneoContainer} ${styles.sectionAnimate} ${isAccionesVisible ? styles.visible : ''}`}
            >
              <h3 className={styles.accionesTitulo}>Acciones del Torneo</h3>
              <div className={styles.accionesBotonesGrid}>
                <button className={styles.accionButton} onClick={() => alert('Subir resultado (no implementado)')}>📤 Subir Resultado</button>
                <button className={styles.accionButton} onClick={() => alert('Reprogramar partido (no implementado)')}>📅 Reprogramar Partido</button>
                <button className={styles.accionButton} onClick={() => alert('Enviar mensaje (no implementado)')}>📣 Enviar Mensaje</button>
                <button className={styles.accionButton} onClick={() => alert('Reportar incidencia (no implementado)')}>🛡️ Reportar Incidencia</button>
              </div>
            </div>
          )}

          {/* --- CTA y Navegación Relacionada --- */}
          {torneoSeleccionado && (
            <div className={styles.navegacionRelacionada}>
              <Link to={`/torneos/resultados?torneo=${torneoSeleccionadoId}`} className={styles.navLink}>Ver Resultados Completos</Link>
              {/* <Link to={`/torneos/clasificacion?torneo=${torneoSeleccionadoId}`} className={styles.navLink}>Ver Clasificación</Link> */}
              <Link to="/reglamento" className={styles.navLink}>Reglamento del Torneo</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TorneosCuadros; 