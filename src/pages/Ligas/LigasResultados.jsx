import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para enlaces rápidos
import styles from './Ligas.module.css';

// --- Mock Data Ampliado ---
const mockLigas = [
  { id: 'liga-verano-int-a', nombre: 'Liga Verano (Intermedio - Grupo A)', categoria: 'Intermedio', formato: 'Dobles', temporada: 'Verano 2024', totalJornadas: 5 },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', categoria: 'Avanzado', formato: 'Dobles', temporada: 'Invierno 2024', totalJornadas: 3 },
  { id: 'liga-primavera-mix', nombre: 'Liga Primavera (Mixta)', categoria: 'Mixta', formato: 'Dobles', temporada: 'Primavera 2024', totalJornadas: 4 },
  { id: 'liga-otono-ind', nombre: 'Liga Otoño (Individual)', categoria: 'Masculina', formato: 'Individual', temporada: 'Otoño 2023', totalJornadas: 6 },
];

const mockEncuentrosPorLiga = {
  'liga-verano-int-a': {
    1: [
      { idPartido: 'p1', equipoLocal: 'Los Dinámicos', equipoVisitante: 'Padel Trotters', fechaHora: '2024-07-15 19:00', resultado: '6-2, 6-3', status: 'Finalizado', jornadaFechaStr: '10-16 Jul' },
      { idPartido: 'p2', equipoLocal: 'Viboras Team', equipoVisitante: 'Los Martillos', fechaHora: '2024-07-16 20:00', resultado: '7-5, 6-4', status: 'Finalizado', jornadaFechaStr: '10-16 Jul' },
    ],
    2: [
      { idPartido: 'p3', equipoLocal: 'Los Dinámicos', equipoVisitante: 'Viboras Team', fechaHora: '2024-07-22 18:00', resultado: '6-4, 3-6, 6-1', status: 'Finalizado', jornadaFechaStr: '17-23 Jul' },
      { idPartido: 'p4', equipoLocal: 'Padel Trotters', equipoVisitante: 'Los Martillos', fechaHora: '2024-07-23 21:00', resultado: '6-1, 6-0', status: 'Finalizado', jornadaFechaStr: '17-23 Jul' },
    ],
    3: [
      { idPartido: 'p5', equipoLocal: 'Los Dinámicos', equipoVisitante: 'Los Martillos', fechaHora: '2024-07-29 19:30', resultado: 'No disputado', status: 'No Disputado', jornadaFechaStr: '24-30 Jul' },
      { idPartido: 'p6', equipoLocal: 'Padel Trotters', equipoVisitante: 'Viboras Team', fechaHora: '2024-08-01 20:00', resultado: null, status: 'Reprogramado', jornadaFechaStr: '24-30 Jul' },
      { idPartido: 'p6-reprogramado', equipoLocal: 'Padel Trotters', equipoVisitante: 'Viboras Team', fechaHora: '2024-08-10 11:00', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Reprogramado' }, // Partido reprogramado como ejemplo
    ],
    4: [
      { idPartido: 'p7', equipoLocal: 'Los Martillos', equipoVisitante: 'Los Dinámicos', fechaHora: null, resultado: null, status: 'Pendiente', jornadaFechaStr: '31 Jul - 6 Ago' },
      { idPartido: 'p8', equipoLocal: 'Viboras Team', equipoVisitante: 'Padel Trotters', fechaHora: null, resultado: null, status: 'Pendiente', jornadaFechaStr: '31 Jul - 6 Ago' },
    ],
    // ... más jornadas
  },
  'liga-invierno-av': {
    1: [
      { idPartido: 'p11', equipoLocal: 'Titanes del Padel', equipoVisitante: 'Furia Roja', fechaHora: '2024-01-10 20:00', resultado: '6-1, 6-2', status: 'Finalizado', jornadaFechaStr: '8-14 Ene' },
    ],
    2: [
      { idPartido: 'p12', equipoLocal: 'Furia Roja', equipoVisitante: 'Titanes del Padel', fechaHora: '2024-01-17 20:00', resultado: 'Walkover (Local)', status: 'Incomparecencia', jornadaFechaStr: '15-21 Ene' },
    ],
    3: [
      { idPartido: 'p13', equipoLocal: 'Titanes del Padel', equipoVisitante: 'Furia Roja', fechaHora: null, resultado: null, status: 'Pendiente', jornadaFechaStr: '22-28 Ene' },
    ]
  }
  // ... más ligas
};
// --- Fin Mock Data ---

const LigasResultados = () => {
  // Estados de Filtros
  const [temporadas, setTemporadas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [jornadas, setJornadas] = useState([]); // Opciones de jornada para la liga seleccionada

  const [filtroTemporada, setFiltroTemporada] = useState('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [filtroJornada, setFiltroJornada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // Estado para simular login (para mostrar botón de subir resultado)
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Cambiar a false para probar

  useEffect(() => {
    // Extraer opciones únicas para filtros globales
    const todasTemporadas = ['Todas', ...new Set(mockLigas.map(l => l.temporada))];
    const todasCategorias = ['Todas', ...new Set(mockLigas.map(l => l.categoria))];
    const todosFormatos = ['Todos', ...new Set(mockLigas.map(l => l.formato))];
    setTemporadas(todasTemporadas);
    setCategorias(todasCategorias);
    setFormatos(todosFormatos);
  }, []);

  // Ligas que coinciden con los filtros globales
  const ligasDisponibles = useMemo(() => {
    return mockLigas.filter(liga =>
      (filtroTemporada === 'Todas' || liga.temporada === filtroTemporada) &&
      (filtroCategoria === 'Todas' || liga.categoria === filtroCategoria) &&
      (filtroFormato === 'Todos' || liga.formato === filtroFormato)
    );
  }, [filtroTemporada, filtroCategoria, filtroFormato]);

  // Actualizar opciones de jornada cuando cambia la liga seleccionada
  useEffect(() => {
    if (ligaSeleccionadaId) {
      const ligaData = mockLigas.find(l => l.id === ligaSeleccionadaId);
      if (ligaData && mockEncuentrosPorLiga[ligaSeleccionadaId]) {
        const numJornadas = ligaData.totalJornadas || Object.keys(mockEncuentrosPorLiga[ligaSeleccionadaId]).length;
        const options = ['Todas'];
        for (let i = 1; i <= numJornadas; i++) {
          options.push(`Jornada ${i}`);
        }
        setJornadas(options);
      } else {
        setJornadas(['Todas']);
      }
    } else {
      setJornadas(['Todas']);
    }
    setFiltroJornada('Todas'); // Resetear al cambiar liga
  }, [ligaSeleccionadaId]);

  // Filtrar y agrupar resultados
  const resultadosAgrupados = useMemo(() => {
    if (!ligaSeleccionadaId || !mockEncuentrosPorLiga[ligaSeleccionadaId]) return {};

    const encuentros = mockEncuentrosPorLiga[ligaSeleccionadaId];
    const agrupados = {};
    const jornadaNumFiltrar = filtroJornada === 'Todas' ? null : parseInt(filtroJornada.split(' ')[1], 10);
    const busquedaLower = busqueda.toLowerCase();

    Object.keys(encuentros).forEach(numJornada => {
      const jornadaActualNum = parseInt(numJornada, 10);
      if (jornadaNumFiltrar !== null && jornadaActualNum !== jornadaNumFiltrar) {
        return; // Saltar jornada si no coincide con el filtro
      }

      const partidosFiltrados = encuentros[numJornada].filter(partido =>
        busquedaLower === '' ||
        partido.equipoLocal.toLowerCase().includes(busquedaLower) ||
        partido.equipoVisitante.toLowerCase().includes(busquedaLower)
      );

      if (partidosFiltrados.length > 0) {
        // Usar jornadaFechaStr del primer partido como cabecera (o calcularla)
        const jornadaHeader = partidosFiltrados[0].jornadaFechaStr || `Jornada ${numJornada}`;
        agrupados[jornadaHeader] = partidosFiltrados;
      }
    });

    return agrupados;
  }, [ligaSeleccionadaId, filtroJornada, busqueda]);

  // Últimos 5 resultados finalizados
  const ultimosResultados = useMemo(() => {
    if (!ligaSeleccionadaId || !mockEncuentrosPorLiga[ligaSeleccionadaId]) return [];
    const todosLosPartidos = Object.values(mockEncuentrosPorLiga[ligaSeleccionadaId]).flat();
    return todosLosPartidos
      .filter(p => p.status === 'Finalizado')
      .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)) // Ordenar por fecha descendente
      .slice(0, 5);
  }, [ligaSeleccionadaId]);

  // Helper para icono de estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Finalizado': return { icon: '✅', className: styles.statusFinalizado };
      case 'No Disputado':
      case 'Incomparecencia': return { icon: '❌', className: styles.statusNoDisputado };
      case 'Reprogramado': return { icon: '📅', className: styles.statusReprogramado };
      case 'Pendiente': return { icon: '⏳', className: styles.statusPendienteResultado };
      default: return { icon: '❔', className: styles.statusDesconocido };
    }
  };

  const handleSubirResultadoClick = () => {
    alert('Funcionalidad para subir resultado aún no implementada.');
  };

  const ligaSeleccionadaNombre = mockLigas.find(l => l.id === ligaSeleccionadaId)?.nombre || '';

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Resultados de Ligas</h1>
          <p className={styles.pageDescription}>
            Consulta los resultados por jornada. Utiliza los filtros para acotar tu búsqueda.
          </p>

          {/* --- Filtros --- */}
          <div className={`${styles.filtrosContainerClasificacion} ${styles.filtrosResultadosLiga}`}> {/* Usar clase base y añadir específica */}
            <div className={styles.filtroItem}>
              <label htmlFor="filtroTemporadaRes">Temporada:</label>
              <select id="filtroTemporadaRes" value={filtroTemporada} onChange={(e) => setFiltroTemporada(e.target.value)}>
                {temporadas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroCategoriaRes">Categoría:</label>
              <select id="filtroCategoriaRes" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroFormatoRes">Formato:</label>
              <select id="filtroFormatoRes" value={filtroFormato} onChange={(e) => setFiltroFormato(e.target.value)}>
                {formatos.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {/* Selector de Liga basado en filtros anteriores */}
            <div className={styles.filtroItemFullWidth}>
              <label htmlFor="ligaSelectResultados">Liga:</label>
              <select id="ligaSelectResultados" value={ligaSeleccionadaId} onChange={(e) => setLigaSeleccionadaId(e.target.value)} disabled={ligasDisponibles.length === 0}>
                <option value="">{ligasDisponibles.length === 0 ? '(No hay ligas)' : '-- Selecciona Liga --'}</option>
                {ligasDisponibles.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroJornadaRes">Jornada:</label>
              <select id="filtroJornadaRes" value={filtroJornada} onChange={(e) => setFiltroJornada(e.target.value)} disabled={!ligaSeleccionadaId}>
                {jornadas.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="busquedaRes">Buscar:</label>
              <input type="text" id="busquedaRes" placeholder="Equipo/Jugador..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} disabled={!ligaSeleccionadaId} />
            </div>
          </div>

          {/* --- Últimos Resultados --- */}
          {ligaSeleccionadaId && ultimosResultados.length > 0 && (
            <div className={styles.ultimosResultadosContainer}>
              <h3 className={styles.smallSectionTitle}>Últimos Resultados Finalizados</h3>
              <div className={styles.ultimosResultadosScroll}>
                {ultimosResultados.map(partido => (
                  <div key={partido.idPartido} className={styles.ultimosResultadosCard}>
                    <span>{partido.equipoLocal} <strong>vs</strong> {partido.equipoVisitante}</span>
                    <span>{partido.resultado}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Lista Principal de Resultados por Jornada --- */}
          {ligaSeleccionadaId ? (
            Object.keys(resultadosAgrupados).length > 0 ? (
              Object.entries(resultadosAgrupados).map(([jornadaHeader, partidos]) => (
                <div key={jornadaHeader} className={styles.jornadaGroup}>
                  <h2 className={styles.jornadaHeader}>{jornadaHeader}</h2>
                  {partidos.map(partido => {
                    const statusInfo = getStatusIcon(partido.status);
                    return (
                      <div key={partido.idPartido} className={styles.resultadoItemCard}>
                        <div className={styles.resultadoEquipos}>
                          {partido.equipoLocal} <span className={styles.vsResultado}>vs</span> {partido.equipoVisitante}
                        </div>
                        <div className={styles.resultadoResultado}>
                          {partido.resultado || '-'}
                        </div>
                        <div className={`${styles.resultadoStatus} ${statusInfo.className}`}>
                          {statusInfo.icon} {partido.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className={styles.infoMessage}>No se encontraron resultados para los filtros seleccionados en "{ligaSeleccionadaNombre}".</p>
            )
          ) : (
            <p className={styles.infoMessage}>Selecciona una liga para ver los resultados.</p>
          )}

          {/* --- Sección Subir Resultado (Simulada) --- */}
          {isLoggedIn && ligaSeleccionadaId && (
            <div className={styles.subirResultadoSection}>
              <button onClick={handleSubirResultadoClick} className={`button ${styles.subirResultadoBtn}`}>⬆️ Subir Resultado Pendiente</button>
            </div>
          )}

          {/* --- Acciones Útiles --- */}
          {ligaSeleccionadaId && (
            <div className={styles.accionesUtiles}>
              <Link to="/ligas/clasificacion" className={styles.accionUtilLink}>📈 Ver Clasificación</Link>
              <Link to="/ligas/encuentros" className={styles.accionUtilLink}>📅 Ver Encuentros</Link>
              <a href="#" onClick={(e) => e.preventDefault()} className={styles.accionUtilLink}>📖 Reglas Resultados</a>
              <a href="#" onClick={(e) => e.preventDefault()} className={styles.accionUtilLink}>🛠️ Reportar Incidencia</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasResultados; 