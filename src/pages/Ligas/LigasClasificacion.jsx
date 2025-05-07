import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css'; // Reutilizaremos y expandiremos Ligas.module.css

// --- Mock Data ---
const mockLigas = [
  { id: 'liga-verano-int', nombre: 'Liga Verano (Intermedio)', tipo: 'Temporada Regular', categoria: 'Intermedio', zona: 'Club Central', temporada: 'Verano 2024' },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', tipo: 'Temporada Regular', categoria: 'Avanzado', zona: 'Polideportivo Norte', temporada: 'Invierno 2024' },
  { id: 'liga-express-mixta', nombre: 'Liga Express Mixta', tipo: 'Express', categoria: 'Mixta', zona: 'Club Central', temporada: 'Primavera 2024' },
  { id: 'liga-femenina-prim', nombre: 'Liga Femenina Primavera', tipo: 'Femenina', categoria: 'Todos', zona: 'Club Sur', temporada: 'Primavera 2024'},
];

const mockClasificaciones = {
  'liga-verano-int': [
    { idEquipo: 'equ1', nombreEquipo: 'Los Dinámicos', jugador1: 'Carlos Soler', jugador2: 'Laura Gil', puntos: 12, pj: 5, pg: 4, pp: 1, sf: 8, sc: 3, jf: 50, jc: 35 },
    { idEquipo: 'equ2', nombreEquipo: 'Padel Trotters', jugador1: 'Ana Pérez', jugador2: 'Marcos Riu', puntos: 10, pj: 5, pg: 3, pp: 2, sf: 7, sc: 4, jf: 48, jc: 40 },
    { idEquipo: 'equ3', nombreEquipo: 'Viboras Team', jugador1: 'Sofia Loren', jugador2: 'Juan Lopez', puntos: 10, pj: 5, pg: 3, pp: 2, sf: 6, sc: 5, jf: 45, jc: 42 },
    { idEquipo: 'equ4', nombreEquipo: 'Los Martillos', jugador1: 'Pedro Pascal', jugador2: 'Elena Nito', puntos: 4, pj: 5, pg: 1, pp: 4, sf: 3, sc: 8, jf: 30, jc: 52 },
  ],
  'liga-invierno-av': [
    { idEquipo: 'equ5', nombreEquipo: 'Titanes del Padel', jugador1: 'Roberto Carlos', jugador2: 'Marta Silva', puntos: 15, pj: 5, pg: 5, pp: 0, sf: 10, sc: 1, jf: 60, jc: 20 },
    { idEquipo: 'equ6', nombreEquipo: 'Furia Roja', jugador1: 'Sergio Ramos', jugador2: 'Isabel Diaz', puntos: 12, pj: 5, pg: 4, pp: 1, sf: 8, sc: 3, jf: 55, jc: 30 },
  ],
  // Añadir más clasificaciones para otras ligas si es necesario
};
// --- Fin Mock Data ---

