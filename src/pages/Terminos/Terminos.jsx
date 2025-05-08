import React, { useRef, useState, useEffect } from 'react';
import styles from './Terminos.module.css'; // Usará los mismos estilos que Privacidad

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

const Terminos = () => {
  const [contentRef, isContentVisible] = useElementOnScreen({ threshold: 0.05 });

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Términos y Condiciones</h1>

          <div
            ref={contentRef}
            className={`${styles.legalContent} ${styles.sectionAnimate} ${isContentVisible ? styles.visible : ''}`}
          >
            <section>
              <h2>1. Aceptación de los Términos</h2>
              <p>Al acceder y utilizar los servicios de Padel Arena League (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones (en adelante, "Términos") y a nuestra Política de Privacidad.</p>
              {/* Añadir más párrafos */}
            </section>

            <section>
              <h2>2. Uso de la Plataforma</h2>
              <p>Usted se compromete a utilizar la Plataforma únicamente para fines lícitos y de acuerdo con estos Términos. Es responsable de mantener la confidencialidad de su cuenta y contraseña.</p>
              {/* Añadir más párrafos */}
            </section>

            <section>
              <h2>3. Inscripciones y Pagos</h2>
              <p>Las condiciones específicas de inscripción, cuotas y políticas de reembolso para ligas y torneos se detallarán en la información de cada evento.</p>
               {/* Añadir más párrafos */}
            </section>

            <section>
              <h2>4. Propiedad Intelectual</h2>
              <p>Todo el contenido de la Plataforma, incluyendo textos, gráficos, logos e iconos, es propiedad de Padel Arena League o sus licenciantes y está protegido por las leyes de propiedad intelectual.</p>
               {/* Añadir más párrafos */}
            </section>

             <section>
              <h2>5. Limitación de Responsabilidad</h2>
              <p>La Plataforma se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores. En la máxima medida permitida por la ley, no seremos responsables por daños directos o indirectos derivados del uso de la Plataforma.</p>
               {/* Añadir más párrafos */}
            </section>

             <section>
              <h2>6. Modificaciones de los Términos</h2>
              <p>Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma.</p>
               {/* Añadir más párrafos */}
            </section>

             <section>
              <h2>7. Ley Aplicable</h2>
              <p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de España.</p>
               {/* Añadir más párrafos */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos; 