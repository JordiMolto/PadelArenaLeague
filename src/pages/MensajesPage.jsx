import React, { useState, useEffect } from 'react';
import EncabezadoSeccion from '../components/Mensajes/EncabezadoSeccion';
import ListaPartidos from '../components/Mensajes/ListaPartidos';
import AreaConversacion from '../components/Mensajes/AreaConversacion';
import ModalGenerico from '../components/Modales/ModalGenerico'; // Importamos ModalGenerico
import FormularioProponerHorario from '../components/Modales/FormularioProponerHorario'; // Importamos el formulario
import FormularioSubirResultado from '../components/Modales/FormularioSubirResultado'; // Importamos el formulario
import FormularioMarcarIncidencia from '../components/Modales/FormularioMarcarIncidencia'; // Importamos el formulario
// import FormularioMarcarIncidencia from '../components/Modales/FormularioMarcarIncidencia';
import './MensajesPage.css';

// Función helper para calcular si un partido es urgente
const MILISEGUNDOS_EN_48_HORAS = 48 * 60 * 60 * 1000;

const calcularEsUrgente = (partido) => {
  if (!partido.fechaLimite || partido.estado === 'Finalizado' || partido.estado === 'Incidencia Reportada') {
    return false;
  }
  const ahora = new Date();
  const fechaLimite = new Date(partido.fechaLimite);
  return (fechaLimite.getTime() - ahora.getTime()) < MILISEGUNDOS_EN_48_HORAS && fechaLimite > ahora;
};

// Datos de ejemplo (simulando una llamada a API)
let partidosDeEjemplo = [
  {
    id: 'partido1',
    rival: { id: 'rival1', nombre: 'Carlos Pérez' },
    jornada: 5,
    estado: 'Pendiente Confirmación Tuya', // Rival subió, esperas tú
    ultimoMensaje: { textoPreview: 'Carlos ha subido el resultado. ¿Confirmas?', emisor: 'Sistema' },
    fechaLimite: new Date(Date.now() + MILISEGUNDOS_EN_48_HORAS / 2).toISOString(),
    mensajes: [
      { id: 'm0', texto: 'Carlos Pérez ha subido el resultado: 6-2, 6-3. Por favor, confírmalo o dispútalo.', tipo: 'sistema', timestamp: new Date(Date.now() - 100000).toISOString() },
      { id: 'm1', texto: 'Hola, ¿te va bien el sábado por la mañana?', emisor: 'Carlos Pérez', timestamp: '2024-05-10T10:00:00Z', tipo: 'rival' },
      { id: 'm2', texto: 'Sí, perfecto. A las 10h en PadelPoint?', emisor: 'Tú', timestamp: '2024-05-10T10:05:00Z', tipo: 'propio' },
    ],
    resultado: { 
      sets: [{j1: 2, j2: 6}, {j1: 3, j2: 6}], // OJO: j1 es rival, j2 es Tú (porque subió Carlos)
      comentarios: 'Buen partido, Carlos.',
      subidoPor: 'rival1', // ID de Carlos Pérez
      confirmadoPor: null
    }
  },
  {
    id: 'partido2', // Ya finalizado y confirmado (no hacemos nada más aquí)
    rival: { id: 'rival2', nombre: 'Ana Gómez' },
    jornada: 5,
    estado: 'Finalizado',
    ultimoMensaje: { textoPreview: '¡Buen partido! Resultado 6-3, 6-4.', emisor: 'Tú' },
    fechaLimite: new Date(Date.now() - MILISEGUNDOS_EN_48_HORAS * 2).toISOString(),
    mensajes: [
      { id: 'm3', texto: '¡Buen partido! Resultado 6-3, 6-4.', emisor: 'Tú', timestamp: '2024-05-11T12:00:00Z', tipo: 'propio' },
      { id: 'm4', texto: 'Igualmente, ¡un placer!', emisor: 'Ana Gómez', timestamp: '2024-05-11T12:01:00Z', tipo: 'rival' },
    ],
    resultado: { 
      sets: [{j1: 6, j2: 3}, {j1: 6, j2: 4}], // j1 es Tú, j2 es Ana (porque subiste Tú)
      comentarios: 'Partido muy disputado.', 
      subidoPor: 'Tú', // ID_USUARIO_ACTUAL
      confirmadoPor: 'rival2' // Confirmado por Ana
    }
  },
  {
    id: 'partido3', // Reprogramado (no hacemos nada más aquí)
    rival: { id: 'rival3', nombre: 'Lucía Martín' },
    jornada: 4,
    estado: 'Reprogramado',
    ultimoMensaje: { textoPreview: 'Confirmado para el próximo martes entonces.', emisor: 'Lucía Martín' },
    fechaLimite: new Date(Date.now() + MILISEGUNDOS_EN_48_HORAS * 3).toISOString(),
    mensajes: [],
    resultado: null
  },
  {
    id: 'partido4', // Pendiente, para que subas tú primero el resultado
    rival: { id: 'rival4', nombre: 'Pedro Jimenez' },
    jornada: 6,
    estado: 'Pendiente',
    ultimoMensaje: { textoPreview: '¿Jugamos mañana?', emisor: 'Pedro Jimenez' },
    fechaLimite: new Date(Date.now() + MILISEGUNDOS_EN_48_HORAS / 4).toISOString(),
    mensajes: [],
    resultado: null // Aún sin resultado subido
  },
];

