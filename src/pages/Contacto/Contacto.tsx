import React, { useState } from 'react';
import styles from './Contacto.module.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface FormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  mensaje: string;
}

interface MensajeEstado {
  tipo: 'exito' | 'error';
  texto: string;
}

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [mensaje, setMensaje] = useState<MensajeEstado | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aquí iría la lógica para enviar el formulario
      // Por ahora solo mostraremos un mensaje de éxito
      setMensaje({
        tipo: 'exito',
        texto: 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.'
      });
      
      // Limpiar el formulario
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.'
      });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Contacto</h1>
          
          <div className={styles.contactoGrid}>
            <div className={styles.infoColumn}>
              <div className={styles.infoSection}>
                <h2>Información de Contacto</h2>
                <p>Estamos aquí para ayudarte. No dudes en contactarnos por cualquiera de estos medios.</p>
                
                <div className={styles.contactItem}>
                  <div className={styles.icon}>
                    <FaPhone />
                  </div>
                  <div>
                    <h3>Teléfono</h3>
                    <p>+34 123 456 789</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.icon}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>info@padelarenaleague.com</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.icon}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3>Dirección</h3>
                    <p>Calle Principal 123<br />28001 Madrid, España</p>
                  </div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <h3>Síguenos en redes sociales</h3>
                <div className={styles.socialIcons}>
                  <a href="#" className={styles.socialIcon}><FaFacebook /></a>
                  <a href="#" className={styles.socialIcon}><FaTwitter /></a>
                  <a href="#" className={styles.socialIcon}><FaInstagram /></a>
                  <a href="#" className={styles.socialIcon}><FaLinkedin /></a>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Envíanos un mensaje</h2>
              <p>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>

              {mensaje && (
                <div className={`${styles.mensaje} ${styles[mensaje.tipo]}`}>
                  {mensaje.texto}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="mensaje">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={6}
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto; 