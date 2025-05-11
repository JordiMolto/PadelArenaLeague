import React from 'react';
import './MensajeChat.css';

function MensajeChat({ mensaje, usuarioActualId = 'Tú' }) { // Asumimos un ID/nombre para el usuario actual
  if (!mensaje) return null;

  const { texto, emisor, timestamp, tipo } = mensaje;

  // Determinar si el mensaje es del usuario actual
  // En una app real, compararíamos con el ID del usuario logueado
  const esPropio = tipo === 'propio' || emisor === usuarioActualId; 
  const esSistema = tipo === 'sistema';

  const claseMensaje = esPropio ? 'propio' : (esSistema ? 'sistema' : 'rival');

  // Formatear el timestamp (puedes mejorar esto o usar una librería)
  const formatearTimestamp = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`mensaje-chat-wrapper ${claseMensaje}`}>
      <div className="mensaje-chat-burbuja">
        {!esPropio && !esSistema && <div className="mensaje-emisor">{emisor}</div>}
        <p className="mensaje-texto">{texto}</p>
        <div className="mensaje-timestamp">{formatearTimestamp(timestamp)}</div>
      </div>
    </div>
  );
}

export default MensajeChat; 