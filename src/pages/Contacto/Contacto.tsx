import React, { useState, useEffect, useRef } from "react";
import styles from "./Contacto.module.css";

interface FormData {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

interface MensajeEstado {
  tipo: "exito" | "error";
  texto: string;
}

// Hook useElementOnScreen (copiado de Home.jsx para este ejemplo)
const useElementOnScreen = (options: IntersectionObserverInit) => {
  const containerRef = useRef<HTMLDivElement>(null); // Especificar tipo de elemento para la ref
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries: IntersectionObserverEntry[]) => {
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

  return [containerRef, isVisible] as const; // Afirmación de tipo para tupla
};

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [mensaje, setMensaje] = useState<MensajeEstado | null>(null);

  // Observador para la sección principal del grid
  const [contactoGridRef, isContactoGridVisible] = useElementOnScreen({ threshold: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Datos del formulario:", formData);
      setMensaje({
        tipo: "exito",
        texto:
          "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.",
      });

      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto:
          "Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Contacto</h1>

          <div 
            ref={contactoGridRef} 
            className={`${styles.contactoGrid} ${styles.sectionAnimate} ${isContactoGridVisible ? styles.visible : ''}`}
          >
            <div className={styles.infoColumn}>
              <div className={styles.infoSection}>
                <div className={styles.contactItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    call
                  </span>
                  <div>
                    <h3>Teléfono</h3>
                    <p>+34 123 456 789</p>
                  </div>
                </div>
                <p>Llámanos para consultas rápidas.</p>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.contactItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    sms
                  </span>
                  <div>
                    <h3>WhatsApp</h3>
                    <p>+34 123 456 789</p>
                  </div>
                </div>
                <p>Escríbenos por WhatsApp para una comunicación ágil.</p>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.contactItem}>
                  <span className={`material-symbols-outlined ${styles.icon}`}>
                    mail
                  </span>
                  <div>
                    <h3>Email</h3>
                    <p>info@padelarenaleague.com</p>
                  </div>
                </div>
                <p>Para consultas más detalladas o formales.</p>
              </div>
            </div>

            <div className={styles.formSection}>
              <h2>Envíanos un mensaje</h2>
              <p>
                Completa el formulario y nos pondremos en contacto contigo lo
                antes posible.
              </p>

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
                    <label htmlFor="telefono">Teléfono (Opcional)</label>
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
                  <label htmlFor="asunto">Asunto</label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                  />
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
