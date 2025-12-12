import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

/**
 * Componente que protege rutas
 * Si el usuario no está autenticado, redirige a /login
 * Si requiere admin y no es admin, redirige a /
 */
export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}) {
  const { user, loading, isAuthenticated, isAdmin } = useAuthContext();
  const location = useLocation();
  
  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    console.log('🛑 Ruta protegida: No autenticado, redirigiendo a login');
    
    // Guardar la ubicación a la que intentaba acceder
    const from = location.pathname + location.search;
    localStorage.setItem('redirectAfterLogin', from);
    
    return <Navigate to={redirectTo} replace />;
  }
  
  // Si requiere admin pero no es admin
  if (requireAdmin && !isAdmin) {
    console.log('🛑 Ruta protegida: No es admin, acceso denegado');
    return <Navigate to="/" replace />;
  }
  
  // Si pasa todas las verificaciones, renderizar el children
  console.log('✅ Ruta protegida: Acceso permitido para', user?.email);
  return children;
}

/**
 * Versión específica para rutas de admin
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
}

/**
 * Versión para rutas que solo deben verse si NO está autenticado
 * Ejemplo: /login, /register
 */
export function GuestRoute({ children, redirectTo = '/' }) {
  const { isAuthenticated, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    console.log('🛑 Ruta de invitado: Ya autenticado, redirigiendo');
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
}