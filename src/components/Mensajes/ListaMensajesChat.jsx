import React, { useEffect, useRef } from 'react';
import MensajeChat from './MensajeChat';
import './ListaMensajesChat.css';

function ListaMensajesChat({ mensajes, usuarioActualId = 'Tú' }) {
  const listaRef = useRef(null); // Ref para el contenedor de la lista

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [mensajes]); // Se ejecuta cada vez que cambian los mensajes

  if (!mensajes || mensajes.length === 0) {
    return <p className="no-mensajes-chat">No hay mensajes en esta conversación todavía.</p>;
  }

  return (
    <div className="lista-mensajes-chat-container" ref={listaRef}>
      {mensajes.map(mensaje => (
        <MensajeChat 
          key={mensaje.id} 
          mensaje={mensaje} 
          usuarioActualId={usuarioActualId} // Pasar el ID del usuario actual
        />
      ))}
    </div>
  );
}

export default ListaMensajesChat; 