import React from 'react';
import './ModalGenerico.css';

function ModalGenerico({ titulo, onClose, children }) {
  // Evitar que el clic dentro del contenido del modal lo cierre
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Cierra al hacer clic en el overlay */}
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button onClick={onClose} className="modal-close-button">
            &times; {/* Icono de X para cerrar */}
          </button>
        </div>
        <div className="modal-body">
          {children} {/* Aquí se renderizará el contenido específico del modal */}
        </div>
      </div>
    </div>
  );
}

export default ModalGenerico; 