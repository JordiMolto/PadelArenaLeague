import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './EncabezadoChat.css';

const MILISEGUNDOS_EN_24_HORAS = 24 * 60 * 60 * 1000;

const esMenosDe24HorasYActivo = (fechaLimiteStr, estado) => {
  if (!fechaLimiteStr || estado === 'Finalizado' || estado === 'Incidencia Reportada') {
    return false;
  }
  const ahora = new Date();
  const fechaLimite = new Date(fechaLimiteStr);
  return (fechaLimite.getTime() - ahora.getTime()) < MILISEGUNDOS_EN_24_HORAS && fechaLimite > ahora;
};

function EncabezadoChat({ partido, onVolver, usuarioActualId }) {
  if (!partido) return null;

  const { rival, jornada, fechaLimite, estado } = partido;
  const mostrarAlerta24h = esMenosDe24HorasYActivo(fechaLimite, estado);

  // Formatear la fecha límite para mostrarla
  let fechaLimiteFormateada = 'No definida';
  if (fechaLimite) {
    try {
      fechaLimiteFormateada = new Date(fechaLimite).toLocaleDateString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
      });
      fechaLimiteFormateada = fechaLimiteFormateada.charAt(0).toUpperCase() + fechaLimiteFormateada.slice(1);
    } catch (error) {
      console.error("Error formateando fechaLimite:", error);
      // Mantener 'No definida' o un mensaje de error si la fecha no es válida
    }
  }

  return (
    <div className="encabezado-chat-container">
      <button onClick={onVolver} className="boton-volver-chat">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="info-partido-chat">
        <h3>{rival.nombre}</h3>
        <p>
          Jornada {jornada} | Estado: {estado} | Límite: {fechaLimiteFormateada}
          {mostrarAlerta24h && (
            <span className="alerta-24h" title="¡Quedan menos de 24 horas para la fecha límite!">
              <FontAwesomeIcon icon={faExclamationTriangle} /> ¡Menos de 24h!
            </span>
          )}
        </p>
      </div>
      {/* Podríamos añadir un avatar o más info del rival aquí */}
    </div>
  );
}

export default EncabezadoChat; 