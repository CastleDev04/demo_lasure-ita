import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * 1. CREAR EL CONTEXTO (la caja vacía)
 */
const AuthContext = createContext();

/**
 * 2. HOOK para usar el contexto
 * Ejemplo de uso en componentes:
 * const { user, signIn } = useAuthContext();
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      '❌ useAuthContext debe usarse dentro de un AuthProvider. ' +
      'Envuelve tu app con <AuthProvider> en App.jsx'
    );
  }
  
  return context;
};

/**
 * 3. PROVIDER que envuelve la aplicación
 * Pone los valores de autenticación en el contexto
 */
export const AuthProvider = ({ children }) => {
  // Usamos nuestro hook useAuth que creamos antes
  const auth = useAuth();
  
  console.log('🔧 AuthProvider montado. Usuario:', auth.user?.email || 'No autenticado');
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 4. COMPONENTE para mostrar estado de autenticación (opcional, para debug)
 */
export const AuthStatus = () => {
  const { user, loading, isAuthenticated } = useAuthContext();
  
  if (loading) {
    return (
      <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
        🔄 Cargando...
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    return (
      <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
        ✅ {user.email} ({user.rol})
      </div>
    );
  }
  
  return (
    <div className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">
      ❌ No autenticado
    </div>
  );
};