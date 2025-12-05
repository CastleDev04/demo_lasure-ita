import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Home } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de validación con timeout
    setTimeout(() => {
      // Credenciales de prueba
      const validCredentials = [
        { email: 'admin@lasurenita.com', password: 'password123' },
        { email: 'admin@quintalasurenita.com', password: 'password123' }
      ];

      const isValid = validCredentials.some(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (isValid) {
        // Llama a la función onLogin del padre
        onLogin();
        // Redirige al dashboard
        navigate('/admin');
      } else {
        setError('Credenciales incorrectas. Por favor, intente de nuevo.');
      }
      setLoading(false);
    }, 1000); // Simula un delay de red
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex flex-col items-center justify-center p-4">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Home className="w-12 h-12 text-white" />
          <h1 className="text-4xl font-bold text-white">Quinta La Sureñita</h1>
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
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-medium">Error de autenticación</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        
        {/* Formulario CON onSubmit */}
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
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            
            <a href="#" className="text-sm text-orange-600 hover:text-orange-500">
              ¿Olvidaste tu contraseña?
            </a>
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
        
        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600 text-center">
            <strong>Credenciales de demostración:</strong><br />
            Email: admin@lasurenita.com<br />
            Contraseña: password123
          </p>
        </div>

        {/* Volver al sitio público */}
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium inline-flex items-center gap-1"
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-orange-100">© {new Date().getFullYear()} Quinta La Sureñita. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}