const LigasClasificacion = () => {
  const [tiposLiga, setTiposLiga] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroZona, setFiltroZona] = useState('');
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState('');
  const [busquedaEquipo, setBusquedaEquipo] = useState('');

  useEffect(() => {
    // Extraer tipos y categorías únicas de las ligas para los selectores
    const todosTipos = ['Todos', ...new Set(mockLigas.map(liga => liga.tipo))];
    const todasCategorias = ['Todos', ...new Set(mockLigas.map(liga => liga.categoria))];
    setTiposLiga(todosTipos);
    setCategorias(todasCategorias);
  }, []);

  const ligasFiltradas = useMemo(() => {
    return mockLigas.filter(liga =>
      (filtroTipo === 'Todos' || liga.tipo === filtroTipo) &&
      (filtroCategoria === 'Todos' || liga.categoria === filtroCategoria) &&
      (filtroZona === '' || liga.zona.toLowerCase().includes(filtroZona.toLowerCase()))
    );
  }, [filtroTipo, filtroCategoria, filtroZona]);

  const clasificacionActual = useMemo(() => {
    if (!ligaSeleccionadaId || !mockClasificaciones[ligaSeleccionadaId]) {
      return [];
    }
    let clasificacion = mockClasificaciones[ligaSeleccionadaId].map(equipo => ({
      ...equipo,
      difSets: equipo.sf - equipo.sc,
      difJuegos: equipo.jf - equipo.jc,
    }));

    // Ordenar
    clasificacion.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.difSets !== a.difSets) return b.difSets - a.difSets;
      if (b.difJuegos !== a.difJuegos) return b.difJuegos - a.difJuegos;
      // Podríamos añadir más criterios como sets a favor si es necesario
      return a.nombreEquipo.localeCompare(b.nombreEquipo); // Alfabético como último recurso
    });
    
    // Añadir posición
    clasificacion = clasificacion.map((equipo, index) => ({ ...equipo, posicion: index + 1 }));

    if (busquedaEquipo) {
      return clasificacion.filter(equipo =>
        equipo.nombreEquipo.toLowerCase().includes(busquedaEquipo.toLowerCase()) ||
        equipo.jugador1.toLowerCase().includes(busquedaEquipo.toLowerCase()) ||
        equipo.jugador2.toLowerCase().includes(busquedaEquipo.toLowerCase())
      );
    }
    return clasificacion;
  }, [ligaSeleccionadaId, busquedaEquipo]);

  const handleLigaSeleccionadaChange = (e) => {
    setLigaSeleccionadaId(e.target.value);
    setBusquedaEquipo(''); // Resetear búsqueda al cambiar de liga
  };
  
  const ligaSeleccionadaNombre = mockLigas.find(l => l.id === ligaSeleccionadaId)?.nombre || '';

  return (
    <div className={styles.profileContainer}> {/* Usaremos la base de Ligas.module.css y añadiremos más */}
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Clasificación de Ligas</h1>
          <p className={styles.pageDescription}>
            Consulta la clasificación de las diferentes ligas. Selecciona los filtros para encontrar una liga específica.
          </p>

          <div className={styles.filtrosContainerClasificacion}> {/* Nueva clase para estos filtros */}
            <div className={styles.filtroItem}>
              <label htmlFor="filtroTipo">Tipo de Liga:</label>
              <select id="filtroTipo" value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setLigaSeleccionadaId(''); }}>
                {tiposLiga.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroCategoria">Categoría:</label>
              <select id="filtroCategoria" value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setLigaSeleccionadaId(''); }}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroZona">Zona/Localidad:</label>
              <input type="text" id="filtroZona" value={filtroZona} placeholder="Ej: Club Central" onChange={(e) => { setFiltroZona(e.target.value); setLigaSeleccionadaId(''); }} />
            </div>
          </div>

          <div className={styles.filtrosContainerClasificacion}>
             <div className={styles.filtroItemFullWidth}> {/* Para el selector de liga */}
                <label htmlFor="ligaSeleccionada">Selecciona una Liga:</label>
                <select id="ligaSeleccionada" value={ligaSeleccionadaId} onChange={handleLigaSeleccionadaChange} disabled={ligasFiltradas.length === 0}>
                  <option value="">{ligasFiltradas.length === 0 ? 'No hay ligas con esos filtros' : '-- Elige una liga para ver su clasificación --'}</option>
                  {ligasFiltradas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre} ({liga.temporada})</option>)}                </select>
            </div>
          </div>

          {ligaSeleccionadaId && (
            <div className={styles.clasificacionSection}>
              <h2 className={styles.subPageTitle}>Clasificación: {ligaSeleccionadaNombre}</h2>
              <div className={styles.filtroItemSmall}> {/* Para el buscador dentro de la tabla */}
                 <label htmlFor="busquedaEquipo">Buscar Equipo/Jugador:</label>
                 <input
                    type="text"
                    id="busquedaEquipo"
                    placeholder="Nombre..."
                    value={busquedaEquipo}
                    onChange={(e) => setBusquedaEquipo(e.target.value)}
                  />
              </div>

              {clasificacionActual.length > 0 ? (
                <div className={styles.tablaResponsiveContainer}>
                  <table className={styles.tablaClasificacion}>
                    <thead>
                      <tr>
                        <th>Pos.</th>
                        <th>Equipo</th>
                        <th>Jugador 1</th>
                        <th>Jugador 2</th>
                        <th>Pts.</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PP</th>
                        <th>SF</th>
                        <th>SC</th>
                        <th>+/- Sets</th>
                        <th>JF</th>
                        <th>JC</th>
                        <th>+/- Jgs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clasificacionActual.map((equipo) => (
                        <tr key={equipo.idEquipo}>
                          <td>{equipo.posicion}</td>
                          <td>{equipo.nombreEquipo}</td>
                          <td>{equipo.jugador1}</td>
                          <td>{equipo.jugador2}</td>
                          <td>{equipo.puntos}</td>
                          <td>{equipo.pj}</td>
                          <td>{equipo.pg}</td>
                          <td>{equipo.pp}</td>
                          <td>{equipo.sf}</td>
                          <td>{equipo.sc}</td>
                          <td>{equipo.difSets > 0 ? `+${equipo.difSets}` : equipo.difSets}</td>
                          <td>{equipo.jf}</td>
                          <td>{equipo.jc}</td>
                          <td>{equipo.difJuegos > 0 ? `+${equipo.difJuegos}` : equipo.difJuegos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className={styles.noResultsClasificacion}>
                  {busquedaEquipo ? 'No hay equipos/jugadores que coincidan con tu búsqueda en esta liga.' : 'No hay datos de clasificación disponibles para esta liga o aún no hay equipos.'}
                </p>
              )}
            </div>
          )}
          {!ligaSeleccionadaId && ligasFiltradas.length > 0 && (
             <p className={styles.infoMessage}>Selecciona una liga para ver su tabla de clasificación.</p>
          )}
           {!ligaSeleccionadaId && ligasFiltradas.length === 0 && filtroZona && (
             <p className={styles.infoMessage}>No se encontraron ligas con los filtros aplicados. Prueba a modificar tu búsqueda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasClasificacion; 