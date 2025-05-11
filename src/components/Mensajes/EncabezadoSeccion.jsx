import React from 'react';
import './EncabezadoSeccion.css';

function EncabezadoSeccion({ titulo, subtitulo }) {
  return (
    <div className="encabezado-seccion">
      <h1>{titulo}</h1>
      {subtitulo && <p>{subtitulo}</p>}
    </div>
  );
}

export default EncabezadoSeccion; 