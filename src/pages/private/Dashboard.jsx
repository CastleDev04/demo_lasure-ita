// src/pages/private/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  BarChart3,
  Activity,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Eye,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { 
  reservasService, 
  clientesService, 
  serviciosService, 
  pagosService 
} from '../../services/ServiceFactory';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Datos del dashboard
  const [metricas, setMetricas] = useState([]);
  const [reservasRecientes, setReservasRecientes] = useState([]);
  const [eventosHoy, setEventosHoy] = useState([]);
  const [clientesNuevos, setClientesNuevos] = useState([]);
  const [pagosRecientes, setPagosRecientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [serviciosPopulares, setServiciosPopulares] = useState([]);

  // Cargar datos del dashboard
  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [
        reservasData,
        clientesData,
        serviciosData,
        pagosData,
        statsReservas,
        statsPagos,
        statsServicios
      ] = await Promise.all([
        reservasService.getAllReservas({}),
        clientesService.getClientes(),
        serviciosService.getAllServicios({ activo: true }),
        pagosService.getAllPagos({}),
        reservasService.getEstadisticas(),
        pagosService.getEstadisticasPagos(),
        serviciosService.getEstadisticas()
      ]);

      // Procesar datos
      procesarDatosDashboard(
        reservasData,
        clientesData,
        serviciosData,
        pagosData,
        statsReservas,
        statsPagos,
        statsServicios
      );

    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      setError(err.message);
      // Datos de ejemplo como fallback
      cargarDatosEjemplo();
    } finally {
      setLoading(false);
    }
  };

  const procesarDatosDashboard = (
    reservas, clientes, servicios, pagos, 
    statsReservas, statsPagos, statsServicios
  ) => {
    // Filtrar reservas de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const eventosHoyData = reservas
      .filter(reserva => reserva.fecha === hoy)
      .map(reserva => ({
        id: reserva.id,
        tipo: reserva.tipo_evento,
        cliente: reserva.cliente?.nombre || 'Sin nombre',
        inicio: reserva.hora || '--:--',
        fin: reserva.hora ? calcularHoraFin(reserva.hora, 6) : '--:--',
        estado: reserva.estado
      }));

    // Reservas recientes (últimas 5)
    const reservasRecientesData = reservas
      .slice(0, 5)
      .map(reserva => ({
        id: reserva.id,
        cliente: reserva.cliente?.nombre || 'Sin nombre',
        evento: reserva.tipo_evento,
        fecha: reserva.fecha,
        estado: reserva.estado,
        hora: reserva.hora || '--:--',
        total: reserva.total
      }));

    // Clientes nuevos (últimos 5)
    const clientesNuevosData = clientes
      .sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
      .slice(0, 5)
      .map(cliente => ({
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        fecha_registro: cliente.fecha_registro
      }));

    // Pagos recientes (últimos 5)
    const pagosRecientesData = pagos
      .slice(0, 5)
      .map(pago => ({
        id: pago.id,
        comprobante: pago.comprobante,
        cliente: pago.reserva?.cliente?.nombre || 'Sin cliente',
        monto: pago.monto,
        tipo: pago.tipo,
        metodo: pago.metodo,
        fecha: pago.fecha_pago
      }));

    // Calcular comparativa con mes anterior (simplificado)
    const cambioMesAnterior = 15; // En una app real, esto vendría de la BD

    // Métricas principales
    const metricasData = [
      { 
        id: 1, 
        title: 'Reservas este mes', 
        value: statsReservas?.total || 0, 
        icon: Calendar, 
        color: 'bg-blue-500', 
        cambio: '+15%',
        descripcion: `${statsReservas?.confirmadas || 0} confirmadas`
      },
      { 
        id: 2, 
        title: 'Clientes activos', 
        value: clientes.length, 
        icon: Users, 
        color: 'bg-green-500', 
        cambio: '+8%',
        descripcion: `${clientesNuevosData.length} nuevos este mes`
      },
      { 
        id: 3, 
        title: 'Ingresos mensuales', 
        value: `$${(statsReservas?.ingresos_mensuales || 0).toLocaleString()}`, 
        icon: DollarSign, 
        color: 'bg-orange-500', 
        cambio: '+22%',
        descripcion: `$${(statsPagos?.total_recaudado || 0).toLocaleString()} recaudado`
      },
      { 
        id: 4, 
        title: 'Servicios activos', 
        value: statsServicios?.activos || 0, 
        icon: Package, 
        color: 'bg-purple-500', 
        cambio: '+5%',
        descripcion: `${servicios.length} en catálogo`
      },
    ];

    // Estadísticas detalladas
    const estadisticasData = {
      tasaConfirmacion: statsReservas?.tasa_confirmacion || 0,
      pagosHoy: statsPagos?.pagos_hoy || 0,
      promedioPago: statsPagos?.promedio_pago || 0,
      serviciosPopulares: []
    };

    setMetricas(metricasData);
    setReservasRecientes(reservasRecientesData);
    setEventosHoy(eventosHoyData);
    setClientesNuevos(clientesNuevosData);
    setPagosRecientes(pagosRecientesData);
    setEstadisticas(estadisticasData);
  };

  const calcularHoraFin = (horaInicio, duracionHoras) => {
    if (!horaInicio) return '--:--';
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas + duracionHoras, minutos);
    return fecha.toTimeString().slice(0, 5);
  };

  const cargarDatosEjemplo = () => {
    // Datos de ejemplo en caso de error
    setMetricas([
      { id: 1, title: 'Reservas este mes', value: '24', icon: Calendar, color: 'bg-blue-500', cambio: '+12%', descripcion: '18 confirmadas' },
      { id: 2, title: 'Clientes activos', value: '156', icon: Users, color: 'bg-green-500', cambio: '+8%', descripcion: '12 nuevos' },
      { id: 3, title: 'Ingresos mensuales', value: '$12,450', icon: DollarSign, color: 'bg-orange-500', cambio: '+15%', descripcion: '$8,200 recaudado' },
      { id: 4, title: 'Servicios activos', value: '28', icon: Package, color: 'bg-purple-500', cambio: '+5%', descripcion: '32 en catálogo' },
    ]);

    setReservasRecientes([
      { id: 1, cliente: 'María González', evento: 'Boda', fecha: '2024-06-15', estado: 'confirmada', hora: '14:00', total: 5000 },
      { id: 2, cliente: 'Carlos Ruiz', evento: 'Cumpleaños XV', fecha: '2024-06-22', estado: 'pendiente', hora: '16:00', total: 3200 },
      { id: 3, cliente: 'Familia López', evento: 'Reunión familiar', fecha: '2024-06-10', estado: 'confirmada', hora: '12:00', total: 1800 },
    ]);

    setEventosHoy([
      { id: 1, tipo: 'Boda', cliente: 'María González', inicio: '14:00', fin: '22:00', estado: 'confirmada' },
      { id: 2, tipo: 'Reunión empresarial', cliente: 'Tech Solutions SA', inicio: '09:00', fin: '18:00', estado: 'confirmada' },
    ]);

    setEstadisticas({
      tasaConfirmacion: 78,
      pagosHoy: 3,
      promedioPago: 450,
      serviciosPopulares: []
    });
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatHora = (hora) => {
    if (!hora || hora === '--:--') return hora;
    return hora.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header del dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.nombre || 'Administrador'} • {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={cargarDashboard}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Mostrar error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Error cargando datos</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <p className="text-sm text-gray-600 mt-2">Mostrando datos de ejemplo</p>
          <button 
            onClick={cargarDashboard}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricas.map((metrica) => {
          const Icon = metrica.icon;
          const esPositivo = metrica.cambio?.startsWith('+');
          
          return (
            <div key={metrica.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metrica.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrica.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm ${esPositivo ? 'text-green-600' : 'text-red-600'}`}>
                      {esPositivo ? <ArrowUpRight className="w-4 h-4 inline" /> : <ArrowDownRight className="w-4 h-4 inline" />}
                      {metrica.cambio}
                    </span>
                    <span className="text-sm text-gray-500">• {metrica.descripcion}</span>
                  </div>
                </div>
                <div className={`${metrica.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Eventos de hoy */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Eventos de hoy</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {eventosHoy.length} evento{eventosHoy.length !== 1 ? 's' : ''} programado{eventosHoy.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {eventosHoy.length > 0 ? (
                eventosHoy.map((evento) => (
                  <div key={evento.id} className={`flex items-center justify-between p-4 rounded-lg border ${
                    evento.estado === 'confirmada' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        evento.estado === 'confirmada' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Calendar className={`w-5 h-5 ${
                          evento.estado === 'confirmada' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{evento.tipo}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            evento.estado === 'confirmada' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {evento.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{evento.cliente}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatHora(evento.inicio)} - {formatHora(evento.fin)}
                      </p>
                      <p className="text-sm text-gray-600">Duración: {evento.fin !== '--:--' ? '6h' : 'No especificada'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-gray-500 mt-4">No hay eventos programados para hoy</p>
                  <Link 
                    to="/admin/reservas"
                    className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Ver calendario completo →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas detalladas */}
          {estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-semibold">Tasa de confirmación</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {estadisticas.tasaConfirmacion}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Reservas confirmadas vs totales
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-semibold">Pagos hoy</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {estadisticas.pagosHoy}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Promedio: ${estadisticas.promedioPago?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <CreditCard className="w-10 h-10 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-semibold">Actividad del día</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {eventosHoy.length + estadisticas.pagosHoy}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Eventos + Pagos registrados
                    </p>
                  </div>
                  <Activity className="w-10 h-10 text-purple-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel lateral - Acciones rápidas */}
        <div className="space-y-8">
          {/* Acciones rápidas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones rápidas</h2>
            <div className="space-y-4">
              <Link 
                to="/admin/reservas"
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Nueva reserva</h3>
                  <p className="text-sm text-gray-600">Crear una nueva reserva</p>
                </div>
              </Link>
              
              <Link 
                to="/admin/pagos"
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Registrar pago</h3>
                  <p className="text-sm text-gray-600">Agregar un pago manual</p>
                </div>
              </Link>
              
              <Link 
                to="/admin/servicios"
                className="flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Gestionar servicios</h3>
                  <p className="text-sm text-gray-600">Ver y editar servicios</p>
                </div>
              </Link>
              
              <Link 
                to="/admin/clientes"
                className="flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Agregar cliente</h3>
                  <p className="text-sm text-gray-600">Nuevo cliente al sistema</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Pagos recientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pagos recientes</h2>
                <p className="text-gray-600 text-sm mt-1">Últimos registros</p>
              </div>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {pagosRecientes.length > 0 ? (
                pagosRecientes.map((pago) => (
                  <div key={pago.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{pago.comprobante}</p>
                      <p className="text-xs text-gray-600">{pago.cliente}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${pago.monto}</p>
                      <p className="text-xs text-gray-600 capitalize">{pago.tipo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay pagos recientes
                </div>
              )}
              
              {pagosRecientes.length > 0 && (
                <Link 
                  to="/admin/pagos"
                  className="block text-center text-orange-600 hover:text-orange-700 font-medium text-sm pt-2"
                >
                  Ver todos los pagos →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tablas inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Reservas recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reservas recientes</h2>
                <p className="text-gray-600 text-sm mt-1">Últimas 5 reservas</p>
              </div>
              <Link 
                to="/admin/reservas"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Ver todas →
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Evento</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Fecha</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Total</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservasRecientes.length > 0 ? (
                  reservasRecientes.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {reserva.cliente?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reserva.cliente}</p>
                            <p className="text-xs text-gray-500">{formatHora(reserva.hora)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{reserva.evento}</td>
                      <td className="py-4 px-6 text-gray-700">{formatFecha(reserva.fecha)}</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900">
                          ${typeof reserva.total === 'number' ? reserva.total.toLocaleString() : '0'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          reserva.estado === 'confirmada' 
                            ? 'bg-green-100 text-green-800'
                            : reserva.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reserva.estado === 'confirmada' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {reserva.estado === 'pendiente' && <Clock className="w-3 h-3 mr-1" />}
                          {reserva.estado === 'cancelada' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1) || 'Desconocido'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      No hay reservas recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clientes nuevos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Clientes recientes</h2>
                <p className="text-gray-600 text-sm mt-1">Últimos 5 registrados</p>
              </div>
              <Link 
                to="/admin/clientes"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Ver todos →
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Contacto</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Registro</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientesNuevos.length > 0 ? (
                  clientesNuevos.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {cliente.nombre?.charAt(0) || '?'}
                          </div>
                          <p className="font-medium text-gray-900">{cliente.nombre}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-gray-900">{cliente.email}</p>
                          <p className="text-xs text-gray-500">{cliente.telefono || 'Sin teléfono'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {formatFecha(cliente.fecha_registro)}
                      </td>
                      <td className="py-4 px-6">
                        <Link 
                          to={`/admin/reservas`}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Reservar
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-500">
                      No hay clientes recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer informativo */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Sistema de Gestión de Eventos</h3>
            <p className="text-gray-300 mt-2">
              {metricas[0]?.value} reservas • {metricas[1]?.value} clientes • {metricas[3]?.value} servicios
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{eventosHoy.length}</p>
              <p className="text-sm text-gray-300">Eventos hoy</p>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{estadisticas?.pagosHoy || 0}</p>
              <p className="text-sm text-gray-300">Pagos hoy</p>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{estadisticas?.tasaConfirmacion || 0}%</p>
              <p className="text-sm text-gray-300">Tasa confirmación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}