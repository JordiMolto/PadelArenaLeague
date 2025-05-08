import React, { useState, useEffect, useRef } from 'react';
import styles from './Galeria.module.css';

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

const Galeria = () => {
  // Estado para el filtro activo y el modal
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [modalImage, setModalImage] = useState(null);

  // Ref para la animación del grid
  const [gridRef, isGridVisible] = useElementOnScreen({ threshold: 0.1 });

  // Datos de ejemplo (en un caso real, vendrían de una API/BD)
  const categorias = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'torneos', nombre: 'Torneos' },
    { id: 'ligas', nombre: 'Ligas' },
    { id: 'instalaciones', nombre: 'Instalaciones' },
    { id: 'eventos', nombre: 'Eventos Especiales' }
  ];

  // Imágenes de ejemplo (en un caso real, vendrían de una API/BD)
  const imagenes = [
    {
      id: 1,
      categoria: 'torneos',
      titulo: 'Final Torneo Verano 2023',
      fecha: '2023-08-15',
      url: 'https://via.placeholder.com/400x300',
      descripcion: 'Final del torneo de verano entre equipos A y B'
    },
    {
      id: 2,
      categoria: 'ligas',
      titulo: 'Primera División - Jornada 5',
      fecha: '2023-09-20',
      url: 'https://via.placeholder.com/400x300',
      descripcion: 'Partido decisivo de la liga regular'
    },
    {
      id: 3,
      categoria: 'instalaciones',
      titulo: 'Pista Central',
      fecha: '2023-07-01',
      url: 'https://via.placeholder.com/400x300',
      descripcion: 'Vista nocturna de nuestra pista principal'
    },
    // Añadir más imágenes según necesidad
  ];

  const imagenesFiltradas = filtroActivo === 'todos' 
    ? imagenes 
    : imagenes.filter(img => img.categoria === filtroActivo);

  const handleFiltroClick = (filtroId) => {
    // Si se hace clic en el filtro que ya está activo Y NO es 'todos'
    if (filtroId === filtroActivo && filtroId !== 'todos') {
      // Desactivarlo y volver a 'todos'
      setFiltroActivo('todos');
    } else {
      // Si no, simplemente activar el filtro clicado
      setFiltroActivo(filtroId);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Galería de Imágenes</h1>

          {/* Filtros */}
          <div className={styles.filtros}>
            {categorias.map(cat => (
              <button
                key={cat.id}
                className={`${styles.filtroBtn} ${filtroActivo === cat.id ? styles.activo : ''}`}
                onClick={() => handleFiltroClick(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Grid de imágenes */}
          <div 
            ref={gridRef} 
            className={`${styles.galeriaGrid} ${styles.sectionAnimate} ${isGridVisible ? styles.visible : ''}`}
          >
            {imagenesFiltradas.map(imagen => (
              <div 
                key={imagen.id} 
                className={styles.imagenContainer}
                onClick={() => setModalImage(imagen)}
              >
                <img 
                  src={imagen.url} 
                  alt={imagen.titulo}
                  className={styles.imagen}
                />
                <div className={styles.imagenInfo}>
                  <h3>{imagen.titulo}</h3>
                  <p>{new Date(imagen.fecha).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {modalImage && (
            <div 
              className={styles.modal}
              onClick={() => setModalImage(null)}
            >
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button 
                  className={styles.closeModal}
                  onClick={() => setModalImage(null)}
                >
                  ×
                </button>
                <img 
                  src={modalImage.url} 
                  alt={modalImage.titulo}
                  className={styles.modalImage}
                />
                <div className={styles.modalInfo}>
                  <h2>{modalImage.titulo}</h2>
                  <p className={styles.fecha}>
                    {new Date(modalImage.fecha).toLocaleDateString()}
                  </p>
                  <p className={styles.descripcion}>{modalImage.descripcion}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Galeria; 