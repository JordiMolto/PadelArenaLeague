import React, { useState } from 'react';
import './FormularioModal.css'; // Reutilizamos los estilos comunes

const tiposDeIncidencia = [
  { valor: '', etiqueta: 'Selecciona un tipo de incidencia...' },
  { valor: 'rival_no_responde', etiqueta: 'Mi rival no responde' },
  { valor: 'rival_no_se_presento', etiqueta: 'Mi rival no se presentó (W.O.)' },
  { valor: 'problema_horario', etiqueta: 'Problemas para acordar horario' },
  { valor: 'otro', etiqueta: 'Otro (especificar en detalles)' },
];

function FormularioMarcarIncidencia({ onSubmit, onClose, partido }) {
  const [tipoIncidencia, setTipoIncidencia] = useState('');
  const [detallesIncidencia, setDetallesIncidencia] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tipoIncidencia) {
      alert('Por favor, selecciona un tipo de incidencia.');
      return;
    }
    if (tipoIncidencia === 'otro' && detallesIncidencia.trim() === '') {
      alert('Por favor, especifica los detalles para la incidencia de tipo \"Otro\".');
      return;
    }
    onSubmit({ 
      tipo: tipoIncidencia, 
      // Buscamos la etiqueta para usarla en el mensaje de sistema, por ejemplo
      etiquetaTipo: tiposDeIncidencia.find(t => t.valor === tipoIncidencia)?.etiqueta || tipoIncidencia,
      detalles: detallesIncidencia.trim() 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-modal">
      <p>Reportar una incidencia para el partido contra <strong>{partido.rival.nombre}</strong>.</p>
      
      <div className="campo-formulario">
        <label htmlFor="tipo-incidencia">Tipo de incidencia:</label>
        <select 
          id="tipo-incidencia" 
          value={tipoIncidencia} 
          onChange={(e) => setTipoIncidencia(e.target.value)} 
          required
        >
          {tiposDeIncidencia.map(opcion => (
            <option key={opcion.valor} value={opcion.valor} disabled={opcion.valor === ''}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="campo-formulario">
        <label htmlFor="detalles-incidencia">Detalles adicionales (opcional, obligatorio si es "Otro"):</label>
        <textarea 
          id="detalles-incidencia" 
          value={detallesIncidencia} 
          onChange={(e) => setDetallesIncidencia(e.target.value)} 
          rows="4"
        />
      </div>
      
      <div className="acciones-formulario">
        <button type="submit" className="boton-principal rojo">Marcar Incidencia</button> {/* Botón rojo para incidencia */}
        <button type="button" onClick={onClose} className="boton-secundario">Cancelar</button>
      </div>
    </form>
  );
}

export default FormularioMarcarIncidencia; 