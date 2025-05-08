// src/pages/Ligas/LigasEquipos.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Importar si usamos Links
import styles from './Ligas.module.css';

// --- Mock Data Ampliado ---
// Ligas (con formato añadido)
const mockLigas = [
  { id: 'liga-verano-int-a', nombre: 'Liga Verano (Intermedio - Grupo A)', categoria: 'Intermedio', formato: 'Dobles', temporada: 'Verano 2024', grupo: 'A' },
  { id: 'liga-verano-int-b', nombre: 'Liga Verano (Intermedio - Grupo B)', categoria: 'Intermedio', formato: 'Dobles', temporada: 'Verano 2024', grupo: 'B' },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', categoria: 'Avanzado', formato: 'Dobles', temporada: 'Invierno 2024', grupo: 'Único' },
  { id: 'liga-primavera-mix', nombre: 'Liga Primavera (Mixta)', categoria: 'Mixta', formato: 'Dobles', temporada: 'Primavera 2024', grupo: 'Único' },
  { id: 'liga-primavera-fem', nombre: 'Liga Primavera (Femenina)', categoria: 'Femenina', formato: 'Dobles', temporada: 'Primavera 2024', grupo: 'Único' },
  { id: 'liga-otono-ind', nombre: 'Liga Otoño (Individual)', categoria: 'Masculina', formato: 'Individual', temporada: 'Otoño 2023', grupo: 'Único' },
];

