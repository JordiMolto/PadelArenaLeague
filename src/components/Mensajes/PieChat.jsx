import React, { useState } from 'react';
import './PieChat.css';

function PieChat({ onEnviarMensaje, idPartido }) {
  const [textoMensaje, setTextoMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página
    if (textoMensaje.trim() === '') return; // No enviar mensajes vacíos

    // En una app real, onEnviarMensaje se comunicaría con un backend o un gestor de estado
    if (onEnviarMensaje) {
      onEnviarMensaje(idPartido, textoMensaje); 
    }
    setTextoMensaje(''); // Limpiar el campo de texto después de enviar
  };

  const handleInputChange = (e) => {
    setTextoMensaje(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Permitir enviar con Enter (Shift+Enter para nueva línea se maneja por defecto en textarea)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Evitar nueva línea por defecto si no es con Shift
      handleSubmit(e);
    }
  };

  return (
    <form className="pie-chat-container" onSubmit={handleSubmit}>
      <textarea
        className="campo-texto-mensaje"
        value={textoMensaje}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Para enviar con Enter
        placeholder="Escribe tu mensaje aquí..."
        rows="2" // Empezar con 2 filas, podría crecer con CSS si es necesario
      />
      <button type="submit" className="boton-enviar-mensaje">
        Enviar
        {/* Podríamos usar un icono aquí en lugar de texto, ej: <i className="fa fa-paper-plane"></i> */}
      </button>
    </form>
  );
}

export default PieChat; 