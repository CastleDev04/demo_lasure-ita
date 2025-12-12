import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/ServiceFactory';

/**
 * Hook personalizado para manejar autenticación
 * Úsalo en cualquier componente para:
 * - Saber si el usuario está logueado
 * - Hacer login/logout
 * - Obtener datos del usuario
 */
export const useAuth = () => {
  // Estado local del hook
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar usuario al iniciar
   */
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      console.log('👤 Usuario cargado:', currentUser ? currentUser.email : 'No autenticado');
    } catch (err) {
      console.error('❌ Error cargando usuario:', err);
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuario cuando el componente se monta
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Iniciar sesión
   */
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Intentando login para:', email);
      const result = await authService.signIn(email, password);
      
      setUser(result.user);
      console.log('✅ Login exitoso');
      
      return { 
        success: true, 
        data: result,
        user: result.user 
      };
    } catch (err) {
      console.error('❌ Error en login:', err.message);
      setError(err.message);
      setUser(null);
      
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar nuevo usuario
   */
  const signUp = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📝 Registrando usuario:', userData.email);
      const result = await authService.signUp(userData);
      
      setUser(result.user);
      console.log('✅ Registro exitoso');
      
      return { 
        success: true, 
        data: result,
        user: result.user 
      };
    } catch (err) {
      console.error('❌ Error en registro:', err.message);
      setError(err.message);
      
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚪 Cerrando sesión...');
      await authService.signOut();
      
      setUser(null);
      console.log('✅ Sesión cerrada');
      
      return { success: true };
    } catch (err) {
      console.error('❌ Error cerrando sesión:', err.message);
      setError(err.message);
      
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recuperar contraseña
   */
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Solicitando recuperación para:', email);
      const result = await authService.resetPassword(email);
      
      console.log('✅ Solicitud enviada');
      return { success: true, data: result };
    } catch (err) {
      console.error('❌ Error en recuperación:', err.message);
      setError(err.message);
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Devolver todo lo que el componente necesita
  return {
    // Estado
    user,
    loading,
    error,
    
    // Acciones
    signIn,
    signUp,
    signOut,
    resetPassword,
    reloadUser: loadUser,
    
    // Helpers
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    getUserRole: () => user?.rol || null,
    
    // Para limpiar errores manualmente
    clearError: () => setError(null)
  };
};