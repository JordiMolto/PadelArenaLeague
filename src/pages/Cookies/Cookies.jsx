import React from 'react';
import styles from './Cookies.module.css'; // Usará los mismos estilos que Privacidad/Terminos

const Cookies = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Política de Cookies</h1>

          <div className={styles.legalContent}>
            <section>
              <h2>1. ¿Qué son las cookies?</h2>
              <p>Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página.</p>
              {/* Añadir más párrafos */}
            </section>

            <section>
              <h2>2. Cookies utilizadas en este sitio web</h2>
              <p>Siguiendo las directrices de la Agencia Española de Protección de Datos procedemos a detallar el uso de cookies que hace esta web con el fin de informarle con la máxima exactitud posible.</p>
              <p>Este sitio web utiliza las siguientes <strong>cookies propias</strong>:</p>
              <ul>
                <li>Cookies de sesión, para garantizar que los usuarios que escriban comentarios en el blog sean humanos y no aplicaciones automatizadas. De esta forma se combate el spam.</li>
                {/* Añadir más cookies propias si existen */}
              </ul>
              <p>Este sitio web utiliza las siguientes <strong>cookies de terceros</strong>:</p>
              <ul>
                <li>Google Analytics: Almacena cookies para poder elaborar estadísticas sobre el tráfico y volumen de visitas de esta web. Al utilizar este sitio web está consintiendo el tratamiento de información acerca de usted por Google. Por tanto, el ejercicio de cualquier derecho en este sentido deberá hacerlo comunicando directamente con Google.</li>
                <li>Redes sociales: Cada red social utiliza sus propias cookies para que usted pueda pinchar en botones del tipo Me gusta o Compartir.</li>
                 {/* Añadir más cookies de terceros */}
              </ul>
            </section>

            <section>
              <h2>3. Desactivación o eliminación de cookies</h2>
              <p>En cualquier momento podrá ejercer su derecho de desactivación o eliminación de cookies de este sitio web. Estas acciones se realizan de forma diferente en función del navegador que esté usando.</p>
              {/* Añadir enlaces o instrucciones para desactivar cookies en navegadores comunes */}
            </section>

            <section>
              <h2>4. Notas adicionales</h2>
              <p>Ni esta web ni sus representantes legales se hacen responsables ni del contenido ni de la veracidad de las políticas de privacidad que puedan tener los terceros mencionados en esta política de cookies.</p>
               {/* Añadir más párrafos */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies; 