import React from 'react';
import styles from './PlaceholderPage.module.css';

const PlaceholderPage = ({ title }) => {
  return (
    <div className={styles.placeholderContainer}>
      <div className={styles.placeholderCard}>
        <h2 className={styles.pageTitle}>{title || 'Página en Construcción'}</h2>
        <p className={styles.pageDescription}>
          Esta sección estará disponible próximamente. ¡Gracias por tu paciencia!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage; 