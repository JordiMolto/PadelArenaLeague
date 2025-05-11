import React from 'react';
import EncabezadoChat from './EncabezadoChat';
import ListaMensajesChat from './ListaMensajesChat';
import PieChat from './PieChat';
import HerramientasChat from './HerramientasChat';
import './AreaConversacion.css';

function AreaConversacion({ 
  partido, 
  onVolverALista, 
  usuarioActualId = 'Tú', 
  onEnviarMensaje,
  onAbrirModalProponerHorario,
  onAbrirModalSubirResultado,
  onAbrirModalMarcarIncidencia
}) {
  if (!partido) {
    // Esto no debería ocurrir si la lógica en MensajesPage es correcta,
    // pero es una buena salvaguarda.
    return <div className="area-conversacion-vacia">Selecciona un partido para ver la conversación.</div>;
  }

  return (
    <div className="area-conversacion-container">
      <EncabezadoChat partido={partido} />
      <button onClick={onVolverALista} className="boton-volver-lista-flotante">
        &larr; Volver
      </button>
      
      <HerramientasChat 
        partido={partido} 
        onProponerHorario={onAbrirModalProponerHorario}
        onSubirResultado={onAbrirModalSubirResultado}
        onMarcarIncidencia={onAbrirModalMarcarIncidencia}
      />
      
      <ListaMensajesChat 
        mensajes={partido.mensajes || []} 
        usuarioActualId={usuarioActualId}
      />
      
      {/* <p>(Herramientas y campo para escribir mensaje irán aquí)</p> */}
      {/* 
      <EncabezadoChat partido={partido} />
      <HerramientasChat partido={partido} /> 
      */}
      
      <PieChat 
        idPartido={partido.id} 
        onEnviarMensaje={onEnviarMensaje}
      />
    </div>
  );
}

export default AreaConversacion; 