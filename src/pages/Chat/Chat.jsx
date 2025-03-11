import { useState, useEffect, useRef } from 'react';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { 
  getMensajes, 
  enviarMensaje, 
  suscribirseAMensajes,
  supabase
} from '../../services/supabase';
import styles from './Chat.module.css';

const Chat = () => {
  const { user, loading } = useRequireAuth();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [contactos, setContactos] = useState([]);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const mensajesEndRef = useRef(null);

  // Cargar mensajes y contactos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) return;
      
      try {
        setChatLoading(true);
        
        // Cargar mensajes del usuario
        const { data, error } = await getMensajes(user.id);
        if (error) throw error;
        
        if (data) {
          setMensajes(data);
          
          // Extraer contactos únicos de los mensajes
          const contactosUnicos = new Set();
          data.forEach(mensaje => {
            if (mensaje.remitente_id !== user.id) {
              contactosUnicos.add(mensaje.remitente_id);
            }
            if (mensaje.destinatario_id !== user.id) {
              contactosUnicos.add(mensaje.destinatario_id);
            }
          });
          
          // Convertir a array y obtener detalles de los contactos
          const contactosArray = Array.from(contactosUnicos);
          
          // Aquí normalmente cargaríamos los detalles de los contactos desde la base de datos
          // Por ahora, usaremos IDs como nombres temporales
          setContactos(contactosArray.map(id => ({ id, nombre: `Usuario ${id.substring(0, 5)}` })));
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        setError('No se pudieron cargar los mensajes. Por favor, intenta de nuevo más tarde.');
      } finally {
        setChatLoading(false);
      }
    };

    if (user) {
      cargarDatos();
    }
  }, [user]);

  // Suscribirse a nuevos mensajes
  useEffect(() => {
    if (!user) return;
    
    // Suscribirse a cambios en mensajes
    const subscription = suscribirseAMensajes(user.id, (payload) => {
      const nuevoMensaje = payload.new;
      setMensajes(mensajesAnteriores => [...mensajesAnteriores, nuevoMensaje]);
      
      // Actualizar contactos si es necesario
      const nuevoContactoId = nuevoMensaje.remitente_id === user.id 
        ? nuevoMensaje.destinatario_id 
        : nuevoMensaje.remitente_id;
      
      setContactos(contactosAnteriores => {
        if (!contactosAnteriores.some(c => c.id === nuevoContactoId)) {
          return [...contactosAnteriores, { id: nuevoContactoId, nombre: `Usuario ${nuevoContactoId.substring(0, 5)}` }];
        }
        return contactosAnteriores;
      });
    });
    
    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Scroll al último mensaje
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    
    if (!nuevoMensaje.trim() || !contactoSeleccionado) return;
    
    try {
      const { error } = await enviarMensaje(
        user.id,
        contactoSeleccionado.id,
        nuevoMensaje
      );
      
      if (error) throw error;
      
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setError('No se pudo enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  const handleSeleccionarContacto = (contacto) => {
    setContactoSeleccionado(contacto);
  };

  const handleNuevoChat = async () => {
    if (!destinatario.trim()) return;
    
    try {
      // En una aplicación real, buscaríamos el usuario por email o nombre
      // Por ahora, simularemos crear un contacto con el texto ingresado
      const nuevoContacto = { id: `temp-${Date.now()}`, nombre: destinatario };
      
      setContactos([...contactos, nuevoContacto]);
      setContactoSeleccionado(nuevoContacto);
      setDestinatario('');
    } catch (error) {
      console.error('Error al crear nuevo chat:', error);
      setError('No se pudo crear el chat. Por favor, intenta de nuevo.');
    }
  };

  const filtrarMensajesDeContacto = () => {
    if (!contactoSeleccionado) return [];
    
    return mensajes.filter(mensaje => 
      (mensaje.remitente_id === user.id && mensaje.destinatario_id === contactoSeleccionado.id) ||
      (mensaje.remitente_id === contactoSeleccionado.id && mensaje.destinatario_id === user.id)
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  if (loading || chatLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.container}>
        <h1 className={styles.chatTitle}>Mensajes</h1>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.chatLayout}>
          {/* Sidebar de contactos */}
          <div className={styles.contactosSidebar}>
            <div className={styles.nuevoChat}>
              <input
                type="text"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="Buscar o iniciar nuevo chat"
                className={styles.destinatarioInput}
              />
              <button 
                onClick={handleNuevoChat}
                className={styles.nuevoChatButton}
                disabled={!destinatario.trim()}
              >
                +
              </button>
            </div>
            
            <div className={styles.contactosList}>
              {contactos.length > 0 ? (
                contactos.map(contacto => (
                  <div 
                    key={contacto.id}
                    className={`${styles.contactoItem} ${contactoSeleccionado?.id === contacto.id ? styles.active : ''}`}
                    onClick={() => handleSeleccionarContacto(contacto)}
                  >
                    <div className={styles.contactoAvatar}>
                      {contacto.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.contactoInfo}>
                      <span className={styles.contactoNombre}>{contacto.nombre}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyMessage}>
                  No tienes conversaciones activas. Inicia un nuevo chat.
                </p>
              )}
            </div>
          </div>
          
          {/* Área de chat */}
          <div className={styles.chatArea}>
            {contactoSeleccionado ? (
              <>
                <div className={styles.chatHeader}>
                  <div className={styles.contactoAvatar}>
                    {contactoSeleccionado.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.contactoNombre}>{contactoSeleccionado.nombre}</span>
                </div>
                
                <div className={styles.mensajesContainer}>
                  {filtrarMensajesDeContacto().length > 0 ? (
                    filtrarMensajesDeContacto().map(mensaje => (
                      <div 
                        key={mensaje.id}
                        className={`${styles.mensajeItem} ${mensaje.remitente_id === user.id ? styles.enviado : styles.recibido}`}
                      >
                        <div className={styles.mensajeContenido}>
                          {mensaje.contenido}
                        </div>
                        <div className={styles.mensajeFecha}>
                          {new Date(mensaje.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyMessage}>
                      No hay mensajes. ¡Envía el primero!
                    </p>
                  )}
                  <div ref={mensajesEndRef} />
                </div>
                
                <form onSubmit={handleEnviarMensaje} className={styles.mensajeForm}>
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className={styles.mensajeInput}
                  />
                  <button 
                    type="submit"
                    className={styles.enviarButton}
                    disabled={!nuevoMensaje.trim()}
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.chatPlaceholder}>
                <p>Selecciona un contacto para comenzar a chatear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 