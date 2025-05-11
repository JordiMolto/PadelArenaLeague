import React, { useState } from 'react';
import './FormularioModal.css'; // Reutilizamos los estilos comunes

// Definimos NOMBRES_USUARIOS aquí también o lo pasamos como prop si es necesario para mensajes más detallados.
// Por simplicidad, asumimos que partido.rival.nombre es suficiente.

function FormularioSubirResultado({ onSubmit, onClose, onConfirmar, onDisputar, partido, usuarioActualId }) {
  // Asumimos un partido a 2 sets por simplicidad, podría ser a 3.
  const [set1Jugador1, setSet1Jugador1] = useState('');
  const [set1Jugador2, setSet1Jugador2] = useState('');
  const [set2Jugador1, setSet2Jugador1] = useState('');
  const [set2Jugador2, setSet2Jugador2] = useState('');
  // const [set3Jugador1, setSet3Jugador1] = useState(''); // Opcional para tercer set
  // const [set3Jugador2, setSet3Jugador2] = useState(''); // Opcional para tercer set
  const [comentarios, setComentarios] = useState('');
  const [motivoDisputa, setMotivoDisputa] = useState(''); // Para el textarea de disputa
  const [mostrandoDisputa, setMostrandoDisputa] = useState(false);

  // Lógica para determinar si el rival ya subió el resultado (simplificada)
  // En una app real, el objeto 'partido' tendría esta información más claramente.
  const resultadoRival = partido.resultado && partido.resultado.subidoPor !== usuarioActualId ? partido.resultado : null;
  const yoSubiResultado = partido.resultado && partido.resultado.subidoPor === usuarioActualId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resultadoRival) { // No debería llegar aquí si el rival subió, pero por si acaso.
        alert("Error: El rival ya ha subido un resultado. Debes confirmar o disputar.");
        return;
    }
    if (set1Jugador1 === '' || set1Jugador2 === '' || set2Jugador1 === '' || set2Jugador2 === '') {
      alert('Por favor, introduce el resultado de los dos primeros sets.');
      return;
    }
    onSubmit({ 
      sets: [
        { j1: parseInt(set1Jugador1), j2: parseInt(set1Jugador2) }, // j1 es TÚ, j2 es RIVAL
        { j1: parseInt(set2Jugador1), j2: parseInt(set2Jugador2) },
      ],
      comentarios: comentarios.trim(),
    });
  };

  const handleConfirmarClick = () => {
    onConfirmar();
  };

  const handleDisputarClick = () => {
    if (!motivoDisputa.trim() && mostrandoDisputa) {
        alert("Por favor, introduce un motivo para la disputa.");
        return;
    }
    if (mostrandoDisputa) {
        onDisputar(motivoDisputa);
    } else {
        setMostrandoDisputa(true);
    }
  };

  // Vista: Si el rival ha subido un resultado y está pendiente de tu confirmación
  if (partido.estado === 'Pendiente Confirmación Tuya' && resultadoRival) {
    // El resultadoRival.sets[X].j1 es la puntuación del JUGADOR QUE SUBIÓ (el rival)
    // El resultadoRival.sets[X].j2 es la puntuación del OTRO JUGADOR (tú)
    return (
      <div className="formulario-modal">
        <h4>Confirmar Resultado Subido por {partido.rival.nombre}</h4>
        <p><strong>{partido.rival.nombre}</strong> ha reportado el siguiente resultado:</p>
        <div className="resultado-rival-info">
          <p>Set 1: {resultadoRival.sets[0].j1} (Rival) - {resultadoRival.sets[0].j2} (Tú)</p>
          <p>Set 2: {resultadoRival.sets[1].j1} (Rival) - {resultadoRival.sets[1].j2} (Tú)</p>
          {/* Añadir lógica para tercer set si existe en resultadoRival.sets[2] */}
          {resultadoRival.comentarios && <p>Comentarios del rival: <em>"{resultadoRival.comentarios}"</em></p>}
        </div>

        {mostrandoDisputa && (
          <div className="campo-formulario disputa-campo">
            <label htmlFor="motivo-disputa">Motivo de la disputa:</label>
            <textarea 
              id="motivo-disputa"
              value={motivoDisputa}
              onChange={(e) => setMotivoDisputa(e.target.value)}
              rows="3"
              placeholder="Ej: El resultado del primer set no es correcto."
              required
            />
          </div>
        )}

        <div className="acciones-formulario">
          {!mostrandoDisputa && <button type="button" onClick={handleConfirmarClick} className="boton-principal verde">Confirmar Resultado</button>}
          <button type="button" onClick={handleDisputarClick} className="boton-principal rojo"> 
            {mostrandoDisputa ? 'Enviar Disputa' : 'Disputar Resultado'}
          </button>
          <button type="button" onClick={onClose} className="boton-secundario">{mostrandoDisputa ? 'Cancelar Disputa' : 'Cancelar'}</button>
        </div>
      </div>
    );
  }

  // Vista: Si TÚ ya subiste el resultado y está pendiente del rival (esto se maneja en MensajesPage, pero como fallback)
  if (partido.estado === 'Pendiente Confirmación Rival' && yoSubiResultado) {
      return (
          <div className="formulario-modal">
              <h4>Resultado Enviado</h4>
              <p>Has subido el resultado para este partido. Esperando confirmación de {partido.rival.nombre}.</p>
              <p>
                Resultado reportado: <br />
                Set 1: {partido.resultado.sets[0].j1} (Tú) - {partido.resultado.sets[0].j2} ({partido.rival.nombre}) <br />
                Set 2: {partido.resultado.sets[1].j1} (Tú) - {partido.resultado.sets[1].j2} ({partido.rival.nombre})
              </p>
              {partido.resultado.comentarios && <p>Tus comentarios: "{partido.resultado.comentarios}"</p>}
              <div className="acciones-formulario">
                  <button type="button" onClick={onClose} className="boton-secundario">Cerrar</button>
              </div>
          </div>
      );
  }
  
  // Vista: Formulario para subir resultado por primera vez (estado 'Pendiente' o similar)
  return (
    <form onSubmit={handleSubmit} className="formulario-modal">
      <p>Introduce el resultado del partido contra <strong>{partido.rival.nombre}</strong>.</p>
      <p className="ayuda-texto"><em>Introduce tu puntuación en el primer campo de cada set.</em></p>
      <fieldset className="set-resultado">
        <legend>Set 1</legend>
        <div className="campo-set">
          <input type="number" min="0" max="20" placeholder="Tú" value={set1Jugador1} onChange={(e) => setSet1Jugador1(e.target.value)} required />
          <span>-</span>
          <input type="number" min="0" max="20" placeholder={partido.rival.nombre} value={set1Jugador2} onChange={(e) => setSet1Jugador2(e.target.value)} required />
        </div>
      </fieldset>

      <fieldset className="set-resultado">
        <legend>Set 2</legend>
        <div className="campo-set">
          <input type="number" min="0" max="20" placeholder="Tú" value={set2Jugador1} onChange={(e) => setSet2Jugador1(e.target.value)} required />
          <span>-</span>
          <input type="number" min="0" max="20" placeholder={partido.rival.nombre} value={set2Jugador2} onChange={(e) => setSet2Jugador2(e.target.value)} required />
        </div>
      </fieldset>

      {/* Aquí podrías añadir un fieldset para un tercer set opcional */}

      <div className="campo-formulario">
        <label htmlFor="comentarios-resultado">Comentarios (opcional):</label>
        <textarea 
          id="comentarios-resultado" 
          value={comentarios} 
          onChange={(e) => setComentarios(e.target.value)} 
          rows="3"
        />
      </div>
      
      <div className="acciones-formulario">
        <button type="submit" className="boton-principal">Subir Resultado</button>
        <button type="button" onClick={onClose} className="boton-secundario">Cancelar</button>
      </div>
    </form>
  );
}

export default FormularioSubirResultado; 