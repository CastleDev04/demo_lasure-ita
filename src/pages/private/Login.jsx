import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LogIn, Home, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  // 🔥 USAMOS NUESTRO CONTEXTO EN LUGAR DE PROPS
  const { signIn, loading, error, clearError } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    clearError(); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    console.log('🔐 Intentando login...');
    
    // 🔥 USAMOS signIn DEL CONTEXTO
    const result = await signIn(credentials.email, credentials.password);

    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...');
      
      // Redirigir al dashboard
      navigate('/admin');
    } else {
      console.log('❌ Login fallido:', result.error);
      // El error ya está en el contexto
    }
  };

  const handleDemoLogin = async () => {
    clearError();
    
    // Credenciales de demo
    const demoEmail = 'admin@alquiler.com';
    const demoPassword = 'password123';
    
    setCredentials({
      email: demoEmail,
      password: demoPassword
    });
    
    // Esperar un momento para que se vean las credenciales
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 🔥 USAR signIn DEL CONTEXTO
    const result = await signIn(demoEmail, demoPassword);
    
    if (result.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex flex-col items-center justify-center p-4">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Home className="w-12 h-12 text-white" />
          <h1 className="text-4xl font-bold text-white">Alquiler</h1>
        </div>
        <p className="text-xl text-orange-100">Sistema de Administración</p>
      </div>
      
      {/* Tarjeta de login */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder</p>
        </div>
        
        {/* 🔥 MOSTRAR ERRORES DEL CONTEXTO */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="font-medium">Error de autenticación</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="admin@lasurenita.com"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            
            <button
              type="button"
              onClick={() => {/* TODO: forgot password */}}
              className="text-sm text-orange-600 hover:text-orange-500 disabled:text-gray-400"
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verificando...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
        
        {/* Botón de demo */}
        <div className="mt-6">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition disabled:opacity-50"
          >
            Probar con Credenciales de Demo
          </button>
        </div>
        
        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Credenciales de demostración:</strong><br />
            Email: admin@alquiler.com<br />
            Contraseña: password123
          </p>
        </div>

        {/* Volver al sitio público */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium inline-flex items-center gap-1"
          >
            ← Volver al sitio público
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-orange-100">© {new Date().getFullYear()} Alquiler. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}