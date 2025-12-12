// src/pages/private/Servicios.jsx
import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Filter, Download,
  Edit, Trash2, CheckCircle, XCircle,
  Search, Loader2, AlertCircle, ChevronLeft,
  ChevronRight, DollarSign, Clock, Users,
  BarChart3, TrendingUp, Activity
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { serviciosService } from '../../services/ServiceFactory';

// Componente Modal para formularios de Servicios
const ServicioModal = ({
  isOpen,
  onClose,
  onSubmit,
  servicio,
  loading
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo_calculo: 'fijo',
    duracion_horas: 1,
    activo: true
  });

  // Inicializar formulario
  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        precio: servicio.precio || 0,
        tipo_calculo: servicio.tipo_calculo || 'fijo',
        duracion_horas: servicio.duracion_horas || 1,
        activo: servicio.activo !== false
      });
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) || 0 : 
               value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <p className="text-gray-600 mt-1">
              {servicio ? `Servicio: ${servicio.nombre}` : 'Complete todos los campos requeridos'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ej: Catering Premium, Fotografía Profesional..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Descripción detallada del servicio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cálculo *
                </label>
                <select
                  name="tipo_calculo"
                  value={formData.tipo_calculo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="fijo">Precio Fijo</option>
                  <option value="por_persona">Por Persona</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (horas)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="duracion_horas"
                    value={formData.duracion_horas}
                    onChange={handleChange}
                    min="1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                    Servicio Activo
                  </label>
                </div>
              </div>
            </div>

            {/* Preview del servicio */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Vista Previa</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Nombre:</span>
                  <span className="font-semibold">{formData.nombre || '(Sin nombre)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Precio:</span>
                  <span className="font-bold text-blue-600">
                    ${formData.precio.toLocaleString()}
                    {formData.tipo_calculo === 'por_persona' && ' por persona'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Duración:</span>
                  <span className="font-medium">{formData.duracion_horas} horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {formData.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.nombre || formData.precio <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  {servicio ? 'Actualizar Servicio' : 'Crear Servicio'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Modal para confirmar eliminación
const ConfirmarEliminarModal = ({
  isOpen,
  onClose,
  onConfirm,
  servicio,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
            ¿Eliminar Servicio?
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Esta acción eliminará permanentemente el servicio 
            <span className="font-semibold text-gray-900"> "{servicio?.nombre}"</span>.
            Esta acción no se puede deshacer.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Advertencia</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Si este servicio está siendo usado en reservas activas, podría afectar los cálculos.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Sí, eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function AdminServicios() {
  const { user } = useAuthContext();
  
  // Estados principales
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [populares, setPopulares] = useState([]);
  
  // Estados para formularios
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    search: '',
    activo: 'todos',
    tipo_calculo: '',
    precio_min: '',
    precio_max: ''
  });
  
  // Paginación
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    porPagina: 10,
    total: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar servicios
      const datosServicios = await serviciosService.getAllServicios(filtros);
      setServicios(datosServicios);
      
      // Cargar estadísticas
      const stats = await serviciosService.getEstadisticas();
      setEstadisticas(stats);
      
      // Cargar servicios populares
      const pop = await serviciosService.getServiciosMasPopulares();
      setPopulares(pop);
      
      // Actualizar paginación
      setPaginacion(prev => ({
        ...prev,
        total: datosServicios.length
      }));
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en filtros
  const handleFiltroChange = (key, value) => {
  setFiltros(prev => ({
    ...prev,
    [key]: value
  }));
  setPaginacion(prev => ({ ...prev, pagina: 1 }));
};

  // Abrir modal para crear servicio
  const abrirModalCrear = () => {
    setServicioSeleccionado(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar servicio
  const abrirModalEditar = (servicio) => {
    setServicioSeleccionado(servicio);
    setModalAbierto(true);
  };

  // Abrir modal para eliminar servicio
  const abrirModalEliminar = (servicio) => {
    setServicioAEliminar(servicio);
    setModalEliminarAbierto(true);
  };

  // Manejar envío del formulario (crear/editar)
  const handleSubmitServicio = async (formData) => {
    try {
      setFormLoading(true);
      
      let resultado;
      
      if (servicioSeleccionado) {
        // Actualizar servicio existente
        resultado = await serviciosService.updateServicio(servicioSeleccionado.id, formData);
        alert(`✅ Servicio "${resultado.nombre}" actualizado exitosamente`);
      } else {
        // Crear nuevo servicio
        resultado = await serviciosService.createServicio(formData);
        alert(`✅ Servicio "${resultado.nombre}" creado exitosamente`);
      }
      
      // Cerrar modal y recargar datos
      setModalAbierto(false);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error guardando servicio:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Manejar eliminación de servicio
  const handleEliminarServicio = async () => {
    if (!servicioAEliminar) return;
    
    try {
      setFormLoading(true);
      
      await serviciosService.deleteServicio(servicioAEliminar.id);
      
      alert(`✅ Servicio "${servicioAEliminar.nombre}" eliminado exitosamente`);
      
      // Cerrar modal y recargar datos
      setModalEliminarAbierto(false);
      setServicioAEliminar(null);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error eliminando servicio:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de servicio (activo/inactivo)
  const handleCambiarEstado = async (id, activoActual) => {
    const nuevoEstado = !activoActual;
    
    try {
      await serviciosService.cambiarEstadoServicio(id, nuevoEstado);
      await cargarDatos();
      alert(`✅ Estado cambiado a ${nuevoEstado ? 'activo' : 'inactivo'}`);
    } catch (err) {
      console.error('❌ Error cambiando estado:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Exportar a CSV
  const handleExportar = () => {
    try {
      const csvContent = [
        ['Nombre', 'Descripción', 'Precio', 'Tipo Cálculo', 'Duración (horas)', 'Estado', 'Fecha Creación'],
        ...servicios.map(s => [
          s.nombre,
          s.descripcion || 'N/A',
          s.precio,
          s.tipo_calculo,
          s.duracion_horas || 'N/A',
          s.activo ? 'Activo' : 'Inactivo',
          new Date(s.fecha_creacion).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `servicios_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('✅ Archivo CSV exportado exitosamente');
    } catch (err) {
      console.error('❌ Error exportando:', err);
      alert('Error al exportar archivo');
    }
  };

  // Tipos de cálculo para filtros
  const tiposCalculo = [
    { value: '', label: 'Todos los tipos' },
    { value: 'fijo', label: 'Precio Fijo' },
    { value: 'por_persona', label: 'Por Persona' }
  ];

  const estados = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Inactivos' }
  ];

  // Calcular servicios paginados
  const inicio = (paginacion.pagina - 1) * paginacion.porPagina;
  const fin = inicio + paginacion.porPagina;
  const serviciosPagina = servicios.slice(inicio, fin);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-2">
            {estadisticas ? `${estadisticas.total} servicios disponibles` : 'Cargando...'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={loading || servicios.length === 0}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={abrirModalCrear}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Mostrar error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button 
            onClick={cargarDatos}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Total Servicios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.activos} activos • {estadisticas.inactivos} inactivos
                </p>
              </div>
              <Package className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Precio Promedio</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${estadisticas.precio_promedio.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.por_tipo.fijo || 0} fijos • {estadisticas.por_tipo.por_persona || 0} por persona
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold">Tasa de Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.tasa_activos}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round(estadisticas.activos / (estadisticas.total || 1) * 100)}% del catálogo
                </p>
              </div>
              <Activity className="w-10 h-10 text-orange-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-semibold">Servicios Populares</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{populares.length}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Más solicitados
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filtros.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select 
              value={filtros.activo}
              onChange={(e) => handleFiltroChange('activo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {estados.map((estado, index) => (
                <option key={index} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo de cálculo */}
          <div>
            <select 
              value={filtros.tipo_calculo}
              onChange={(e) => handleFiltroChange('tipo_calculo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {tiposCalculo.map((tipo, index) => (
                <option key={index} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtros de precio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={filtros.precio_min}
              onChange={(e) => handleFiltroChange('precio_min', e.target.value)}
              placeholder="Precio mínimo"
              min="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
          </div>
          
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={filtros.precio_max}
              onChange={(e) => handleFiltroChange('precio_max', e.target.value)}
              placeholder="Precio máximo"
              min="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
          </div>
          
          <button 
            onClick={() => setFiltros({
              search: '',
              activo: 'todos',
              tipo_calculo: '',
              precio_min: '',
              precio_max: ''
            })}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando servicios...</p>
          </div>
        ) : servicios.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No hay servicios registrados</p>
            <button 
              onClick={abrirModalCrear}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Crear primer servicio
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Nombre</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Descripción</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Precio</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Tipo</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Duración</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {serviciosPagina.map((servicio) => (
                    <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{servicio.nombre}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {servicio.id}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700 max-w-xs truncate">
                          {servicio.descripcion || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">
                          ${parseFloat(servicio.precio || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          servicio.tipo_calculo === 'por_persona' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {servicio.tipo_calculo === 'por_persona' ? 'Por Persona' : 'Precio Fijo'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Clock className="w-4 h-4" />
                          {servicio.duracion_horas || 'N/A'} horas
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleCambiarEstado(servicio.id, servicio.activo)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                            servicio.activo
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-sm'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-sm'
                          }`}
                          title="Click para cambiar estado"
                        >
                          {servicio.activo ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactivo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => abrirModalEditar(servicio)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => abrirModalEliminar(servicio)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {inicio + 1}-{Math.min(fin, paginacion.total)} de {paginacion.total} servicios
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina - 1 }))}
                  disabled={paginacion.pagina === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Página {paginacion.pagina}
                </span>
                <button 
                  onClick={() => setPaginacion(prev => ({ ...prev, pagina: prev.pagina + 1 }))}
                  disabled={fin >= paginacion.total}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal para crear/editar servicio */}
      <ServicioModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmitServicio}
        servicio={servicioSeleccionado}
        loading={formLoading}
      />

      {/* Modal para confirmar eliminación */}
      <ConfirmarEliminarModal
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarServicio}
        servicio={servicioAEliminar}
        loading={formLoading}
      />
    </div>
  );
}