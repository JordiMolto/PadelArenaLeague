import React, { useState, useEffect, useMemo } from 'react';
import styles from './Ligas.module.css'; // Reutilizaremos y expandiremos Ligas.module.css

// --- Mock Data Ampliado ---
const mockLigas = [
  { id: 'liga-verano-int-a', nombre: 'Liga Verano (Intermedio - Grupo A)', categoria: 'Intermedio', zona: 'Club Central', temporada: 'Verano 2024', grupo: 'A' },
  { id: 'liga-verano-int-b', nombre: 'Liga Verano (Intermedio - Grupo B)', categoria: 'Intermedio', zona: 'Club Central', temporada: 'Verano 2024', grupo: 'B' },
  { id: 'liga-invierno-av', nombre: 'Liga Invierno (Avanzado)', categoria: 'Avanzado', zona: 'Polideportivo Norte', temporada: 'Invierno 2024', grupo: 'Único' },
  { id: 'liga-primavera-mix', nombre: 'Liga Primavera (Mixta)', categoria: 'Mixta', zona: 'Club Sur', temporada: 'Primavera 2024', grupo: 'Único' },
  { id: 'liga-primavera-fem', nombre: 'Liga Primavera (Femenina)', categoria: 'Femenina', zona: 'Club Sur', temporada: 'Primavera 2024', grupo: 'Único' },
];

const mockClasificaciones = {
  'liga-verano-int-a': [
    { idEquipo: 'equ1', nombreEquipo: 'Los Dinámicos', pj: 6, pg: 5, pp: 1, pe: 0, sf: 10, sc: 3, puntos: 15, racha: 'W4', ultimos5: ['W', 'W', 'W', 'W', 'L'] },
    { idEquipo: 'equ2', nombreEquipo: 'Padel Trotters', pj: 6, pg: 3, pp: 2, pe: 1, sf: 8, sc: 6, puntos: 10, racha: 'D1', ultimos5: ['D', 'W', 'L', 'W', 'W'] },
    { idEquipo: 'equ3', nombreEquipo: 'Viboras Team', pj: 6, pg: 2, pp: 3, pe: 1, sf: 7, sc: 8, puntos: 7, racha: 'L1', ultimos5: ['L', 'D', 'L', 'W', 'W'] },
    { idEquipo: 'equ4', nombreEquipo: 'Los Martillos', pj: 6, pg: 1, pp: 5, pe: 0, sf: 3, sc: 11, puntos: 3, racha: 'L3', ultimos5: ['L', 'L', 'L', 'W', 'L'] },
  ],
  'liga-verano-int-b': [
    { idEquipo: 'equB1', nombreEquipo: 'Revés Letal', pj: 5, pg: 4, pp: 1, pe: 0, sf: 8, sc: 2, puntos: 12, racha: 'W2', ultimos5: ['W', 'W', 'L', 'W', 'W'] },
    { idEquipo: 'equB2', nombreEquipo: 'Globetrotters', pj: 5, pg: 3, pp: 2, pe: 0, sf: 6, sc: 5, puntos: 9, racha: 'L1', ultimos5: ['L', 'W', 'W', 'L', 'W'] },
    { idEquipo: 'equB3', nombreEquipo: 'Saque Directo', pj: 5, pg: 1, pp: 4, pe: 0, sf: 3, sc: 8, puntos: 3, racha: 'L2', ultimos5: ['L', 'L', 'W', 'L', 'L'] },
  ],
  'liga-invierno-av': [
    { idEquipo: 'equ5', nombreEquipo: 'Titanes del Padel', pj: 4, pg: 4, pp: 0, pe: 0, sf: 8, sc: 1, puntos: 12, racha: 'W4', ultimos5: ['W', 'W', 'W', 'W'] }, // Solo 4 partidos
    { idEquipo: 'equ6', nombreEquipo: 'Furia Roja', pj: 4, pg: 2, pp: 2, pe: 0, sf: 5, sc: 4, puntos: 6, racha: 'W1', ultimos5: ['W', 'L', 'W', 'L'] },
    { idEquipo: 'equ7', nombreEquipo: 'Ases del Invierno', pj: 4, pg: 0, pp: 4, pe: 0, sf: 0, sc: 8, puntos: 0, racha: 'L4', ultimos5: ['L', 'L', 'L', 'L'] },
  ],
  'liga-primavera-mix': [
     { idEquipo: 'equM1', nombreEquipo: 'Doble Mixto Power', pj: 3, pg: 2, pp: 0, pe: 1, sf: 5, sc: 2, puntos: 7, racha: 'W1', ultimos5: ['W', 'D', 'W'] },
     { idEquipo: 'equM2', nombreEquipo: 'Los Combinados', pj: 3, pg: 1, pp: 2, pe: 0, sf: 3, sc: 4, puntos: 3, racha: 'L1', ultimos5: ['L', 'W', 'L'] },
  ],
  // Añadir más clasificaciones...
};

// Helper para renderizar últimos 5 resultados
const RenderUltimos5 = ({ resultados }) => {
  if (!resultados || resultados.length === 0) return <span>-</span>;
  // Asegurarse de que siempre tengamos 5 elementos, rellenando si es necesario
  const ultimos = [...resultados].reverse().slice(0, 5); // Tomar los últimos 5 y revertir para mostrar el más reciente primero
  while (ultimos.length < 5) {
      ultimos.push('-'); // Rellenar con guion si hay menos de 5
  }

  return (
    <div className={styles.ultimos5Container}>
      {ultimos.map((res, index) => {
        let icono = '⚫'; // Por defecto (o para '-')
        let claseColor = styles.resDesconocido;
        if (res === 'W') {
          icono = '✔';
          claseColor = styles.resVictoria;
        } else if (res === 'L') {
          icono = '✖';
          claseColor = styles.resDerrota;
        } else if (res === 'D') {
          icono = '➖';
          claseColor = styles.resEmpate;
        }
        // El span exterior asegura espaciado uniforme aunque el icono/clase cambie
        return <span key={index} className={`${styles.resultadoIconoSpan} ${claseColor}`}>{icono}</span>;
      })}
    </div>
  );
};
// --- Fin Mock Data y Helper ---

const LigasClasificacion = () => {
  // Estados para filtros
  const [temporadas, setTemporadas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grupos, setGrupos] = useState([]); // Opciones de grupos para la liga seleccionada

  const [filtroTemporada, setFiltroTemporada] = useState('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [ligaSeleccionadaId, setLigaSeleccionadaId] = useState(''); // Ahora filtra por ID exacto
  const [filtroGrupo, setFiltroGrupo] = useState('Todos'); // Nuevo filtro
  const [busquedaEquipo, setBusquedaEquipo] = useState('');

  useEffect(() => {
    // Extraer opciones únicas para filtros globales
    const todasTemporadas = ['Todas', ...new Set(mockLigas.map(liga => liga.temporada))];
    const todasCategorias = ['Todas', ...new Set(mockLigas.map(liga => liga.categoria))];
    setTemporadas(todasTemporadas);
    setCategorias(todasCategorias);
    // Establecer valor inicial si hay mock data
    if (mockLigas.length > 0) {
      // Podríamos seleccionar la primera temporada por defecto
      // setFiltroTemporada(todasTemporadas[1] || 'Todas');
    }
  }, []);

  // Ligas que coinciden con los filtros globales (Temporada, Categoría)
  const ligasDisponiblesFiltradas = useMemo(() => {
    return mockLigas.filter(liga =>
      (filtroTemporada === 'Todas' || liga.temporada === filtroTemporada) &&
      (filtroCategoria === 'Todas' || liga.categoria === filtroCategoria)
    );
  }, [filtroTemporada, filtroCategoria]);

  // Actualizar opciones de grupo cuando cambian las ligas disponibles o la liga seleccionada
  useEffect(() => {
    const gruposDeLigas = new Set(['Todos']);
    ligasDisponiblesFiltradas.forEach(liga => {
      if (liga.grupo) {
        gruposDeLigas.add(liga.grupo);
      }
    });
    setGrupos([...gruposDeLigas]);
    // Si la liga seleccionada actualmente ya no está en las disponibles, deseleccionarla
    if (ligaSeleccionadaId && !ligasDisponiblesFiltradas.some(l => l.id === ligaSeleccionadaId)) {
         setLigaSeleccionadaId('');
    }
    // Resetear filtro de grupo si las opciones cambian drásticamente
    setFiltroGrupo('Todos');

  }, [ligasDisponiblesFiltradas, ligaSeleccionadaId]); // Dependencia añadida

   // Ligas a mostrar en el selector final (ya filtradas por temporada y categoría)
  const opcionesLigaSelect = useMemo(() => {
      return ligasDisponiblesFiltradas;
  }, [ligasDisponiblesFiltradas]);


  // Clasificación a mostrar, filtrada por liga, grupo y búsqueda
  const clasificacionActual = useMemo(() => {
    if (!ligaSeleccionadaId || !mockClasificaciones[ligaSeleccionadaId]) {
      return [];
    }
    // 1. Copiar y calcular campos derivados
    let clasificacion = mockClasificaciones[ligaSeleccionadaId].map(equipo => ({
      ...equipo,
      difSets: equipo.sf - equipo.sc,
      // Añadir difJuegos si existiera jf y jc
    }));

    // 2. Ordenar (Asumiendo sistema de puntos: 3 W, 1 D, 0 L)
    clasificacion.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.difSets !== a.difSets) return b.difSets - a.difSets;
      // desempate por Sets a Favor (SF)
      if (b.sf !== a.sf) return b.sf - a.sf;
      // Último recurso: nombre del equipo
      return a.nombreEquipo.localeCompare(b.nombreEquipo);
    });

    // 3. Añadir posición
    clasificacion = clasificacion.map((equipo, index) => ({ ...equipo, posicion: index + 1 }));

    // 4. Filtrar por búsqueda de texto (si aplica)
    if (busquedaEquipo) {
      return clasificacion.filter(equipo =>
        equipo.nombreEquipo.toLowerCase().includes(busquedaEquipo.toLowerCase())
        // Podríamos añadir búsqueda por jugadores si los tuviéramos aquí
      );
    }

    return clasificacion;
  }, [ligaSeleccionadaId, busquedaEquipo]); // No filtramos por grupo aquí, se hace al seleccionar la liga ID

  // Lógica para el Resumen
  const resumenData = useMemo(() => {
    if (!clasificacionActual || clasificacionActual.length === 0) return null;

    const lider = clasificacionActual[0];
    let mejorRacha = { equipo: '-', racha: '-', tipo: 'N', valor: 0 }; // Tipo N=None, W=Win, L=Loss, D=Draw

    clasificacionActual.forEach(eq => {
      const tipoRacha = eq.racha?.charAt(0) || 'N';
      const valorRacha = parseInt(eq.racha?.substring(1) || '0', 10);

      if (tipoRacha === 'W' && valorRacha > (mejorRacha.tipo === 'W' ? mejorRacha.valor : 0)) {
          mejorRacha = { equipo: eq.nombreEquipo, racha: eq.racha, tipo: 'W', valor: valorRacha };
      }
      // Podríamos añadir lógica para peor racha, etc. aquí si quisiéramos
    });

    // Simplificado: solo líder y mejor racha de victorias
    return {
      lider: `${lider.nombreEquipo} (${lider.puntos} pts)`,
      mejorRacha: `${mejorRacha.equipo} (${mejorRacha.racha})`,
    };
  }, [clasificacionActual]);

  const handleLigaSeleccionadaChange = (e) => {
    setLigaSeleccionadaId(e.target.value);
    setBusquedaEquipo(''); // Resetear búsqueda al cambiar de liga
  };

  const ligaSeleccionadaNombre = mockLigas.find(l => l.id === ligaSeleccionadaId)?.nombre || '';

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Clasificación de Ligas</h1>
          <p className={styles.pageDescription}>
            Consulta la clasificación. Usa los filtros para encontrar una liga o grupo específico.
          </p>

          {/* --- Filtros --- */}
          <div className={styles.filtrosContainerClasificacion}>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroTemporada">Temporada:</label>
              <select id="filtroTemporada" value={filtroTemporada} onChange={(e) => setFiltroTemporada(e.target.value)}>
                {temporadas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.filtroItem}>
              <label htmlFor="filtroCategoria">Categoría:</label>
              <select id="filtroCategoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
             {/* Selector de Liga ahora muestra solo las que coinciden con Temporada/Categoría */}
             <div className={styles.filtroItemFullWidth}>
                <label htmlFor="ligaSeleccionada">Liga Específica:</label>
                <select id="ligaSeleccionada" value={ligaSeleccionadaId} onChange={handleLigaSeleccionadaChange} disabled={opcionesLigaSelect.length === 0}>
                   <option value="">{opcionesLigaSelect.length === 0 ? 'No hay ligas con filtros' : '-- Selecciona Liga --'}</option>
                   {opcionesLigaSelect.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
                </select>
            </div>
            {/* Podríamos añadir filtro de Grupo aquí si fuera necesario refinar más */}
             <div className={styles.filtroItem}>
              <label htmlFor="busquedaEquipo">Buscar Equipo:</label>
              <input
                type="text"
                id="busquedaEquipo"
                placeholder="Nombre..."
                value={busquedaEquipo}
                onChange={(e) => setBusquedaEquipo(e.target.value)}
                disabled={!ligaSeleccionadaId} // Deshabilitar si no hay liga seleccionada
              />
            </div>
          </div>


          {ligaSeleccionadaId && (
            <>
              {/* --- Resumen Superior --- */}
              {resumenData && (
                <div className={styles.resumenClasificacion}>
                  <div>🥇 <strong>Líder:</strong> {resumenData.lider}</div>
                  <div>🔥 <strong>Mejor Racha:</strong> {resumenData.mejorRacha}</div>
                  {/* Añadir más datos del resumen aquí */}
                </div>
              )}

              {/* --- Tabla de Clasificación --- */}
              <div className={styles.clasificacionSection}>
                <h2 className={styles.subPageTitle}>Clasificación: {ligaSeleccionadaNombre}</h2>
                {clasificacionActual.length > 0 ? (
                  <div className={styles.tablaResponsiveContainer}>
                    <table className={styles.tablaClasificacion}>
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Equipo</th>
                          <th>PJ</th>
                          <th>PG</th>
                          <th>PE</th>
                          <th>PP</th>
                          <th>SF</th>
                          <th>SC</th>
                          <th>+/-</th>
                          <th>Pts</th>
                          <th>Racha</th>
                          <th>Últ. 5</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clasificacionActual.map((equipo) => (
                          <tr key={equipo.idEquipo}>
                            <td>{equipo.posicion}</td>
                            <td>{equipo.nombreEquipo}</td>
                            <td>{equipo.pj}</td>
                            <td>{equipo.pg}</td>
                            <td>{equipo.pe}</td>
                            <td>{equipo.pp}</td>
                            <td>{equipo.sf}</td>
                            <td>{equipo.sc}</td>
                            <td>{equipo.difSets > 0 ? `+${equipo.difSets}` : equipo.difSets}</td>
                            <td>{equipo.puntos}</td>
                            <td>{equipo.racha || '-'}</td>
                            <td><RenderUltimos5 resultados={equipo.ultimos5} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={styles.noResultsClasificacion}>
                    {busquedaEquipo ? 'No hay equipos que coincidan con tu búsqueda en esta liga.' : 'No hay datos de clasificación disponibles para esta liga.'}
                  </p>
                )}
              </div>

              {/* --- Ayudas / CTAs --- */}
              <div className={styles.ayudasContainer}>
                <a href="#" onClick={(e) => e.preventDefault()} className={styles.ayudaLink}>📌 ¿Cómo se calcula la clasificación?</a>
                <a href="#" onClick={(e) => e.preventDefault()} className={styles.ayudaLink}>🛠️ Reportar error en resultado</a>
                {/* Añadir botón de subir resultado si es relevante */}
              </div>
            </>
          )}

          {!ligaSeleccionadaId && opcionesLigaSelect.length > 0 && (
             <p className={styles.infoMessage}>Selecciona una liga específica para ver su tabla de clasificación.</p>
          )}
           {!ligaSeleccionadaId && opcionesLigaSelect.length === 0 && (filtroTemporada !== 'Todas' || filtroCategoria !== 'Todas') && (
             <p className={styles.infoMessage}>No se encontraron ligas con los filtros aplicados. Prueba a modificar tu búsqueda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LigasClasificacion; 