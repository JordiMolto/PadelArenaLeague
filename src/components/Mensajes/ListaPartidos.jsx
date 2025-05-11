import React from 'react';
import TarjetaPartido from './TarjetaPartido';
import './ListaPartidos.css';

function ListaPartidos({ partidos, onSeleccionarPartido }) {
  if (!partidos || partidos.length === 0) {
    return <p className="no-partidos-mensaje">No tienes partidos programados esta semana.</p>;
  }

  const partidosOrdenados = [...partidos].sort((a, b) => {
    // Prioridad 1: Estados Finalizado o Incidencia Reportada van al final
    const esEstadoFinalA = a.estado === 'Finalizado' || a.estado === 'Incidencia Reportada' || a.estado === 'Resultado Disputado';
    const esEstadoFinalB = b.estado === 'Finalizado' || b.estado === 'Incidencia Reportada' || b.estado === 'Resultado Disputado';

    if (esEstadoFinalA && !esEstadoFinalB) return 1;
    if (!esEstadoFinalA && esEstadoFinalB) return -1;
    if (esEstadoFinalA && esEstadoFinalB) { 
      return new Date(b.fechaLimite) - new Date(a.fechaLimite);
    }

    // Prioridad 2: Partidos con estados que requieren acción (Pendiente Confirmación Tuya)
    const requiereAccionA = a.estado === 'Pendiente Confirmación Tuya';
    const requiereAccionB = b.estado === 'Pendiente Confirmación Tuya';
    if (requiereAccionA && !requiereAccionB) return -1;
    if (!requiereAccionA && requiereAccionB) return 1;

    // Prioridad 3: Urgencia (esUrgente)
    if (a.esUrgente && !b.esUrgente) return -1;
    if (!a.esUrgente && b.esUrgente) return 1;

    // Prioridad 4: Fecha límite (más próxima primero)
    const fechaA = a.fechaLimite ? new Date(a.fechaLimite).getTime() : Infinity;
    const fechaB = b.fechaLimite ? new Date(b.fechaLimite).getTime() : Infinity;
    
    if (fechaA !== Infinity && fechaB !== Infinity) {
        if (fechaA < fechaB) return -1;
        if (fechaA > fechaB) return 1;
    }
    if (fechaA !== Infinity && fechaB === Infinity) return -1;
    if (fechaA === Infinity && fechaB !== Infinity) return 1;

    return a.id.localeCompare(b.id);
  });

  return (
    <div className="lista-partidos-container">
      {partidosOrdenados.map(partido => (
        <TarjetaPartido 
          key={partido.id} 
          partido={partido} 
          onAbrirChat={onSeleccionarPartido}
        />
      ))}
    </div>
  );
}

export default ListaPartidos; 