import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { UserPlus, Home, AlertCircle, CheckCircle, Eye, EyeOff, User, Mail, Phone, Lock, Shield } from 'lucide-react';

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'user',
    terminos: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signUp, loading, error, clearError } = useAuthContext();
  const navigate = useNavigate();

  // Calcular fortaleza de la contraseña
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Calcular fortaleza si es el campo de contraseña
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');

    // Validaciones básicas del formulario
    if (formData.password !== formData.confirmPassword) {
      clearError(); // Usamos clearError para resetear cualquier error previo
      // Para mostrar este error, necesitaríamos una forma de setearlo
      return;
    }

    if (!formData.terminos) {
      return;
    }

    console.log('📝 Enviando datos de registro...');

    // Preparar datos para el servicio
    const userData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      rol: formData.rol,
      fecha_registro: new Date().toISOString()
    };

    // 🔥 USAMOS signUp DEL CONTEXTO
    const result = await signUp(userData);

    if (result.success) {
      console.log('✅ Registro exitoso!');
      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo al dashboard...');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } else {
      console.log('❌ Error en registro:', result.error);
    }
  };

  const handleDemoRegister = () => {
    // Datos de demo
    const demoData = {
      nombre: 'Carlos',
      apellido: 'Gómez',
      email: `demo${Date.now()}@lasurenita.com`,
      telefono: '+54 11 1234-5678',
      password: 'Demo123!',
      confirmPassword: 'Demo123!',
      rol: 'user',
      terminos: true
    };

    setFormData(demoData);
    setPasswordStrength(calculatePasswordStrength('Demo123!'));
  };

  // Niveles de fortaleza de contraseña
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Muy débil';
    if (passwordStrength === 2) return 'Débil';
    if (passwordStrength === 3) return 'Buena';
    return 'Excelente';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-800 flex flex-col items-center justify-center p-4">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Home className="w-12 h-12 text-white" />
          <h1 className="text-4xl font-bold text-white">Quinta La Sureñita</h1>
        </div>
        <p className="text-xl text-orange-100">Crear Cuenta de Administración</p>
      </div>
      
      {/* Tarjeta de registro */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-gray-600 mt-2">Registra una nueva cuenta para el sistema</p>
        </div>
        
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span className="font-medium">¡Éxito!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">{successMessage}</p>
          </div>
        )}
        
        {/* Mostrar errores */}
        {error && !successMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Ej: Juan"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Ej: Pérez"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="usuario@lasurenita.com"
              required
              disabled={loading}
            />
          </div>
          
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              placeholder="+54 11 1234-5678"
              disabled={loading}
            />
          </div>
          
          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-10"
                placeholder="Mínimo 8 caracteres"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Indicador de fortaleza */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Fortaleza:</span>
                  <span className="text-xs font-medium">
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Incluye mayúsculas, números y caracteres especiales para mayor seguridad
                </div>
              </div>
            )}
          </div>
          
          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition pr-10"
                placeholder="Repite tu contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Validación de coincidencia */}
            {formData.confirmPassword && (
              <div className="mt-2">
                {formData.password === formData.confirmPassword ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="text-xs text-red-600">
                    ✗ Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="inline w-4 h-4 mr-1" />
              Tipo de Usuario
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white"
              disabled={loading}
            >
              <option value="user">Usuario Regular</option>
              <option value="staff">Personal</option>
              <option value="admin">Administrador</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              * Solo usuarios administradores pueden crear otros administradores
            </p>
          </div>
          
          {/* Términos y condiciones */}
          <div className="flex items-start">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="terminos"
                name="terminos"
                checked={formData.terminos}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
                disabled={loading}
              />
            </div>
            <label htmlFor="terminos" className="ml-2 block text-sm text-gray-700">
              Acepto los{' '}
              <a href="/terminos" className="text-orange-600 hover:text-orange-500 hover:underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacidad" className="text-orange-600 hover:text-orange-500 hover:underline">
                política de privacidad
              </a>
            </label>
          </div>
          
          {/* Botón de registro */}
          <button
            type="submit"
            disabled={loading || !formData.terminos || formData.password !== formData.confirmPassword}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </>
            )}
          </button>
        </form>
        
        {/* Botón de demo */}
        <div className="mt-6">
          <button
            onClick={handleDemoRegister}
            disabled={loading}
            className="w-full py-2.5 border-2 border-orange-600 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition disabled:opacity-50 text-sm"
          >
            Usar datos de ejemplo
          </button>
        </div>
        
        {/* Enlaces */}
        <div className="mt-8 space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/admin/login" 
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
          
          <div className="text-center">
            <Link 
              to="/"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium inline-flex items-center gap-1 hover:underline"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-orange-100 text-sm">
          © {new Date().getFullYear()} Quinta La Sureñita. Sistema de gestión administrativa.
        </p>
      </div>
    </div>
  );
}