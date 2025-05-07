import React from 'react';
import styles from './Privacidad.module.css';

const Privacidad = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Política de Privacidad</h1>

          <div className={styles.legalContent}>
            <section>
              <h2>1. Información que recopilamos</h2>
              <p>Recopilamos información personal cuando te registras, utilizas nuestros servicios o te comunicas con nosotros. Esto puede incluir tu nombre, correo electrónico, número de teléfono y datos de juego.</p>
              {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

            <section>
              <h2>2. Cómo usamos tu información</h2>
              <p>Utilizamos tu información para administrar tu cuenta, organizar ligas y torneos, comunicarnos contigo y mejorar nuestros servicios.</p>
              {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

            <section>
              <h2>3. Cómo compartimos tu información</h2>
              <p>No compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar nuestros servicios (por ejemplo, con otros jugadores para organizar partidos) o cuando lo exija la ley.</p>
              {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

             <section>
              <h2>4. Seguridad de tus datos</h2>
              <p>Implementamos medidas de seguridad para proteger tu información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción.</p>
               {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

            <section>
              <h2>5. Tus derechos</h2>
              <p>Tienes derecho a acceder, corregir o eliminar tu información personal. También puedes oponerte al procesamiento de tus datos en ciertas circunstancias.</p>
               {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

            <section>
              <h2>6. Cambios en esta política</h2>
              <p>Podemos actualizar esta política de privacidad periódicamente. Te notificaremos cualquier cambio publicando la nueva política en esta página.</p>
               {/* Añadir más párrafos y detalles según sea necesario */}
            </section>

            <section>
              <h2>7. Contacto</h2>
              <p>Si tienes alguna pregunta sobre esta política de privacidad, contáctanos en info@padelarenaleague.com.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacidad; 