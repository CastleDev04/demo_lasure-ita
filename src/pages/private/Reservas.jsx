// src/pages/private/Reservas.jsx - VERSION COMPLETA CON FORMULARIOS
import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Filter, Download, 
  Eye, Edit, Trash2, CheckCircle,
  Clock, XCircle, Search, Loader2,
  AlertCircle, ChevronLeft, ChevronRight,
  User, Phone, Mail, Users, DollarSign,
  X, Save, Clock as ClockIcon, MapPin
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { reservasService } from '../../services/ServiceFactory';

// Componente Modal para formularios
const ReservaModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reserva, 
  clientes,
  servicios,
  loading 
}) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo_evento: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '19:00',
    personas: 1,
    lugar: '',
    total: 0,
    pagado: false,
    anticipo: 0,
    detalles: '',
    estado: 'pendiente',
    servicios_seleccionados: []
  });

  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [totalCalculado, setTotalCalculado] = useState(0);

  // Inicializar formulario con datos de reserva si está en modo edición
  useEffect(() => {
    if (reserva) {
      setFormData({
        cliente_id: reserva.cliente_id || '',
        tipo_evento: reserva.tipo_evento || '',
        fecha: reserva.fecha ? reserva.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
        hora: reserva.hora || '19:00',
        personas: reserva.personas || 1,
        lugar: reserva.lugar || '',
        total: reserva.total || 0,
        pagado: reserva.pagado || false,
        anticipo: reserva.anticipo || 0,
        detalles: reserva.detalles || '',
        estado: reserva.estado || 'pendiente',
        servicios_seleccionados: reserva.servicios?.map(s => s.servicio_id) || []
      });
      setTotalCalculado(reserva.total || 0);
    }
  }, [reserva]);

  // Cargar servicios disponibles
  useEffect(() => {
    if (servicios && servicios.length > 0) {
      setServiciosDisponibles(servicios);
    }
  }, [servicios]);

  // Calcular total cuando cambian servicios seleccionados o número de personas
  useEffect(() => {
    calcularTotal();
  }, [formData.servicios_seleccionados, formData.personas]);

  const calcularTotal = () => {
    let total = 0;
    
    // Sumar servicios seleccionados
    formData.servicios_seleccionados.forEach(servicioId => {
      const servicio = serviciosDisponibles.find(s => s.id === servicioId);
      if (servicio) {
        // Si el servicio es por persona, multiplicar por número de personas
        if (servicio.tipo_calculo === 'por_persona') {
          total += (servicio.precio * formData.personas);
        } else {
          total += servicio.precio;
        }
      }
    });

    // Aplicar descuento por cantidad de personas
    if (formData.personas > 100) {
      total *= 0.9; // 10% descuento para más de 100 personas
    } else if (formData.personas > 50) {
      total *= 0.95; // 5% descuento para más de 50 personas
    }

    setTotalCalculado(Math.round(total));
    setFormData(prev => ({ ...prev, total: Math.round(total) }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServicioChange = (servicioId) => {
    setFormData(prev => {
      const servicios = [...prev.servicios_seleccionados];
      const index = servicios.indexOf(servicioId);
      
      if (index > -1) {
        servicios.splice(index, 1);
      } else {
        servicios.push(servicioId);
      }
      
      return { ...prev, servicios_seleccionados: servicios };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {reserva ? 'Editar Reserva' : 'Nueva Reserva'}
            </h2>
            <p className="text-gray-600 mt-1">
              {reserva ? `Reserva ${reserva.codigo}` : 'Complete todos los campos requeridos'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda - Información básica */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evento *
                </label>
                <select
                  name="tipo_evento"
                  value={formData.tipo_evento}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Boda">Boda</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Reunión familiar">Reunión familiar</option>
                  <option value="Evento corporativo">Evento corporativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora *
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Personas *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="personas"
                    value={formData.personas}
                    onChange={handleChange}
                    required
                    min="1"
                    max="500"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lugar del Evento
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lugar"
                    value={formData.lugar}
                    onChange={handleChange}
                    placeholder="Dirección o lugar específico"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha - Servicios y pago */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Servicios Incluidos
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                  {serviciosDisponibles.map(servicio => (
                    <div key={servicio.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`servicio-${servicio.id}`}
                          checked={formData.servicios_seleccionados.includes(servicio.id)}
                          onChange={() => handleServicioChange(servicio.id)}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <label htmlFor={`servicio-${servicio.id}`} className="cursor-pointer">
                          <div className="font-medium text-gray-900">{servicio.nombre}</div>
                          <div className="text-sm text-gray-500">
                            ${servicio.precio.toLocaleString()} 
                            {servicio.tipo_calculo === 'por_persona' ? ' por persona' : ''}
                          </div>
                        </label>
                      </div>
                      <span className="text-sm font-medium text-orange-600">
                        ${servicio.tipo_calculo === 'por_persona' 
                          ? (servicio.precio * formData.personas).toLocaleString()
                          : servicio.precio.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total Estimado</span>
                  <span className="text-3xl font-bold text-orange-600">
                    ${totalCalculado.toLocaleString()}
                  </span>
                </div>
                
                {formData.personas > 50 && (
                  <div className="text-sm text-green-600 mb-3">
                    ✅ Descuento aplicado por {formData.personas} personas
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pagado"
                      name="pagado"
                      checked={formData.pagado}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="pagado" className="text-sm font-medium text-gray-700">
                      Pago completado
                    </label>
                  </div>

                  {!formData.pagado && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anticipo (opcional)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="anticipo"
                          value={formData.anticipo}
                          onChange={handleChange}
                          min="0"
                          max={totalCalculado}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalles Adicionales
                </label>
                <textarea
                  name="detalles"
                  value={formData.detalles}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Notas especiales, requerimientos específicos, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                />
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
              disabled={loading || !formData.cliente_id}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {reserva ? 'Actualizar Reserva' : 'Crear Reserva'}
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
  reserva,
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
            ¿Eliminar Reserva?
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Esta acción eliminará permanentemente la reserva 
            <span className="font-semibold text-gray-900"> {reserva?.codigo}</span> 
            del cliente <span className="font-semibold text-gray-900">{reserva?.cliente?.nombre}</span>.
            Esta acción no se puede deshacer.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Advertencia</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Se eliminarán todos los datos relacionados con esta reserva.
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
export default function AdminReservas() {
  const { user } = useAuthContext();
  
  // Estados principales
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  
  // Estados para formularios
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estados para datos relacionados
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    search: '',
    estado: 'todos',
    tipo_evento: '',
    fecha_desde: '',
    fecha_hasta: ''
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
      
      // Cargar reservas
      const datosReservas = await reservasService.getAllReservas(filtros);
      setReservas(datosReservas);
      
      // Cargar clientes y servicios (solo primera vez)
      if (clientes.length === 0) {
        const datosClientes = await reservasService.getClientes();
        setClientes(datosClientes);
      }
      
      if (servicios.length === 0) {
        const datosServicios = await reservasService.getServicios();
        setServicios(datosServicios);
      }
      
      // Cargar estadísticas
      const stats = await reservasService.getEstadisticas();
      setEstadisticas(stats);
      
      // Actualizar paginación
      setPaginacion(prev => ({
        ...prev,
        total: datosReservas.length
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

  // Abrir modal para crear reserva
  const abrirModalCrear = () => {
    setReservaSeleccionada(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar reserva
  const abrirModalEditar = async (reserva) => {
    try {
      setFormLoading(true);
      // Obtener datos completos de la reserva
      const reservaCompleta = await reservasService.getReservaById(reserva.id);
      setReservaSeleccionada(reservaCompleta);
      setModalAbierto(true);
    } catch (err) {
      console.error('❌ Error cargando reserva:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Abrir modal para eliminar reserva
  const abrirModalEliminar = (reserva) => {
    setReservaAEliminar(reserva);
    setModalEliminarAbierto(true);
  };

  // Manejar envío del formulario (crear/editar)
  const handleSubmitReserva = async (formData) => {
  try {
    setFormLoading(true);
    
    // 1. SEPARAR los datos: Extraer servicios_seleccionados del resto
    const { servicios_seleccionados, ...datosParaReserva } = formData;
    
    console.log('📦 Datos para reserva:', datosParaReserva);
    console.log('🔗 Servicios seleccionados:', servicios_seleccionados);
    
    let resultado;
    
    if (reservaSeleccionada) {
      // Actualizar solo los datos de la RESERVA (sin servicios_seleccionados)
      resultado = await reservasService.updateReserva(reservaSeleccionada.id, datosParaReserva);
      console.log(`✅ Reserva ${resultado.codigo} actualizada`);
      
      // 2. SI ESTÁS EDITANDO: Manejar servicios por separado
      if (servicios_seleccionados && servicios_seleccionados.length > 0) {
        console.log('🔄 Actualizando servicios para reserva:', resultado.id);
        // Aquí debes implementar la lógica para actualizar reserva_servicios
        // await reservasService.actualizarServiciosReserva(resultado.id, servicios_seleccionados);
      }
      
      alert(`✅ Reserva ${resultado.codigo} actualizada exitosamente`);
    } else {
      // Crear nueva RESERVA (sin servicios_seleccionados)
      resultado = await reservasService.createReserva(datosParaReserva);
      console.log(`✅ Reserva ${resultado.codigo} creada`);
      
      // 3. SI ES NUEVA: Manejar servicios por separado después de crear
      if (servicios_seleccionados && servicios_seleccionados.length > 0) {
        console.log('🔗 Guardando servicios para nueva reserva:', resultado.id);
        // Aquí debes implementar la lógica para guardar en reserva_servicios
        // await reservasService.guardarServiciosReserva(resultado.id, servicios_seleccionados);
      }
      
      alert(`✅ Reserva ${resultado.codigo} creada exitosamente`);
    }
    
    // 4. Cerrar modal y recargar datos
    setModalAbierto(false);
    await cargarDatos();
    
  } catch (err) {
    console.error('❌ Error guardando reserva:', err);
    alert(`Error: ${err.message}`);
  } finally {
    setFormLoading(false);
  }
};

  // Manejar eliminación de reserva
  const handleEliminarReserva = async () => {
    if (!reservaAEliminar) return;
    
    try {
      setFormLoading(true);
      
      await reservasService.deleteReserva(reservaAEliminar.id);
      
      alert(`✅ Reserva ${reservaAEliminar.codigo} eliminada exitosamente`);
      
      // Cerrar modal y recargar datos
      setModalEliminarAbierto(false);
      setReservaAEliminar(null);
      await cargarDatos();
      
    } catch (err) {
      console.error('❌ Error eliminando reserva:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de reserva
  const handleCambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'pendiente' ? 'confirmada' : 'pendiente';
    
    try {
      await reservasService.cambiarEstadoReserva(id, nuevoEstado);
      await cargarDatos();
      alert(`✅ Estado cambiado a ${nuevoEstado}`);
    } catch (err) {
      console.error('❌ Error cambiando estado:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Exportar a CSV
  const handleExportar = () => {
    try {
      const csvContent = [
        ['Código', 'Cliente', 'Email', 'Teléfono', 'Evento', 'Fecha', 'Hora', 'Personas', 'Lugar', 'Total', 'Estado', 'Pagado', 'Anticipo'],
        ...reservas.map(r => [
          r.codigo,
          r.cliente?.nombre || 'N/A',
          r.cliente?.email || 'N/A',
          r.cliente?.telefono || 'N/A',
          r.tipo_evento,
          r.fecha,
          r.hora || 'N/A',
          r.personas,
          r.lugar || 'N/A',
          r.total,
          r.estado,
          r.pagado ? 'Sí' : 'No',
          r.anticipo || 0
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservas_${new Date().toISOString().split('T')[0]}.csv`;
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

  // Estados y tipos para filtros
  const estados = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmada', label: 'Confirmada' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  const tiposEvento = [
    { value: '', label: 'Todos los eventos' },
    { value: 'Boda', label: 'Boda' },
    { value: 'Cumpleaños', label: 'Cumpleaños' },
    { value: 'Reunión familiar', label: 'Reunión familiar' },
    { value: 'Evento corporativo', label: 'Evento corporativo' },
    { value: 'Otro', label: 'Otro' }
  ];

  // Calcular reservas paginadas
  const inicio = (paginacion.pagina - 1) * paginacion.porPagina;
  const fin = inicio + paginacion.porPagina;
  const reservasPagina = reservas.slice(inicio, fin);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-600 mt-2">
            {estadisticas ? `${estadisticas.total} reservas encontradas` : 'Cargando...'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={loading || reservas.length === 0}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={abrirModalCrear}
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 flex items-center gap-2 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
            disabled={loading}
          >
            <Plus className="w-5 h-5" />
            Nueva Reserva
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
                placeholder="Buscar por cliente o código..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select 
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {estados.map((estado, index) => (
                <option key={index} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo de evento */}
          <div>
            <select 
              value={filtros.tipo_evento}
              onChange={(e) => handleFiltroChange('tipo_evento', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition-all"
              disabled={loading}
            >
              {tiposEvento.map((tipo, index) => (
                <option key={index} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtros de fecha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="date"
            value={filtros.fecha_desde}
            onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            disabled={loading}
          />
          <input
            type="date"
            value={filtros.fecha_hasta}
            onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            disabled={loading}
          />
          <button 
            onClick={() => setFiltros({
              search: '',
              estado: 'todos',
              tipo_evento: '',
              fecha_desde: '',
              fecha_hasta: ''
            })}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No hay reservas registradas</p>
            <button 
              onClick={abrirModalCrear}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              Crear primera reserva
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Código</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Cliente</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Evento</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Fecha</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Personas</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservasPagina.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-medium text-gray-900">{reserva.codigo}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(reserva.fecha_creacion).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {reserva.cliente?.nombre?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {reserva.cliente?.nombre || 'Cliente no especificado'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {reserva.cliente?.telefono || 'Sin teléfono'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{reserva.tipo_evento}</div>
                        {reserva.lugar && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {reserva.lugar}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {new Date(reserva.fecha).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {reserva.hora || 'Sin hora'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {reserva.personas}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900">
                          ${parseFloat(reserva.total || 0).toLocaleString()}
                        </div>
                        {reserva.anticipo > 0 && (
                          <div className="text-sm text-green-600">
                            Anticipo: ${parseFloat(reserva.anticipo).toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleCambiarEstado(reserva.id, reserva.estado)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                            reserva.estado === 'confirmada'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 shadow-sm'
                              : reserva.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shadow-sm'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-sm'
                          }`}
                          title="Click para cambiar estado"
                        >
                          {reserva.estado === 'confirmada' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {reserva.estado === 'pendiente' && <Clock className="w-3 h-3 mr-1" />}
                          {reserva.estado === 'cancelada' && <XCircle className="w-3 h-3 mr-1" />}
                          {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => abrirModalEditar(reserva)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => abrirModalEliminar(reserva)}
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
                Mostrando {inicio + 1}-{Math.min(fin, paginacion.total)} de {paginacion.total} reservas
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

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Reservas del mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.confirmadas} confirmadas • {estadisticas.pendientes} pendientes
                </p>
              </div>
              <Calendar className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold">Tasa de confirmación</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.tasa_confirmacion}%</p>
                <p className="text-sm text-gray-600 mt-1">
                  {estadisticas.confirmadas} de {estadisticas.total} reservas
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-semibold">Ingresos mensuales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${estadisticas.ingresos_mensuales.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-orange-400" />
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar reserva */}
      <ReservaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmitReserva}
        reserva={reservaSeleccionada}
        clientes={clientes}
        servicios={servicios}
        loading={formLoading}
      />

      {/* Modal para confirmar eliminación */}
      <ConfirmarEliminarModal
        isOpen={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        onConfirm={handleEliminarReserva}
        reserva={reservaAEliminar}
        loading={formLoading}
      />
    </div>
  );
}