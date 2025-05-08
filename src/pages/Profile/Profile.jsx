import React, { useState, useEffect, useRef } from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { getPerfil, actualizarPerfil } from '../../services/supabase';
import styles from './Profile.module.css';

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

const Profile = () => {
  const { user, loading } = useRequireAuth();
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    nivel: 'principiante',
    disponibilidad: {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
      domingo: false,
    },
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Refs para animación
  const [infoFormRef, isInfoFormVisible] = useElementOnScreen({ threshold: 0.1 });
  const [passwordFormRef, isPasswordFormVisible] = useElementOnScreen({ threshold: 0.1 });
  const [dangerZoneRef, isDangerZoneVisible] = useElementOnScreen({ threshold: 0.1 });

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user) return;
      
      try {
        setProfileLoading(true);
        
        const { data, error } = await getPerfil(user.id);
        
        if (error) throw error;
        
        if (data) {
          setPerfil({
            ...perfil,
            ...data,
            disponibilidad: data.disponibilidad || perfil.disponibilidad,
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setError('No se pudo cargar tu perfil. Por favor, intenta de nuevo más tarde.');
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      cargarPerfil();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil({
      ...perfil,
      [name]: value,
    });
  };

  const handleDisponibilidadChange = (dia) => {
    setPerfil({
      ...perfil,
      disponibilidad: {
        ...perfil.disponibilidad,
        [dia]: !perfil.disponibilidad[dia],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { error } = await actualizarPerfil(user.id, {
        ...perfil,
        updated_at: new Date(),
      });
      
      if (error) throw error;
      
      setSuccess('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError('No se pudo actualizar tu perfil. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <h1 className={styles.profileTitle}>Mi Perfil</h1>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {perfil.nombre ? `${perfil.nombre} ${perfil.apellidos}` : user.email}
              </h2>
              <p className={styles.profileEmail}>{user.email}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Información Personal</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre" className={styles.formLabel}>
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={perfil.nombre}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="apellidos" className={styles.formLabel}>
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    value={perfil.apellidos}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="telefono" className={styles.formLabel}>
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={perfil.telefono}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="Tu número de teléfono"
                />
              </div>
            </div>
            
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Información de Juego</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="nivel" className={styles.formLabel}>
                  Nivel de Juego
                </label>
                <select
                  id="nivel"
                  name="nivel"
                  value={perfil.nivel}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Disponibilidad Semanal
                </label>
                <div className={styles.disponibilidadGrid}>
                  {Object.entries(perfil.disponibilidad).map(([dia, disponible]) => (
                    <div 
                      key={dia}
                      className={`${styles.diaItem} ${disponible ? styles.disponible : ''}`}
                      onClick={() => handleDisponibilidadChange(dia)}
                    >
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 