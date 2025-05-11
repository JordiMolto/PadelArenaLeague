import React from 'react';
import './TarjetaPartido.css';

const IconoAlerta = () => <span className="icono-alerta">❗</span>;

function TarjetaPartido({ partido, onAbrirChat }) {
  const {
    id,
    rival,
    jornada,
    estado,
    ultimoMensaje,
    esUrgente,
  } = partido;

  const claseEstado = `estado-${estado.toLowerCase().replace(/\s+/g, '-')}`;

  const handleAbrirChatClick = () => {
    if (onAbrirChat) {
      onAbrirChat(id); // Pasamos el ID del partido al callback
    }
  };

  return (
    <div className={`tarjeta-partido ${esUrgente ? 'urgente' : ''}`} onClick={handleAbrirChatClick}>
      <div className="tarjeta-partido-info">
        <div className="info-principal">
          <span className="rival">🆚 {rival.nombre}</span>
          <span className="jornada">📅 Jornada {jornada}</span>
        </div>
        <div className={`estado-partido ${claseEstado}`}>
          <span>🕓 {estado}</span>
        </div>
        {ultimoMensaje && ( // Solo mostrar si hay un último mensaje
          <div className="ultimo-mensaje">
            <p>{ultimoMensaje.textoPreview}</p>
          </div>
        )}
      </div>
      <div className="tarjeta-partido-acciones">
        {/* Se ha hecho toda la tarjeta clickeable, el botón explícito "Abrir Chat" se podría re-añadir si se prefiere */}
        {esUrgente && estado !== 'Finalizado' && <IconoAlerta />}
      </div>
    </div>
  );
}

export default TarjetaPartido; 