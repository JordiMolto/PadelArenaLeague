import React from 'react';
import './HerramientasChat.css';

function HerramientasChat({ partido, onProponerHorario, onSubirResultado, onMarcarIncidencia }) {
  // Podríamos deshabilitar botones según el estado del partido
  // const { estado } = partido;
  // const partidoFinalizado = estado === 'Finalizado';

  return (
    <div className="herramientas-chat-container">
      <button 
        onClick={onProponerHorario}
        className="boton-herramienta morado"
        // disabled={partidoFinalizado} // Ejemplo de deshabilitar si el partido está finalizado
      >
        📅 Proponer Horario
      </button>
      <button 
        onClick={onSubirResultado} 
        className="boton-herramienta morado"
        // disabled={partidoFinalizado} // Ejemplo
      >
        ✅ Subir Resultado
      </button>
      <button 
        onClick={onMarcarIncidencia} 
        className="boton-herramienta rojo"
        // disabled={partidoFinalizado} // Ejemplo
      >
        ❌ Marcar Incidencia
      </button>
    </div>
  );
}

export default HerramientasChat; 