// Equipos (con PE - Empates añadidos)
const mockEquiposPorLiga = {
  'liga-verano-int-a': [
    {
      idEquipo: 'equ1', nombreEquipo: 'Los Dinámicos', genero: 'Mixto', idLiga: 'liga-verano-int-a',
      imagenEquipoUrl: 'fas fa-users',
      componentes: [
        { idJugador: 'jug1', nombreJugador: 'Carlos Soler', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'carlos@example.com' },
        { idJugador: 'jug2', nombreJugador: 'Laura Gil', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugadora', email: 'laura@example.com' },
      ],
      estadisticas: { pj: 6, pg: 5, pp: 1, pe: 0, sf: 10, sc: 3, puntos: 15, posicion: 1 }
    },
    {
      idEquipo: 'equ2', nombreEquipo: 'Padel Trotters', genero: 'Mixto', idLiga: 'liga-verano-int-a',
      imagenEquipoUrl: 'fas fa-running',
      componentes: [
        { idJugador: 'jug3', nombreJugador: 'Ana Pérez', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitana', email: 'ana@example.com' },
        { idJugador: 'jug4', nombreJugador: 'Marcos Riu', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'marcos@example.com' },
      ],
      estadisticas: { pj: 6, pg: 3, pp: 2, pe: 1, sf: 8, sc: 6, puntos: 10, posicion: 2 }
    },
    {
      idEquipo: 'equ3', nombreEquipo: 'Viboras Team', genero: 'Femenino', idLiga: 'liga-verano-int-a',
      imagenEquipoUrl: 'fas fa-bolt',
      componentes: [
        { idJugador: 'jug5', nombreJugador: 'Sofia Loren', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitana', email: 'sofia@example.com' },
        { idJugador: 'jug6', nombreJugador: 'Julia Roberts', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugadora', email: 'julia@example.com' },
      ],
      estadisticas: { pj: 6, pg: 2, pp: 3, pe: 1, sf: 7, sc: 8, puntos: 7, posicion: 3 }
    },
     {
      idEquipo: 'equ4', nombreEquipo: 'Los Martillos', genero: 'Masculino', idLiga: 'liga-verano-int-a',
      imagenEquipoUrl: 'fas fa-hammer',
      componentes: [
        { idJugador: 'jug7', nombreJugador: 'Pedro Pascal', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'pedro@example.com' },
        { idJugador: 'jug8', nombreJugador: 'Juan Nieves', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'juan@example.com' },
      ],
      estadisticas: { pj: 6, pg: 1, pp: 5, pe: 0, sf: 3, sc: 11, puntos: 3, posicion: 4 }
    }
  ],
  'liga-invierno-av': [
     {
      idEquipo: 'equ5', nombreEquipo: 'Titanes del Padel', genero: 'Masculino', idLiga: 'liga-invierno-av',
      imagenEquipoUrl: 'fas fa-shield-alt',
      componentes: [
        { idJugador: 'jug9', nombreJugador: 'Roberto Carlos', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'roberto@example.com' },
        { idJugador: 'jug10', nombreJugador: 'Luis Figo', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'luis@example.com' },
      ],
      estadisticas: { pj: 4, pg: 4, pp: 0, pe: 0, sf: 8, sc: 1, puntos: 12, posicion: 1 }
    },
     {
      idEquipo: 'equ6', nombreEquipo: 'Furia Roja', genero: 'Masculino', idLiga: 'liga-invierno-av',
      imagenEquipoUrl: 'fas fa-fire',
      componentes: [
        { idJugador: 'jug11', nombreJugador: 'Sergio Ramos', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'sergio@example.com' },
        { idJugador: 'jug12', nombreJugador: 'Iker Casillas', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'iker@example.com' },
      ],
      estadisticas: { pj: 4, pg: 2, pp: 2, pe: 0, sf: 5, sc: 4, puntos: 6, posicion: 2 }
    }
  ],
  // ... añadir más equipos a otras ligas si es necesario
};

// Necesitamos los encuentros para la sección "Últimos Partidos" del detalle
const mockEncuentrosPorLiga = {
  'liga-verano-int-a': {
    1: [
      { idPartido: 'p1', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: '2024-07-15 19:00', resultado: '6-2, 6-3', status: 'Finalizado' },
      { idPartido: 'p2', idEquipoLocal: 'equ3', nombreEquipoLocal: 'Viboras Team', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-16 20:00', resultado: '7-5, 6-4', status: 'Finalizado' },
    ],
    2: [
      { idPartido: 'p3', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: '2024-07-22 18:00', resultado: '6-4, 3-6, 6-1', status: 'Finalizado' },
      { idPartido: 'p4', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-23 21:00', resultado: '6-1, 6-0', status: 'Finalizado' },
    ],
    3: [
        { idPartido: 'p5', idEquipoLocal: 'equ1', nombreEquipoLocal: 'Los Dinámicos', idEquipoVisitante: 'equ4', nombreEquipoVisitante: 'Los Martillos', fechaHora: '2024-07-29 19:30', resultado: 'No disputado', status: 'No Disputado' },
        { idPartido: 'p6', idEquipoLocal: 'equ2', nombreEquipoLocal: 'Padel Trotters', idEquipoVisitante: 'equ3', nombreEquipoVisitante: 'Viboras Team', fechaHora: '2024-08-10 11:00', resultado: '7-6, 7-5', status: 'Finalizado'}, // Suponiendo que el reprogramado se jugó
    ],
     4: [
      { idPartido: 'p7', idEquipoLocal: 'equ4', nombreEquipoLocal: 'Los Martillos', idEquipoVisitante: 'equ1', nombreEquipoVisitante: 'Los Dinámicos', fechaHora: null, resultado: null, status: 'Pendiente' },
      { idPartido: 'p8', idEquipoLocal: 'equ3', nombreEquipoLocal: 'Viboras Team', idEquipoVisitante: 'equ2', nombreEquipoVisitante: 'Padel Trotters', fechaHora: null, resultado: null, status: 'Pendiente' },
    ],
    //... más jornadas
  },
   'liga-invierno-av': {
     1: [
        { idPartido: 'p11', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: '2024-01-10 20:00', resultado: '6-1, 6-2', status: 'Finalizado' },
     ],
      2: [
        { idPartido: 'p12', idEquipoLocal: 'equ6', nombreEquipoLocal: 'Furia Roja', idEquipoVisitante: 'equ5', nombreEquipoVisitante: 'Titanes del Padel', fechaHora: '2024-01-17 20:00', resultado: 'Walkover (Local)', status: 'Incomparecencia' },
     ],
       3: [
         { idPartido: 'p13', idEquipoLocal: 'equ5', nombreEquipoLocal: 'Titanes del Padel', idEquipoVisitante: 'equ6', nombreEquipoVisitante: 'Furia Roja', fechaHora: null, resultado: null, status: 'Pendiente' },
      ]
   }
  // ... más ligas
};
// --- Fin Mock Data ---

const LigasEquipos = () => {
  // Estados filtros
  const [temporadas, setTemporadas] = useState([]);
  const [formatos, setFormatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroTemporada, setFiltroTemporada] = useState('Todas');
  const [filtroFormato, setFiltroFormato] = useState('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busquedaNombre, setBusquedaNombre] = useState('');

  // Estado vista detalle
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  useEffect(() => {
    // Cargar opciones de filtros globales
    setTemporadas(['Todas', ...new Set(mockLigas.map(l => l.temporada))]);
    setFormatos(['Todas', ...new Set(mockLigas.map(l => l.formato))]);
    setCategorias(['Todas', ...new Set(mockLigas.map(l => l.categoria))]);
  }, []);

  const equiposMostrados = useMemo(() => {
    const busquedaLower = busquedaNombre.toLowerCase();
    const todosLosEquipos = Object.values(mockEquiposPorLiga).flat();

    return todosLosEquipos.filter(equipo => {
      const ligaEquipo = mockLigas.find(l => l.id === equipo.idLiga);
      if (!ligaEquipo) return false; // Si no encontramos la liga, lo descartamos

      const cumpleTemporada = filtroTemporada === 'Todas' || ligaEquipo.temporada === filtroTemporada;
      const cumpleFormato = filtroFormato === 'Todas' || ligaEquipo.formato === filtroFormato;
      const cumpleCategoria = filtroCategoria === 'Todas' || ligaEquipo.categoria === filtroCategoria;
      const cumpleBusqueda = busquedaLower === '' ||
                             equipo.nombreEquipo.toLowerCase().includes(busquedaLower) ||
                             equipo.componentes.some(j => j.nombreJugador.toLowerCase().includes(busquedaLower));

      return cumpleTemporada && cumpleFormato && cumpleCategoria && cumpleBusqueda;
    }).sort((a, b) => a.nombreEquipo.localeCompare(b.nombreEquipo));

  }, [filtroTemporada, filtroFormato, filtroCategoria, busquedaNombre]);

  // Función para obtener últimos partidos de un equipo
  const getUltimosPartidosEquipo = (equipoId, idLiga) => {
      const encuentrosLiga = mockEncuentrosPorLiga[idLiga];
      if (!encuentrosLiga) return [];

      const partidosEquipo = [];
      Object.values(encuentrosLiga).flat().forEach(partido => {
          if (partido.idEquipoLocal === equipoId || partido.idEquipoVisitante === equipoId) {
              partidosEquipo.push(partido);
          }
      });
      // Ordenar por fecha y tomar los últimos 5
      return partidosEquipo
          .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
          .slice(0, 5);
  };

  const handleSeleccionarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
  };

  const handleVolverAListado = () => {
    setEquipoSeleccionado(null);
  };

  // --- Renderizado --- //

  // Vista de Detalle de Equipo
  if (equipoSeleccionado) {
    const ultimosPartidos = getUltimosPartidosEquipo(equipoSeleccionado.idEquipo, equipoSeleccionado.idLiga);
    const ligaInfo = mockLigas.find(l => l.id === equipoSeleccionado.idLiga);

    return (
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <button onClick={handleVolverAListado} className={`${styles.backButton} ${styles.mb3}`}>
              &larr; Volver al Listado
            </button>
            <h1 className={styles.pageTitle}>{equipoSeleccionado.nombreEquipo}</h1>
            <p className={styles.detalleLigaInfo}>{ligaInfo?.nombre}</p>

            <div className={styles.detalleEquipoGrid}> {/* Grid para info y stats */} 
              {/* Columna Info General */}
              <div className={styles.detalleColumna}>
                 <div className={styles.detalleEquipoHeader}>
                   <i className={`${equipoSeleccionado.imagenEquipoUrl} ${styles.detalleEquipoIcono}`}></i>
                 </div>
                 <h2 className={styles.subPageTitle}>Componentes</h2>
                 <div className={styles.componentesDetalleList}>
                   {equipoSeleccionado.componentes.map(jugador => (
                     <div key={jugador.idJugador} className={styles.jugadorDetalleItem}>
                       <i className={`${jugador.fotoPerfilUrl} ${styles.jugadorIconoSmall}`}></i>
                       <div className={styles.jugadorInfoDetalle}>
                         <strong>{jugador.nombreJugador}</strong>
                         {jugador.rol && <span>({jugador.rol})</span>}
                         {jugador.email && <a href={`mailto:${jugador.email}`} className={styles.emailLinkJugador}>{jugador.email}</a>}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Columna Estadísticas y Partidos */}
              <div className={styles.detalleColumna}>
                <h2 className={styles.subPageTitle}>Estadísticas</h2>
                <table className={styles.tablaEstadisticasEquipo}>
                  <tbody>
                    <tr><td>Posición:</td><td>{equipoSeleccionado.estadisticas.posicion || 'N/A'}</td></tr>
                    <tr><td>Puntos:</td><td>{equipoSeleccionado.estadisticas.puntos}</td></tr>
                    <tr><td>PJ:</td><td>{equipoSeleccionado.estadisticas.pj}</td></tr>
                    <tr><td>PG:</td><td>{equipoSeleccionado.estadisticas.pg}</td></tr>
                    <tr><td>PE:</td><td>{equipoSeleccionado.estadisticas.pe}</td></tr>
                    <tr><td>PP:</td><td>{equipoSeleccionado.estadisticas.pp}</td></tr>
                    <tr><td>Sets F/C:</td><td>{equipoSeleccionado.estadisticas.sf} / {equipoSeleccionado.estadisticas.sc}</td></tr>
                  </tbody>
                </table>

                <h2 className={styles.subPageTitle}>Últimos Partidos</h2>
                 {ultimosPartidos.length > 0 ? (
                    <div className={styles.ultimosPartidosDetalleList}>
                      {ultimosPartidos.map(partido => {
                        const esLocal = partido.idEquipoLocal === equipoSeleccionado.idEquipo;
                        const rival = esLocal ? partido.nombreEquipoVisitante : partido.nombreEquipoLocal;
                        const resultadoFinal = partido.resultado || partido.status;
                        // Determinar si el equipo ganó, perdió o empató (si aplica)
                        let claseResultado = styles.partidoResultadoNormal;
                        // Aquí iría lógica más compleja para determinar victoria/derrota basada en resultado y si era local/visitante

                        return (
                           <div key={partido.idPartido} className={`${styles.partidoDetalleItem} ${claseResultado}`}>
                              <span>vs {rival}</span>
                              <span>{resultadoFinal}</span>
                              <span className={styles.partidoFechaDetalle}>{new Date(partido.fechaHora).toLocaleDateString()}</span>
                           </div>
                        );
                      })}
                    </div>
                 ) : (
                     <p className={styles.infoMessage}>No hay partidos recientes registrados para este equipo.</p>
                 )}
              </div>
            </div>
             {/* Aquí iría la sección de Interacción si estuviera implementada */}
          </div>
        </div>
      </div>
    );
  }

  // Vista de Listado de Equipos (Tarjeta)
  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Equipos de las Ligas</h1>
          <p className={styles.pageDescription}>
            Explora los equipos participantes. Usa los filtros para encontrar lo que buscas.
          </p>

          {/* --- Filtros --- */}
          <div className={styles.filtrosContainerEquipos}>
             <div className={styles.filtroItem}>
              <label htmlFor="filtroTemporadaEq">Temporada:</label>
              <select id="filtroTemporadaEq" value={filtroTemporada} onChange={(e) => setFiltroTemporada(e.target.value)}>
                {temporadas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
             <div className={styles.filtroItem}>
              <label htmlFor="filtroFormatoEq">Formato:</label>
              <select id="filtroFormatoEq" value={filtroFormato} onChange={(e) => setFiltroFormato(e.target.value)}>
                {formatos.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroCategoriaEq">Categoría:</label>
              <select id="filtroCategoriaEq" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={styles.filtroItemFullWidth}> {/* Ancho completo para búsqueda */}
              <label htmlFor="busquedaNombreEquipo">Buscar Equipo o Jugador:</label>
              <input
                type="text"
                id="busquedaNombreEquipo"
                placeholder="Nombre..."
                value={busquedaNombre}
                onChange={(e) => setBusquedaNombre(e.target.value)}
              />
            </div>
          </div>

          {/* --- Grid de Equipos --- */}
          {equiposMostrados.length > 0 ? (
              <div className={styles.equiposGrid}>
                {equiposMostrados.map(equipo => {
                   const ligaEquipo = mockLigas.find(l => l.id === equipo.idLiga);
                   return (
                      <div key={equipo.idEquipo} className={styles.tarjetaEquipo} onClick={() => handleSeleccionarEquipo(equipo)}>
                        <i className={`${equipo.imagenEquipoUrl} ${styles.equipoIcono}`}></i>
                        <h3>{equipo.nombreEquipo}</h3>
                        <div className={styles.jugadoresEnTarjeta}>
                           {equipo.componentes.slice(0, 2).map((j, index) => (
                               <span key={j.idJugador}>{j.nombreJugador}{index === 0 && equipo.componentes.length > 1 ? ' / ' : ''}</span>
                           ))}
                           {equipo.componentes.length > 2 && ' ...'}
                        </div>
                        <div className={styles.statsEnTarjeta}>
                          <span>Pos: {equipo.estadisticas.posicion || '-'}</span>
                          <span>Pts: {equipo.estadisticas.puntos}</span>
                          <span>{equipo.estadisticas.pg}V-{equipo.estadisticas.pe}E-{equipo.estadisticas.pp}D</span>
                        </div>
                        <p className={styles.ligaEnTarjeta}>{ligaEquipo?.nombre}</p>
                      </div>
                   );
                })}
              </div>
            ) : (
              <p className={styles.infoMessage}>No se encontraron equipos que coincidan con los filtros aplicados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasEquipos;