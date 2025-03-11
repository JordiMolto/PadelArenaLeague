import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { getPartidos, getLigas, getTorneos } from '../../services/supabase';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, loading } = useRequireAuth();
  const [partidos, setPartidos] = useState([]);
  const [ligas, setLigas] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setDashboardLoading(true);
        
        // Cargar partidos del usuario
        const { data: partidosData, error: partidosError } = await getPartidos(user.id);
        if (partidosError) throw partidosError;
        setPartidos(partidosData || []);
        
        // Cargar ligas disponibles
        const { data: ligasData, error: ligasError } = await getLigas();
        if (ligasError) throw ligasError;
        setLigas(ligasData || []);
        
        // Cargar torneos disponibles
        const { data: torneosData, error: torneosError } = await getTorneos();
        if (torneosError) throw torneosError;
        setTorneos(torneosData || []);
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setDashboardLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading || dashboardLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Cargando tu información...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <header className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Mi Dashboard</h1>
          <p className={styles.welcomeMessage}>
            Bienvenido, {user?.email}
          </p>
        </header>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.dashboardGrid}>
          {/* Próximos Partidos */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Mis Próximos Partidos</h2>
              <Link to="/ligas/encuentros" className={styles.cardLink}>
                Ver todos
              </Link>
            </div>
            
            <div className={styles.cardContent}>
              {partidos.length > 0 ? (
                <ul className={styles.partidosList}>
                  {partidos.slice(0, 3).map((partido) => (
                    <li key={partido.id} className={styles.partidoItem}>
                      <div className={styles.partidoInfo}>
                        <span className={styles.partidoFecha}>
                          {new Date(partido.fecha).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </span>
                        <span className={styles.partidoVs}>
                          {partido.jugador1_nombre} vs {partido.jugador2_nombre}
                        </span>
                      </div>
                      <div className={styles.partidoAcciones}>
                        <Link to={`/partidos/${partido.id}`} className={styles.partidoButton}>
                          Detalles
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>
                  No tienes partidos programados. ¡Inscríbete en una liga o torneo para comenzar!
                </p>
              )}
            </div>
          </div>

          {/* Ligas Activas */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Ligas Activas</h2>
              <Link to="/ligas" className={styles.cardLink}>
                Ver todas
              </Link>
            </div>
            
            <div className={styles.cardContent}>
              {ligas.length > 0 ? (
                <ul className={styles.ligasList}>
                  {ligas.slice(0, 3).map((liga) => (
                    <li key={liga.id} className={styles.ligaItem}>
                      <div className={styles.ligaInfo}>
                        <h3 className={styles.ligaNombre}>{liga.nombre}</h3>
                        <span className={styles.ligaTemporada}>{liga.temporada}</span>
                      </div>
                      <div className={styles.ligaAcciones}>
                        <Link to={`/ligas/${liga.id}`} className={styles.ligaButton}>
                          Ver Liga
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>
                  No hay ligas activas en este momento.
                </p>
              )}
            </div>
          </div>

          {/* Torneos Próximos */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Torneos Próximos</h2>
              <Link to="/torneos" className={styles.cardLink}>
                Ver todos
              </Link>
            </div>
            
            <div className={styles.cardContent}>
              {torneos.length > 0 ? (
                <ul className={styles.torneosList}>
                  {torneos.slice(0, 3).map((torneo) => (
                    <li key={torneo.id} className={styles.torneoItem}>
                      <div className={styles.torneoInfo}>
                        <h3 className={styles.torneoNombre}>{torneo.nombre}</h3>
                        <span className={styles.torneoFecha}>
                          {new Date(torneo.fecha_inicio).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                          })} - {new Date(torneo.fecha_fin).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      </div>
                      <div className={styles.torneoAcciones}>
                        <Link to={`/torneos/${torneo.id}`} className={styles.torneoButton}>
                          Ver Torneo
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>
                  No hay torneos programados en este momento.
                </p>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Acciones Rápidas</h2>
            </div>
            
            <div className={styles.quickActions}>
              <Link to="/ligas/inscripcion" className={styles.quickActionButton}>
                Inscribirme en Liga
              </Link>
              <Link to="/torneos/inscripcion" className={styles.quickActionButton}>
                Inscribirme en Torneo
              </Link>
              <Link to="/chat" className={styles.quickActionButton}>
                Mensajes
              </Link>
              <Link to="/profile" className={styles.quickActionButton}>
                Mi Perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 