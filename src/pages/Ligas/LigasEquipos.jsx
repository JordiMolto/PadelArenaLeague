// src/pages/Ligas/LigasEquipos.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css'; // Reutilizaremos y expandiremos
// Asumimos que mockLigas es similar al de LigasClasificacion, lo podríamos importar desde un archivo compartido.
// Por ahora, lo duplicamos para simplificar.
const mockLigas = [
  { id: 'liga-verano-int', nombre: 'Liga Verano (Intermedio)', tipo: 'Temporada Regular', categoria: 'Intermedio', zona: 'Club Central', temporada: 'Verano 2024' },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', tipo: 'Temporada Regular', categoria: 'Avanzado', zona: 'Polideportivo Norte', temporada: 'Invierno 2024' },
  { id: 'liga-express-mixta', nombre: 'Liga Express Mixta', tipo: 'Express', categoria: 'Mixta', zona: 'Club Central', temporada: 'Primavera 2024' },
  { id: 'liga-femenina-prim', nombre: 'Liga Femenina Primavera', tipo: 'Femenina', categoria: 'Todos', zona: 'Club Sur', temporada: 'Primavera 2024'},
];

const mockEquiposPorLiga = {
  'liga-verano-int': [
    {
      idEquipo: 'equ1', nombreEquipo: 'Los Dinámicos', genero: 'Mixto', idLiga: 'liga-verano-int',
      imagenEquipoUrl: 'fas fa-users', // Icono Font Awesome
      componentes: [
        { idJugador: 'jug1', nombreJugador: 'Carlos Soler', numLicencia: 'L12345', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'carlos@example.com' },
        { idJugador: 'jug2', nombreJugador: 'Laura Gil', numLicencia: 'L67890', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugadora', email: 'laura@example.com' },
      ],
      estadisticas: { pj: 5, pg: 4, pp: 1, puntos: 12, sf: 8, sc: 3, jf: 50, jc: 35, posicion: 1 }
    },
    {
      idEquipo: 'equ2', nombreEquipo: 'Padel Trotters', genero: 'Mixto', idLiga: 'liga-verano-int',
      imagenEquipoUrl: 'fas fa-running',
      componentes: [
        { idJugador: 'jug3', nombreJugador: 'Ana Pérez', numLicencia: 'L11223', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitana', email: 'ana@example.com' },
        { idJugador: 'jug4', nombreJugador: 'Marcos Riu', numLicencia: 'L44556', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'marcos@example.com' },
      ],
      estadisticas: { pj: 5, pg: 3, pp: 2, puntos: 10, sf: 7, sc: 4, jf: 48, jc: 40, posicion: 2 }
    },
     {
      idEquipo: 'equ3', nombreEquipo: 'Viboras Team', genero: 'Femenino', idLiga: 'liga-verano-int',
      imagenEquipoUrl: 'fas fa-bolt',
      componentes: [
        { idJugador: 'jug5', nombreJugador: 'Sofia Loren', numLicencia: 'L77889', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitana', email: 'sofia@example.com' },
        { idJugador: 'jug6', nombreJugador: 'Julia Roberts', numLicencia: 'L99001', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugadora', email: 'julia@example.com' },
      ],
      estadisticas: { pj: 5, pg: 3, pp: 2, puntos: 10, sf: 6, sc: 5, jf: 45, jc: 42, posicion: 3 }
    }
  ],
  'liga-invierno-av': [
    {
      idEquipo: 'equ5', nombreEquipo: 'Titanes del Padel', genero: 'Masculino', idLiga: 'liga-invierno-av',
      imagenEquipoUrl: 'fas fa-shield-alt',
      componentes: [
        { idJugador: 'jug7', nombreJugador: 'Roberto Carlos', numLicencia: 'L00112', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Capitán', email: 'roberto@example.com' },
        { idJugador: 'jug8', nombreJugador: 'Luis Figo', numLicencia: 'L00334', fotoPerfilUrl: 'fas fa-user-circle', rol: 'Jugador', email: 'luis@example.com' },
      ],
      estadisticas: { pj: 5, pg: 5, pp: 0, puntos: 15, sf: 10, sc: 1, jf: 60, jc: 20, posicion: 1 }
    }
  ]
};

// --- Fin Mock Data ---

const LigasEquipos = () => {
  const [ligas, setLigas] = useState([]);
  const [generos, setGeneros] = useState(['Todos', 'Mixto', 'Masculino', 'Femenino']);

  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [busquedaNombreEquipo, setBusquedaNombreEquipo] = useState('');
  
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null); // Para la vista de detalle

  useEffect(() => {
    setLigas([{ id: '', nombre: '-- Todas las Ligas --' }, ...mockLigas]);
  }, []);

  const equiposMostrados = useMemo(() => {
    let baseEquipos = [];
    if (!ligaSeleccionadaId) {
        baseEquipos = Object.values(mockEquiposPorLiga).flat();
    } else if (mockEquiposPorLiga[ligaSeleccionadaId]) {
        baseEquipos = mockEquiposPorLiga[ligaSeleccionadaId];
    }

    let equiposFiltradosPorGenero = baseEquipos;
    if (filtroGenero !== 'Todos') {
      equiposFiltradosPorGenero = baseEquipos.filter(eq => eq.genero === filtroGenero);
    }

    let equiposFiltradosPorNombre = equiposFiltradosPorGenero;
    if (busquedaNombreEquipo) {
      equiposFiltradosPorNombre = equiposFiltradosPorGenero.filter(eq => 
        eq.nombreEquipo.toLowerCase().includes(busquedaNombreEquipo.toLowerCase())
      );
    }

    return equiposFiltradosPorNombre.sort((a, b) => 
        a.nombreEquipo.localeCompare(b.nombreEquipo)
    );

  }, [ligaSeleccionadaId, filtroGenero, busquedaNombreEquipo]);
  
  const handleSeleccionarEquipo = (equipo) => {
    console.log("Seleccionando equipo: ", equipo);
    setEquipoSeleccionado(equipo);
  };

  const handleVolverAListado = () => {
    setEquipoSeleccionado(null);
  };


  // Vista de Detalle de Equipo
  if (equipoSeleccionado) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <button onClick={handleVolverAListado} className={`${styles.backButton} ${styles.mb3}`}>
              &larr; Volver al Listado de Equipos
            </button>
            <h1 className={styles.pageTitle}>Detalle del Equipo: {equipoSeleccionado.nombreEquipo}</h1>
            
            <div className={styles.detalleEquipoHeader}>
                <i className={`${equipoSeleccionado.imagenEquipoUrl} ${styles.detalleEquipoIcono}`}></i>
            </div>

            <h2 className={styles.subPageTitle}>Estadísticas en la Liga</h2>
            <table className={styles.tablaEstadisticasEquipo}>
              <tbody>
                <tr><td>Puntos:</td><td>{equipoSeleccionado.estadisticas.puntos}</td></tr>
                <tr><td>Posición:</td><td>{equipoSeleccionado.estadisticas.posicion || 'N/A'}</td></tr>
                <tr><td>Partidos Jugados:</td><td>{equipoSeleccionado.estadisticas.pj}</td></tr>
                <tr><td>Ganados:</td><td>{equipoSeleccionado.estadisticas.pg}</td></tr>
                <tr><td>Perdidos:</td><td>{equipoSeleccionado.estadisticas.pp}</td></tr>
                <tr><td>Sets (Favor/Contra):</td><td>{equipoSeleccionado.estadisticas.sf} / {equipoSeleccionado.estadisticas.sc}</td></tr>
                <tr><td>Juegos (Favor/Contra):</td><td>{equipoSeleccionado.estadisticas.jf} / {equipoSeleccionado.estadisticas.jc}</td></tr>
              </tbody>
            </table>

            <h2 className={styles.subPageTitle}>Componentes del Equipo</h2>
            <div className={styles.componentesGrid}>
              {equipoSeleccionado.componentes.map(jugador => (
                <div key={jugador.idJugador} className={styles.tarjetaJugador}>
                  <i className={`${jugador.fotoPerfilUrl} ${styles.jugadorIcono}`}></i>
                  <h3>{jugador.nombreJugador}</h3>
                  <p>Licencia: {jugador.numLicencia}</p>
                  {jugador.rol && <p>Rol: {jugador.rol}</p>}
                  {jugador.email && <p><a href={`mailto:${jugador.email}`} className={styles.emailLinkJugador}>{jugador.email}</a></p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de Listado de Equipos
  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Equipos de las Ligas</h1>
          <p className={styles.pageDescription}>
            {ligaSeleccionadaId ? `Mostrando equipos para: ${ligas.find(l => l.id === ligaSeleccionadaId)?.nombre}` : 'Mostrando todos los equipos. Filtra por liga, género o nombre.'}
          </p>

          <div className={styles.filtrosContainerEquipos}>
            <div className={styles.filtroItem}>
              <label htmlFor="ligaSelectEquipos">Filtrar por Liga:</label>
              <select id="ligaSelectEquipos" value={ligaSeleccionadaId} onChange={(e) => setLigaSeleccionadaId(e.target.value)}>
                {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroGenero">Filtrar por Género:</label>
              <select id="filtroGenero" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)} >
                {generos.map(gen => <option key={gen} value={gen}>{gen}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="busquedaNombreEquipo">Buscar Equipo:</label>
              <input
                type="text"
                id="busquedaNombreEquipo"
                placeholder="Nombre del equipo..."
                value={busquedaNombreEquipo}
                onChange={(e) => setBusquedaNombreEquipo(e.target.value)}
              />
            </div>
          </div>

          {equiposMostrados.length > 0 ? (
              <div className={styles.equiposGrid}>
                {equiposMostrados.map(equipo => (
                  <div key={`${equipo.idLiga}-${equipo.idEquipo}`} className={styles.tarjetaEquipo} onClick={() => handleSeleccionarEquipo(equipo)}>
                    <i className={`${equipo.imagenEquipoUrl} ${styles.equipoIcono}`}></i>
                    <h3>{equipo.nombreEquipo}</h3>
                    <p>Género: {equipo.genero}</p>
                    <p>{equipo.componentes.length} Jugadores</p>
                    {!ligaSeleccionadaId && <p className={styles.ligaEnTarjeta}>{ligas.find(l => l.id === equipo.idLiga)?.nombre}</p>}
                  </div>
                ))}
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