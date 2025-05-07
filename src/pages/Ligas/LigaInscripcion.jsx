import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Ligas.module.css'; // Usará el CSS compartido

const LigaInscripcion = () => {
  const navigate = useNavigate();
  // Datos de ejemplo para las ligas disponibles (deberían venir de una API)
  const ligasDisponibles = [
    { id: 'liga-verano-2024', nombre: 'Liga Verano 2024 - Nivel Intermedio', descripcion: 'Compite durante los meses de verano en un ambiente relajado.' },
    { id: 'liga-invierno-2024', nombre: 'Liga Invierno 2024 - Nivel Avanzado', descripcion: 'Para jugadores experimentados que buscan un mayor desafío.' },
    { id: 'liga-primavera-mixta-2024', nombre: 'Liga Primavera Mixta 2024 - Todos los niveles', descripcion: 'Equipos mixtos, diversión garantizada para todos.' },
  ];

  const [formData, setFormData] = useState({
    ligaSeleccionada: '',
    nombreEquipo: '',
    nombreCapitan: '',
    emailCapitan: '',
    nombreJugador2: '',
    emailJugador2: '',
    disponibilidad: {
      lvMananas: false,
      lvTardes: false,
      lvNoches: false,
      fdsMananas: false,
      fdsTardes: false,
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        disponibilidad: {
          ...prev.disponibilidad,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.ligaSeleccionada || !formData.nombreEquipo || !formData.nombreCapitan || !formData.emailCapitan || !formData.nombreJugador2 || !formData.emailJugador2) {
      setError('Por favor, completa todos los campos obligatorios del equipo.');
      return;
    }
    // Validación simple de email
    if (!/\S+@\S+\.\S+/.test(formData.emailCapitan) || !/\S+@\S+\.\S+/.test(formData.emailJugador2)) {
        setError('Por favor, introduce direcciones de email válidas.');
        return;
    }

    const disponibilidadSeleccionada = Object.entries(formData.disponibilidad)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (disponibilidadSeleccionada.length === 0) {
        setError('Por favor, selecciona al menos una franja de disponibilidad.');
        return;
    }

    console.log('Inscripción enviada:', { ...formData, disponibilidad: disponibilidadSeleccionada });
    setSuccess(`¡Inscripción exitosa para ${formData.nombreEquipo} en la liga seleccionada!`);
    
    // Limpiar formulario
    setFormData({
      ligaSeleccionada: '',
      nombreEquipo: '',
      nombreCapitan: '',
      emailCapitan: '',
      nombreJugador2: '',
      emailJugador2: '',
      disponibilidad: {
        lvMananas: false,
        lvTardes: false,
        lvNoches: false,
        fdsMananas: false,
        fdsTardes: false,
      }
    });
    // Opcional: navigate('/alguna-pagina-de-confirmacion');
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.pageTitle}>Inscripción a Ligas</h1>
          <p className={styles.pageDescription}>
            Consulta las ligas disponibles y completa el formulario para inscribir a tu equipo.
            Recuerda que cada equipo debe coordinar la reserva de pistas y el material para sus partidos.
          </p>

          <div className={styles.ligasDisponiblesContainer}>
            <h2 className={styles.subPageTitle}>Ligas Abiertas para Inscripción</h2>
            {ligasDisponibles.length > 0 ? (
              ligasDisponibles.map(liga => (
                <div key={liga.id} className={styles.ligaDisponibleItem}>
                  <h3>{liga.nombre}</h3>
                  <p>{liga.descripcion}</p>
                  {/* Podríamos añadir más detalles como fechas, plazas, etc. */}
                </div>
              ))
            ) : (
              <p>No hay ligas con inscripción abierta en este momento. ¡Vuelve pronto!</p>
            )}
          </div>
          
          <hr className={styles.divider} />

          <h2 className={styles.subPageTitle}>Formulario de Inscripción del Equipo</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="ligaSeleccionada">Selecciona una Liga:</label>
              <select
                id="ligaSeleccionada"
                name="ligaSeleccionada"
                value={formData.ligaSeleccionada}
                onChange={handleInputChange}
                required
                className={styles.formInput}
              >
                <option value="">-- Elige una liga --</option>
                {ligasDisponibles.map(liga => (
                  <option key={liga.id} value={liga.id}>{liga.nombre}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="nombreEquipo">Nombre del Equipo:</label>
              <input
                type="text"
                id="nombreEquipo"
                name="nombreEquipo"
                value={formData.nombreEquipo}
                onChange={handleInputChange}
                required
                className={styles.formInput}
                placeholder="Ej: Los Gladiadores del Pádel"
              />
            </div>
            
            <div className={styles.formRow}> {/* Para agrupar campos en la misma fila si es necesario */}
              <div className={styles.formGroup}>
                <label htmlFor="nombreCapitan">Nombre del Capitán:</label>
                <input type="text" id="nombreCapitan" name="nombreCapitan" value={formData.nombreCapitan} onChange={handleInputChange} required className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emailCapitan">Email del Capitán:</label>
                <input type="email" id="emailCapitan" name="emailCapitan" value={formData.emailCapitan} onChange={handleInputChange} required className={styles.formInput} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nombreJugador2">Nombre del Jugador 2:</label>
                <input type="text" id="nombreJugador2" name="nombreJugador2" value={formData.nombreJugador2} onChange={handleInputChange} required className={styles.formInput} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emailJugador2">Email del Jugador 2:</label>
                <input type="email" id="emailJugador2" name="emailJugador2" value={formData.emailJugador2} onChange={handleInputChange} required className={styles.formInput} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Disponibilidad Semanal del Equipo (marcar todas las aplicables):</label>
              <div className={styles.checkboxGroup}>
                {[
                  { id: 'lvMananas', label: 'Lunes a Viernes (Mañanas)' },
                  { id: 'lvTardes', label: 'Lunes a Viernes (Tardes)' },
                  { id: 'lvNoches', label: 'Lunes a Viernes (Noches)' },
                  { id: 'fdsMananas', label: 'Fines de Semana (Mañanas)' },
                  { id: 'fdsTardes', label: 'Fines de Semana (Tardes)' },
                ].map(item => (
                  <div key={item.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={item.id}
                      name={item.id}
                      checked={formData.disponibilidad[item.id]}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={item.id}>{item.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryButton}>Inscribir Equipo</button>
              <Link to="/" className={styles.backButton}>Volver al Inicio</Link> {/* Cambiado para volver al inicio o a donde prefieras */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LigaInscripcion; 