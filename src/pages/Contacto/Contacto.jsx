import React, { useState } from 'react';
import styles from './Contacto.module.css';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    // Simular envío (aquí irían las llamadas a la API real)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMensaje({
        tipo: 'exito',
        texto: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.'
      });
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Contacto</h1>

          <div className={styles.contactoGrid}>
            {/* Columna de información */}
            <div className={styles.infoColumn}>
              <div className={styles.infoSection}>
                <h2>¿Cómo podemos ayudarte?</h2>
                <p>Estamos aquí para responder tus preguntas y escuchar tus sugerencias sobre Padel Arena League.</p>
                
                <div className={styles.contactItem}>
                  <div className={styles.icon}>📍</div>
                  <div>
                    <h3>Ubicación</h3>
                    <p>Calle Principal 123<br />28001 Madrid, España</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.icon}>📞</div>
                  <div>
                    <h3>Teléfono</h3>
                    <p>+34 900 123 456</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.icon}>✉️</div>
                  <div>
                    <h3>Email</h3>
                    <p>info@padelarenaleague.com</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.icon}>⏰</div>
                  <div>
                    <h3>Horario de Atención</h3>
                    <p>Lunes a Viernes: 9:00 - 20:00<br />
                    Sábados: 10:00 - 14:00</p>
                  </div>
                </div>

                <div className={styles.socialLinks}>
                  <h3>Síguenos en Redes Sociales</h3>
                  <div className={styles.socialIcons}>
                    <a href="#" className={styles.socialIcon} title="Instagram">📸</a>
                    <a href="#" className={styles.socialIcon} title="Facebook">👥</a>
                    <a href="#" className={styles.socialIcon} title="Twitter">🐦</a>
                    <a href="#" className={styles.socialIcon} title="YouTube">📺</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna del formulario */}
            <div className={styles.formColumn}>
              <div className={styles.formSection}>
                <h2>Envíanos un Mensaje</h2>
                <p>Completa el formulario y te responderemos lo antes posible.</p>

                {mensaje && (
                  <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
                    {mensaje.texto}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="nombre">Nombre *</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="telefono">Teléfono</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Tu número de teléfono"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="asunto">Asunto *</label>
                      <input
                        type="text"
                        id="asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                        placeholder="Asunto del mensaje"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="mensaje">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      placeholder="Escribe tu mensaje aquí..."
                      rows="6"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto; 