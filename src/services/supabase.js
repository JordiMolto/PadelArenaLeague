import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funciones de autenticación
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Funciones para ligas y torneos
export const getLigas = async () => {
  const { data, error } = await supabase
    .from('ligas')
    .select('*');
  return { data, error };
};

export const getTorneos = async () => {
  const { data, error } = await supabase
    .from('torneos')
    .select('*');
  return { data, error };
};

// Funciones para partidos
export const getPartidos = async (userId) => {
  const { data, error } = await supabase
    .from('partidos')
    .select('*')
    .or(`jugador1_id.eq.${userId},jugador2_id.eq.${userId}`);
  return { data, error };
};

export const actualizarResultado = async (partidoId, resultado) => {
  const { data, error } = await supabase
    .from('partidos')
    .update({ resultado })
    .eq('id', partidoId);
  return { data, error };
};

// Funciones para mensajería
export const enviarMensaje = async (remitente_id, destinatario_id, contenido) => {
  const { data, error } = await supabase
    .from('mensajes')
    .insert([
      { remitente_id, destinatario_id, contenido }
    ]);
  return { data, error };
};

export const getMensajes = async (userId) => {
  const { data, error } = await supabase
    .from('mensajes')
    .select('*')
    .or(`remitente_id.eq.${userId},destinatario_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Suscripción a mensajes en tiempo real
export const suscribirseAMensajes = (userId, callback) => {
  return supabase
    .channel('mensajes-cambios')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mensajes',
      filter: `remitente_id=eq.${userId}`,
    }, callback)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mensajes',
      filter: `destinatario_id=eq.${userId}`,
    }, callback)
    .subscribe();
};

// Funciones para perfil de usuario
export const actualizarPerfil = async (userId, datos) => {
  const { data, error } = await supabase
    .from('perfiles')
    .update(datos)
    .eq('id', userId);
  return { data, error };
};

export const getPerfil = async (userId) => {
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}; 