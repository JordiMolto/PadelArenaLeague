import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../../services/supabase';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Proceso de login
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data) {
          navigate('/dashboard');
        }
      } else {
        // Proceso de registro
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        
        const { data, error } = await signUp(email, password);
        
        if (error) throw error;
        
        setSuccess('Registro exitoso. Por favor, verifica tu correo electrónico para confirmar tu cuenta.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(error.message || 'Ha ocurrido un error durante la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) throw error;
      
      // La redirección la maneja Supabase OAuth
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError(error.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className={styles.authSubtitle}>
            {isLogin 
              ? 'Accede a tu cuenta para gestionar tus ligas y partidos' 
              : 'Regístrate para comenzar a participar en ligas y torneos'}
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formInput}
              placeholder="tu@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
              placeholder="********"
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.formInput}
                placeholder="********"
              />
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading 
              ? 'Procesando...' 
              : isLogin 
                ? 'Iniciar Sesión' 
                : 'Registrarse'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>O</span>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleButton}
          disabled={loading}
        >
          Continuar con Google
        </button>

        <div className={styles.authToggle}>
          {isLogin ? (
            <p>
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={toggleAuthMode}
                className={styles.toggleButton}
              >
                Regístrate
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <button 
                onClick={toggleAuthMode}
                className={styles.toggleButton}
              >
                Inicia Sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 