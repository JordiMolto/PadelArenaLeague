import React, { useState } from 'react';
import './FormularioModal.css'; // Usaremos un CSS común para los formularios de modales

function FormularioProponerHorario({ onSubmit, onClose }) {
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dia || !hora) {
      alert('Por favor, selecciona un día y una hora.');
      return;
    }
    onSubmit({ dia, hora }); 
    // onClose(); // El cierre del modal se maneja en MensajesPage después del submit
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-modal">
      <div className="campo-formulario">
        <label htmlFor="dia-propuesto">Día:</label>
        <input 
          type="date" 
          id="dia-propuesto" 
          value={dia} 
          onChange={(e) => setDia(e.target.value)} 
          required 
        />
      </div>
      <div className="campo-formulario">
        <label htmlFor="hora-propuesta">Hora:</label>
        <input 
          type="time" 
          id="hora-propuesta" 
          value={hora} 
          onChange={(e) => setHora(e.target.value)} 
          required 
        />
      </div>
      <div className="acciones-formulario">
        <button type="submit" className="boton-principal">Proponer Horario</button>
        <button type="button" onClick={onClose} className="boton-secundario">Cancelar</button>
      </div>
    </form>
  );
}

export default FormularioProponerHorario; 