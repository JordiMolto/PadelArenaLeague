import React, { useState } from 'react';
import styles from './Noticias.module.css';

const Noticias = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo (en un caso real, vendrían de una API/BD)
  const categorias = [
    { id: 'todas', nombre: 'Todas' },
    { id: 'torneos', nombre: 'Torneos' },
    { id: 'ligas', nombre: 'Ligas' },
    { id: 'entrevistas', nombre: 'Entrevistas' },
    { id: 'equipamiento', nombre: 'Equipamiento' }
  ];

  const noticias = [
    {
      id: 1,
      titulo: 'Gran Final del Torneo de Verano 2024',
      extracto: 'La pareja formada por García/Martínez se proclama campeona en un emocionante partido.',
      categoria: 'torneos',
      imagen: 'https://via.placeholder.com/800x400',
      autor: 'Juan Pérez',
      fecha: '2024-03-15',
      tiempoLectura: 5,
      destacada: true
    },
    {
      id: 2,
      titulo: 'Entrevista Exclusiva: Los Secretos del Éxito',
      extracto: 'Conversamos con los campeones sobre su preparación y estrategias.',
      categoria: 'entrevistas',
      imagen: 'https://via.placeholder.com/400x300',
      autor: 'María López',
      fecha: '2024-03-14',
      tiempoLectura: 8,
      destacada: false
    },
    {
      id: 3,
      titulo: 'Nueva Liga Amateur Arranca en Abril',
      extracto: 'Abierto el plazo de inscripción para la liga de primavera.',
      categoria: 'ligas',
      imagen: 'https://via.placeholder.com/400x300',
      autor: 'Carlos Ruiz',
      fecha: '2024-03-13',
      tiempoLectura: 3,
      destacada: false
    },
    // Más noticias...
  ];

  const noticiasFiltradas = noticias
    .filter(noticia => 
      (categoriaActiva === 'todas' || noticia.categoria === categoriaActiva) &&
      (noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
       noticia.extracto.toLowerCase().includes(busqueda.toLowerCase()))
    );

  const noticiasDestacadas = noticiasFiltradas.filter(n => n.destacada);
  const noticiasRegulares = noticiasFiltradas.filter(n => !n.destacada);

  const handleCategoriaClick = (categoriaId) => {
    // Si se hace clic en la categoría que ya está activa Y NO es 'todas'
    if (categoriaId === categoriaActiva && categoriaId !== 'todas') {
      // Desactivarla y volver a 'todas'
      setCategoriaActiva('todas');
    } else {
      // Si no, simplemente activar la categoría clicada
      setCategoriaActiva(categoriaId);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <h1 className={styles.profileTitle}>Noticias</h1>

          {/* Buscador y Filtros */}
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar noticias..."
                className={styles.searchInput}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className={styles.categorias}>
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  className={`${styles.categoriaBtn} ${categoriaActiva === cat.id ? styles.activo : ''}`}
                  onClick={() => handleCategoriaClick(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Noticias Destacadas */}
          {noticiasDestacadas.length > 0 && (
            <section className={styles.destacadas}>
              {noticiasDestacadas.map(noticia => (
                <article key={noticia.id} className={styles.noticiaDestacada}>
                  <div className={styles.imagenDestacada}>
                    <img src={noticia.imagen} alt={noticia.titulo} />
                  </div>
                  <div className={styles.contenidoDestacado}>
                    <span className={styles.categoria}>{categorias.find(c => c.id === noticia.categoria)?.nombre}</span>
                    <h2>{noticia.titulo}</h2>
                    <p>{noticia.extracto}</p>
                    <div className={styles.meta}>
                      <span>{noticia.autor}</span>
                      <span>•</span>
                      <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{noticia.tiempoLectura} min de lectura</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Grid de Noticias */}
          <section className={styles.noticiasGrid}>
            {noticiasRegulares.map(noticia => (
              <article key={noticia.id} className={styles.noticiaCard}>
                <div className={styles.imagenNoticia}>
                  <img src={noticia.imagen} alt={noticia.titulo} />
                </div>
                <div className={styles.contenidoNoticia}>
                  <span className={styles.categoria}>{categorias.find(c => c.id === noticia.categoria)?.nombre}</span>
                  <h3>{noticia.titulo}</h3>
                  <p>{noticia.extracto}</p>
                  <div className={styles.meta}>
                    <span>{noticia.autor}</span>
                    <span>•</span>
                    <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{noticia.tiempoLectura} min de lectura</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {noticiasFiltradas.length === 0 && (
            <div className={styles.noResults}>
              <p>No se encontraron noticias que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Noticias; 