// Asignar esUrgente dinámicamente
partidosDeEjemplo = partidosDeEjemplo.map(p => ({...p, esUrgente: calcularEsUrgente(p)}));

// Asumimos que tienes una forma de identificar al usuario actual
const ID_USUARIO_ACTUAL = "Tú"; // Esto debería venir de tu sistema de autenticación
const NOMBRES_USUARIOS = { // Para mapear ID a nombre en mensajes de sistema si es necesario
    "Tú": "Tú",
    "rival1": "Carlos Pérez",
    "rival2": "Ana Gómez",
    "rival3": "Lucía Martín",
    "rival4": "Pedro Jimenez"
};

export const TIPOS_MODAL = {
  NINGUNO: null,
  PROPONER_HORARIO: 'proponerHorario',
  SUBIR_RESULTADO: 'subirResultado',
  MARCAR_INCIDENCIA: 'marcarIncidencia',
};

function MensajesPage() {
  const [partidos, setPartidos] = useState([]);
  const [partidoSeleccionadoId, setPartidoSeleccionadoId] = useState(null);
  const [modalActivo, setModalActivo] = useState(TIPOS_MODAL.NINGUNO);

  useEffect(() => {
    // Simular carga de datos y calcular urgencia
    const partidosConUrgencia = partidosDeEjemplo.map(p => ({
      ...p, 
      esUrgente: calcularEsUrgente(p)
    }));
    setPartidos(partidosConUrgencia);
  }, []);

  const handleSeleccionarPartido = (idPartido) => {
    setPartidoSeleccionadoId(idPartido);
  };

  const handleVolverALista = () => {
    setPartidoSeleccionadoId(null);
    cerrarModal(); // También cerramos cualquier modal abierto al volver a la lista
  };

  const abrirModal = (tipoModal) => setModalActivo(tipoModal);
  const cerrarModal = () => setModalActivo(TIPOS_MODAL.NINGUNO);

  const handleEnviarMensaje = (idPartido, textoMensaje) => {
    setPartidos(partidosActuales => 
      partidosActuales.map(p => {
        if (p.id === idPartido) {
          const nuevoMensaje = { id: `m${Date.now()}`, texto: textoMensaje, emisor: ID_USUARIO_ACTUAL, timestamp: new Date().toISOString(), tipo: 'propio' };
          // Recalcular urgencia podría ser necesario si el estado cambia, pero aquí no cambia
          return { ...p, mensajes: [...(p.mensajes || []), nuevoMensaje], ultimoMensaje: { textoPreview: textoMensaje, emisor: ID_USUARIO_ACTUAL }};
        }
        return p;
      }).map(p => ({...p, esUrgente: calcularEsUrgente(p)})) // Asegurar que esUrgente se recalcula si algo cambiase
    );
    // Aquí también se haría la llamada a la API para guardar el mensaje en el backend
    console.log(`Mensaje enviado al partido ${idPartido}: ${textoMensaje}`);
  };

  const handleProponerHorario = (idPartido, datosHorario) => {
    const textoSistema = `${NOMBRES_USUARIOS[ID_USUARIO_ACTUAL]} ha propuesto jugar el ${datosHorario.dia} a las ${datosHorario.hora}.`;
    setPartidos(partidosActuales => 
      partidosActuales.map(p => {
        if (p.id === idPartido) {
          const mensajeSistema = { id: `ms${Date.now()}`, texto: textoSistema, timestamp: new Date().toISOString(), tipo: 'sistema' };
          return { ...p, mensajes: [...(p.mensajes || []), mensajeSistema], ultimoMensaje: {textoPreview: textoSistema, emisor: 'Sistema'}};
        }
        return p;
      }).map(p => ({...p, esUrgente: calcularEsUrgente(p)}))
    );
    console.log('Propuesta de horario enviada:', idPartido, datosHorario);
    cerrarModal();
  };

  const handleSubirResultado = (idPartido, datosResultadoForm) => {
    // 'datosResultadoForm' viene de TU formulario, así que j1 es TU puntuación y j2 es la del RIVAL
    setPartidos(partidosActuales => partidosActuales.map(p => {
      if (p.id === idPartido) {
        const nombreSubidoPor = NOMBRES_USUARIOS[ID_USUARIO_ACTUAL];
        const textoSistema = `${nombreSubidoPor} ha subido el resultado: ${datosResultadoForm.sets.map(s => `${s.j1}-${s.j2}`).join(', ')}. Pendiente de confirmación por ${p.rival.nombre}.`;
        return {
          ...p,
          estado: 'Pendiente Confirmación Rival',
          resultado: {
            ...datosResultadoForm,
            subidoPor: ID_USUARIO_ACTUAL,
            confirmadoPor: null // Aún no confirmado
          },
          ultimoMensaje: { textoPreview: `Resultado subido por ti. Esperando a ${p.rival.nombre}.`, emisor: 'Sistema' },
          mensajes: [...(p.mensajes || []), { id: `ms${Date.now()}`, texto: textoSistema, timestamp: new Date().toISOString(), tipo: 'sistema' }]
        };
      }
      return p;
    }).map(p => ({ ...p, esUrgente: calcularEsUrgente(p) }))
    );
    cerrarModal();
  };

  const handleConfirmarResultado = (idPartido) => {
    setPartidos(partidosActuales => partidosActuales.map(p => {
      if (p.id === idPartido && p.resultado && p.resultado.subidoPor !== ID_USUARIO_ACTUAL) { // Asegurarse que el rival subió
        const nombreRival = NOMBRES_USUARIOS[p.resultado.subidoPor] || "El rival";
        const textoSistema = `Resultado confirmado por ${NOMBRES_USUARIOS[ID_USUARIO_ACTUAL]}. Partido finalizado.`;
        return {
          ...p,
          estado: 'Finalizado',
          resultado: {
            ...p.resultado,
            confirmadoPor: ID_USUARIO_ACTUAL
          },
          ultimoMensaje: { textoPreview: `Resultado confirmado. ¡Partido finalizado!`, emisor: 'Sistema' },
          mensajes: [...(p.mensajes || []), { id: `ms${Date.now()}`, texto: textoSistema, timestamp: new Date().toISOString(), tipo: 'sistema' }]
        };
      }
      return p;
    }).map(p => ({ ...p, esUrgente: calcularEsUrgente(p) }))
    );
    cerrarModal(); // Cierra el modal de subir resultado que ahora actúa como confirmación
  };

  const handleDisputarResultado = (idPartido, motivo) => {
    // Aquí, 'motivo' podría ser un string simple o un objeto más complejo si tuvieras un formulario para disputar
    setPartidos(partidosActuales => partidosActuales.map(p => {
      if (p.id === idPartido && p.resultado && p.resultado.subidoPor !== ID_USUARIO_ACTUAL) {
        const nombreRival = NOMBRES_USUARIOS[p.resultado.subidoPor] || "El rival";
        const textoSistema = `${NOMBRES_USUARIOS[ID_USUARIO_ACTUAL]} ha disputado el resultado subido por ${nombreRival}. Motivo: ${motivo || 'No especificado'}. La organización revisará el caso.`;
        return {
          ...p,
          estado: 'Resultado Disputado', // Nuevo estado
          // Podrías querer guardar quien disputó y el motivo en 'p.incidencia' o similar
          incidencia: {
            tipo: 'disputa_resultado',
            detalles: `Resultado subido por ${nombreRival} (${p.resultado.sets.map(s => `${s.j1}-${s.j2}`).join(', ')}) disputado. Motivo: ${motivo || 'No especificado'}`,
            reportadoPor: ID_USUARIO_ACTUAL
          },
          ultimoMensaje: { textoPreview: `Has disputado el resultado. La organización revisará el caso.`, emisor: 'Sistema' },
          mensajes: [...(p.mensajes || []), { id: `ms${Date.now()}`, texto: textoSistema, timestamp: new Date().toISOString(), tipo: 'sistema' }]
        };
      }
      return p;
    }).map(p => ({ ...p, esUrgente: calcularEsUrgente(p) }))
    );
    cerrarModal(); // Cierra el modal
    // Aquí podrías abrir un nuevo modal para detalles de la disputa si es necesario, o navegar a otra sección.
    console.log(`Resultado disputado para el partido ${idPartido}. Motivo: ${motivo}`);
  };

  const handleMarcarIncidencia = (idPartido, datosIncidencia) => {
    const nombreReporta = NOMBRES_USUARIOS[ID_USUARIO_ACTUAL];
    const textoSistema = `${nombreReporta} ha reportado una incidencia: ${datosIncidencia.etiquetaTipo}${datosIncidencia.detalles ? ' - ' + datosIncidencia.detalles : ''}.`;
    setPartidos(partidosActuales => partidosActuales.map(p => 
      p.id === idPartido ? { 
        ...p, 
        estado: 'Incidencia Reportada',
        incidencia: { ...datosIncidencia, reportadoPor: ID_USUARIO_ACTUAL },
        ultimoMensaje: { textoPreview: `Incidencia: ${datosIncidencia.etiquetaTipo}`, emisor: 'Sistema'},
        mensajes: [...(p.mensajes || []), {id: `ms${Date.now()}`, texto: textoSistema, timestamp: new Date().toISOString(), tipo: 'sistema'}]
      } : p
    ).map(p => ({...p, esUrgente: calcularEsUrgente(p)}))
    );
    cerrarModal();
  };

  const partidoActivo = partidoSeleccionadoId 
    ? partidos.find(p => p.id === partidoSeleccionadoId) 
    : null;

  let contenidoEspecificoModal = null;
  let tituloModal = '';

  if (partidoActivo && modalActivo !== TIPOS_MODAL.NINGUNO) {
    switch (modalActivo) {
      case TIPOS_MODAL.PROPONER_HORARIO:
        tituloModal = 'Proponer Nuevo Horario';
        contenidoEspecificoModal = <FormularioProponerHorario 
                                      onSubmit={(datos) => handleProponerHorario(partidoActivo.id, datos)} 
                                      onClose={cerrarModal} 
                                    />;
        break;
      case TIPOS_MODAL.SUBIR_RESULTADO:
        if (partidoActivo.estado === 'Pendiente Confirmación Rival') {
            tituloModal = 'Resultado Subido';
            contenidoEspecificoModal = (
                <div>
                    <p>Has subido el resultado para este partido. Esperando confirmación de {partidoActivo.rival.nombre}.</p>
                    <div className="acciones-formulario">
                        <button type="button" onClick={cerrarModal} className="boton-secundario">Cerrar</button>
                    </div>
                </div>
            );
        } else {
            tituloModal = 'Subir o Confirmar Resultado'; 
            contenidoEspecificoModal = <FormularioSubirResultado 
                                        onSubmit={(datos) => handleSubirResultado(partidoActivo.id, datos)} 
                                        onConfirmar={() => handleConfirmarResultado(partidoActivo.id)}
                                        onDisputar={(motivo) => handleDisputarResultado(partidoActivo.id, motivo || 'Desacuerdo con el resultado')}
                                        onClose={cerrarModal} 
                                        partido={partidoActivo} 
                                        usuarioActualId={ID_USUARIO_ACTUAL}
                                      />;
        }
        break;
      case TIPOS_MODAL.MARCAR_INCIDENCIA:
        tituloModal = 'Marcar Incidencia en el Partido';
        contenidoEspecificoModal = <FormularioMarcarIncidencia 
                                      onSubmit={(datos) => handleMarcarIncidencia(partidoActivo.id, datos)} 
                                      onClose={cerrarModal} 
                                      partido={partidoActivo} 
                                    />;
        break;
      default:
        break;
    }
  }

  return (
    <div className="mensajes-page-container">
      <EncabezadoSeccion 
        titulo="Mis partidos de esta semana"
        subtitulo="Coordina tus partidos desde aquí y sube el resultado antes del domingo a las 23:59."
      />
      {partidoActivo && !modalActivo ? (
        // Mostramos AreaConversacion solo si hay partido activo Y no hay modal activo
        // Esto es una opción, podrías querer mostrar el modal encima del chat también
        <AreaConversacion 
          partido={partidoActivo} 
          onVolverALista={handleVolverALista}
          usuarioActualId={ID_USUARIO_ACTUAL}
          onEnviarMensaje={handleEnviarMensaje}
          onAbrirModalProponerHorario={() => abrirModal(TIPOS_MODAL.PROPONER_HORARIO)}
          onAbrirModalSubirResultado={() => abrirModal(TIPOS_MODAL.SUBIR_RESULTADO)}
          onAbrirModalMarcarIncidencia={() => abrirModal(TIPOS_MODAL.MARCAR_INCIDENCIA)}
        />
      ) : !partidoActivo && !modalActivo ? (
        // Si no hay partido seleccionado Y no hay modal, muestra la lista
        <ListaPartidos 
          partidos={partidos} 
          onSeleccionarPartido={handleSeleccionarPartido} 
        />
      ) : null /* Aquí es donde el modal se renderizaría, o si el chat se mantiene debajo */}

      {modalActivo !== TIPOS_MODAL.NINGUNO && partidoActivo && (
        <ModalGenerico titulo={tituloModal} onClose={cerrarModal}>
          {contenidoEspecificoModal}
        </ModalGenerico>
      )}
    </div>
  );
}

export default MensajesPage; 