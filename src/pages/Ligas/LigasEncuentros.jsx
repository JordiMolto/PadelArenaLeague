// src/pages/Ligas/LigasEncuentros.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css'; // Reutilizaremos y expandiremos

// --- Mock Data Ampliado ---
const mockLigas = [
  { id: 'liga-verano-dob-int', nombre: 'Liga Verano Dobles (Intermedio)', formato: 'Dobles', categoria: 'Intermedio', temporada: 'Verano 2024', jornadaActualNum: 3, totalJornadas: 5 },
  { id: 'liga-invierno-ind-av', nombre: 'Liga Invierno Individual (Avanzado)', formato: 'Individual', categoria: 'Avanzado', temporada: 'Invierno 2024', jornadaActualNum: 2, totalJornadas: 3 },
  { id: 'liga-primavera-eq-mix', nombre: 'Liga Primavera Equipos (Mixta)', formato: 'Equipos', categoria: 'Mixta', temporada: 'Primavera 2024', jornadaActualNum: 1, totalJornadas: 4 },
  { id: 'liga-otono-dob-fem', nombre: 'Liga Otoño Dobles (Femenina)', formato: 'Dobles', categoria: 'Femenina', temporada: 'Otoño 2023', jornadaActualNum: 5, totalJornadas: 5 }, // Liga finalizada
];

const mockEncuentrosPorLiga = {
  'liga-verano-dob-int': {
    1: [
      { idPartido: 'vd-int-j1-p1', equipoLocal: 'Carlos S. / Laura G.', equipoVisitante: 'Ana P. / Marcos R.', fechaHora: '2024-07-15 19:00', resultado: '6-2, 6-3', status: 'Finalizado', jornadaFechaStr: 'Semana 1 (15-21 Jul)' },
      { idPartido: 'vd-int-j1-p2', equipoLocal: 'Sofia L. / Julia R.', equipoVisitante: 'Pedro P. / Juan N.', fechaHora: '2024-07-16 20:00', resultado: '7-5, 6-4', status: 'Finalizado', jornadaFechaStr: 'Semana 1 (15-21 Jul)' },
    ],
    2: [
      { idPartido: 'vd-int-j2-p1', equipoLocal: 'Carlos S. / Laura G.', equipoVisitante: 'Sofia L. / Julia R.', fechaHora: '2024-07-22 18:00', resultado: '6-4, 3-6, 6-1', status: 'Finalizado', jornadaFechaStr: 'Semana 2 (22-28 Jul)' },
      { idPartido: 'vd-int-j2-p2', equipoLocal: 'Ana P. / Marcos R.', equipoVisitante: 'Pedro P. / Juan N.', fechaHora: '2024-07-23 21:00', resultado: '6-1, 6-0', status: 'Finalizado', jornadaFechaStr: 'Semana 2 (22-28 Jul)' },
    ],
    3: [ // Jornada Actual
      { idPartido: 'vd-int-j3-p1', equipoLocal: 'Carlos S. / Laura G.', equipoVisitante: 'Pedro P. / Juan N.', fechaHora: '2024-07-29 19:30', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Semana 3 (29 Jul - 4 Ago)' },
      { idPartido: 'vd-int-j3-p2', equipoLocal: 'Ana P. / Marcos R.', equipoVisitante: 'Sofia L. / Julia R.', fechaHora: '2024-07-30 20:00', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Semana 3 (29 Jul - 4 Ago)' },
    ],
    4: [
       { idPartido: 'vd-int-j4-p1', equipoLocal: 'Pedro P. / Juan N.', equipoVisitante: 'Carlos S. / Laura G.', fechaHora: '2024-08-05 19:00', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Semana 4 (5-11 Ago)' },
       { idPartido: 'vd-int-j4-p2', equipoLocal: 'Sofia L. / Julia R.', equipoVisitante: 'Ana P. / Marcos R.', fechaHora: '2024-08-06 20:00', resultado: 'No disputado', status: 'No Disputado', jornadaFechaStr: 'Semana 4 (5-11 Ago)' },
    ],
     5: [
       { idPartido: 'vd-int-j5-p1', equipoLocal: 'Carlos S. / Laura G.', equipoVisitante: 'Ana P. / Marcos R.', fechaHora: '2024-08-12 19:00', resultado: null, status: 'Reprogramado', fechaReprogramacion: '2024-08-15 10:00', jornadaFechaStr: 'Semana 5 (12-18 Ago)' },
       { idPartido: 'vd-int-j5-p2', equipoLocal: 'Pedro P. / Juan N.', equipoVisitante: 'Sofia L. / Julia R.', fechaHora: '2024-08-13 20:00', resultado: '6-3, 6-3', status: 'Finalizado', jornadaFechaStr: 'Semana 5 (12-18 Ago)' },
    ],
  },
  'liga-invierno-ind-av': {
     1: [
        { idPartido: 'vi-av-j1-p1', equipoLocal: 'Roberto Carlos', equipoVisitante: 'Luis Figo', fechaHora: '2024-01-10 20:00', resultado: '6-1, 6-2', status: 'Finalizado', jornadaFechaStr: 'Semana 1 (8-14 Ene)' },
     ],
     2: [ // Actual
        { idPartido: 'vi-av-j2-p1', equipoLocal: 'Luis Figo', equipoVisitante: 'Roberto Carlos', fechaHora: '2024-01-17 20:00', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Semana 2 (15-21 Ene)' },
     ],
      3: [
        { idPartido: 'vi-av-j3-p1', equipoLocal: 'Roberto Carlos', equipoVisitante: 'Luis Figo', fechaHora: '2024-01-24 20:00', resultado: null, status: 'Pendiente', jornadaFechaStr: 'Semana 3 (22-28 Ene)' },
     ],
  },
  // ... (Añadir encuentros para las otras ligas si es necesario)
};

// --- Fin Mock Data ---

const LigasEncuentros = () => {
  // Estados para filtros principales
  const [temporadas, setTemporadas] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [estadosEncuentro, setEstadosEncuentro] = useState([
    'Todos', 'Pendiente', 'Reprogramado', 'Finalizado', 'No Disputado'
  ]);

  const [filtroTemporada, setFiltroTemporada] = useState('Todas');
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Estados para selección de liga y jornada
  const [ligasFiltradas, setLigasFiltradas] = useState([]);
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState('Todas'); // 'Todas' o un número de jornada
  const [jornadasOptions, setJornadasOptions] = useState(['Todas']);
  
  // Para simular el detalle de un encuentro
  const [encuentroSeleccionado, setEncuentroSeleccionado] = useState(null);

  useEffect(() => {
    // Cargar opciones únicas para filtros globales
    setTemporadas(['Todas', ...new Set(mockLigas.map(l => l.temporada))]);
    setFormatos(['Todas', ...new Set(mockLigas.map(l => l.formato))]);
    setCategorias(['Todas', ...new Set(mockLigas.map(l => l.categoria))]);
  }, []);

  // Filtrar ligas disponibles según Temporada, Formato, Categoría
  useEffect(() => {
    const filtradas = mockLigas.filter(liga =>
      (filtroTemporada === 'Todas' || liga.temporada === filtroTemporada) &&
      (filtroFormato === 'Todas' || liga.formato === filtroFormato) &&
      (filtroCategoria === 'Todas' || liga.categoria === filtroCategoria)
    );
    setLigasFiltradas(filtradas);
    setLigaSeleccionadaId(''); // Resetear liga seleccionada si cambian los filtros principales
    setJornadaSeleccionada('Todas');
  }, [filtroTemporada, filtroFormato, filtroCategoria]);

  // Actualizar opciones de jornada cuando cambia la liga seleccionada
  useEffect(() => {
    if (ligaSeleccionadaId) {
      const ligaData = mockLigas.find(l => l.id === ligaSeleccionadaId);
      const encuentrosLiga = mockEncuentrosPorLiga[ligaSeleccionadaId];
      if (ligaData && encuentrosLiga) {
        const numJornadas = ligaData.totalJornadas || Object.keys(encuentrosLiga).length;
        const options = ['Todas'];
        for (let i = 1; i <= numJornadas; i++) {
          options.push(`${i}`);
        }
        setJornadasOptions(options);
      } else {
        setJornadasOptions(['Todas']);
      }
    } else {
      setJornadasOptions(['Todas']);
    }
    setJornadaSeleccionada('Todas'); // Resetear al cambiar liga
  }, [ligaSeleccionadaId]);

  // Agrupar y filtrar encuentros para mostrar
  const encuentrosAgrupadosPorJornada = useMemo(() => {
    if (!ligaSeleccionadaId || !mockEncuentrosPorLiga[ligaSeleccionadaId]) return {};

    const encuentrosDeLaLiga = mockEncuentrosPorLiga[ligaSeleccionadaId];
    const agrupados = {};
    const busquedaLower = busqueda.toLowerCase();

    Object.entries(encuentrosDeLaLiga).forEach(([numJornada, partidosDeJornada]) => {
      const jornadaActualNum = parseInt(numJornada, 10);
      // Filtrar por número de jornada si no es 'Todas'
      if (jornadaSeleccionada !== 'Todas' && jornadaActualNum !== parseInt(jornadaSeleccionada, 10)) {
        return;
      }

      const partidosFiltrados = partidosDeJornada.filter(partido => {
        const cumpleEstado = filtroEstado === 'Todos' || partido.status === filtroEstado;
        const cumpleBusqueda = busquedaLower === '' ||
                               partido.equipoLocal.toLowerCase().includes(busquedaLower) ||
                               partido.equipoVisitante.toLowerCase().includes(busquedaLower);
        return cumpleEstado && cumpleBusqueda;
      });

      if (partidosFiltrados.length > 0) {
        const jornadaHeader = partidosFiltrados[0].jornadaFechaStr || `Jornada ${numJornada}`;
        agrupados[jornadaHeader] = partidosFiltrados;
      }
    });
    return agrupados;
  }, [ligaSeleccionadaId, jornadaSeleccionada, filtroEstado, busqueda]);

  // Helper para obtener el icono y clase de estado
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Pendiente': return { icon: '🟡', className: styles.statusPendienteEncuentro };
      case 'Finalizado': return { icon: '✅', className: styles.statusFinalizadoEncuentro };
      case 'No Disputado': return { icon: '❌', className: styles.statusNoDisputadoEncuentro };
      case 'Reprogramado': return { icon: '🔁', className: styles.statusReprogramadoEncuentro };
      default: return { icon: '❔', className: styles.statusDesconocidoEncuentro };
    }
  };
  
  const handleEncuentroClick = (partido) => {
    setEncuentroSeleccionado(partido);
    // Aquí podríamos abrir un modal o expandir el item
    // Por ahora, un alert para simular
    alert(`Detalle del Partido (simulado):\n${partido.equipoLocal} vs ${partido.equipoVisitante}\nEstado: ${partido.status}\nResultado: ${partido.resultado || '-'}`)
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Encuentros de Ligas</h1>
          <p className={styles.pageDescription}>
            Filtra y visualiza los encuentros programados y sus resultados.
          </p>

          {/* --- Filtros Superiores --- */}
          <div className={`${styles.filtrosContainerEncuentros} ${styles.filtrosGridMultiples}`}> 
            <div className={styles.filtroItem}>
              <label htmlFor="filtroTemporadaEnc">Temporada:</label>
              <select id="filtroTemporadaEnc" value={filtroTemporada} onChange={(e) => setFiltroTemporada(e.target.value)}>
                {temporadas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroFormatoEnc">Formato:</label>
              <select id="filtroFormatoEnc" value={filtroFormato} onChange={(e) => setFiltroFormato(e.target.value)}>
                {formatos.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroCategoriaEnc">Categoría:</label>
              <select id="filtroCategoriaEnc" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            {/* Selector de Liga basado en filtros anteriores */}
            <div className={styles.filtroItemFullWidth}> {/* Podría necesitar ajuste de ancho */} 
              <label htmlFor="ligaSelectEncuentros">Liga Específica:</label>
              <select id="ligaSelectEncuentros" value={ligaSeleccionadaId} onChange={(e) => setLigaSeleccionadaId(e.target.value)} disabled={ligasFiltradas.length === 0}>
                <option value="">{ligasFiltradas.length === 0 ? '(No hay ligas con filtros)' : '-- Selecciona Liga --'}</option>
                {ligasFiltradas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
              </select>
            </div>

            <div className={styles.filtroItem}>
              <label htmlFor="jornadaSelectEnc">Jornada/Semana:</label>
              <select id="jornadaSelectEnc" value={jornadaSeleccionada} onChange={(e) => setJornadaSeleccionada(e.target.value)} disabled={!ligaSeleccionadaId}>
                {jornadasOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt === 'Todas' ? 'Todas las Jornadas' : `Jornada ${opt}`}
                  </option>
                ))}
              </select>
            </div>
             <div className={styles.filtroItem}>
              <label htmlFor="filtroEstadoEnc">Estado:</label>
              <select id="filtroEstadoEnc" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} disabled={!ligaSeleccionadaId}>
                {estadosEncuentro.map(est => <option key={est} value={est}>{est}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemFullWidth}>
              <label htmlFor="busquedaEnc">Buscar Jugador/Equipo:</label>
              <input
                type="text"
                id="busquedaEnc"
                placeholder="Nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                disabled={!ligaSeleccionadaId}
              />
            </div>
          </div>

          {/* --- Lista de Encuentros por Jornada --- */}
          {ligaSeleccionadaId ? (
            Object.keys(encuentrosAgrupadosPorJornada).length > 0 ? (
              Object.entries(encuentrosAgrupadosPorJornada).map(([jornadaHeader, partidos]) => (
                <div key={jornadaHeader} className={styles.jornadaGroupEncuentros}> 
                  <h2 className={styles.jornadaHeader}>{jornadaHeader}</h2>
                  {partidos.map(partido => {
                    const statusInfo = getStatusInfo(partido.status);
                    return (
                      <div key={partido.idPartido} className={`${styles.encuentroListItem} ${statusInfo.className}`} onClick={() => handleEncuentroClick(partido)}>
                        <span className={styles.encuentroEquipos}>
                          {partido.equipoLocal} <span className={styles.vsEncuentro}>vs</span> {partido.equipoVisitante}
                        </span>
                        <span className={styles.encuentroResultadoStatus}>
                          {statusInfo.icon} {partido.status}
                          {partido.status === 'Finalizado' && partido.resultado && ` (${partido.resultado})`}
                          {partido.status === 'Reprogramado' && partido.fechaReprogramacion && ` (para ${new Date(partido.fechaReprogramacion).toLocaleDateString('es-ES', {weekday:'short', day:'numeric', month:'short'})})`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className={styles.infoMessage}>No se encontraron encuentros para los filtros seleccionados en esta liga.</p>
            )
          ) : (
            <p className={styles.infoMessage}>Selecciona una liga para ver sus encuentros.</p>
          )}
          
          {/* --- Acciones (Simuladas) --- */}
          {ligaSeleccionadaId && (
            <div className={styles.accionesEncuentrosContainer}>
                <button className={styles.accionEncuentroBtn} onClick={() => alert('Subir resultado (no implementado)')}>⬆️ Subir Resultado</button>
                <button className={styles.accionEncuentroBtn} onClick={() => alert('Solicitar reprogramación (no implementado)')}>🔁 Reprogramar</button>
                <button className={styles.accionEncuentroBtn} onClick={() => alert('Reportar incidencia (no implementado)')}>🛠️ Reportar Incidencia</button>
                {/* <button className={styles.accionEncuentroBtn} onClick={() => alert('Enviar mensaje (no implementado)')}>✉️ Mensaje Rival</button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasEncuentros; 