import React from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';

export default function Dashboard() {
  // Datos de ejemplo
  const metricas = [
    { id: 1, title: 'Reservas este mes', value: '24', icon: Calendar, color: 'bg-blue-500', change: '+12%' },
    { id: 2, title: 'Clientes nuevos', value: '18', icon: Users, color: 'bg-green-500', change: '+8%' },
    { id: 3, title: 'Ingresos totales', value: '$12,450', icon: DollarSign, color: 'bg-orange-500', change: '+15%' },
    { id: 4, title: 'Tasa de ocupación', value: '78%', icon: TrendingUp, color: 'bg-purple-500', change: '+5%' },
  ];

  const reservasRecientes = [
    { id: 1, cliente: 'María González', evento: 'Boda', fecha: '2024-06-15', estado: 'confirmada', hora: '14:00' },
    { id: 2, cliente: 'Carlos Ruiz', evento: 'Cumpleaños XV', fecha: '2024-06-22', estado: 'pendiente', hora: '16:00' },
    { id: 3, cliente: 'Familia López', evento: 'Reunión familiar', fecha: '2024-06-10', estado: 'confirmada', hora: '12:00' },
    { id: 4, cliente: 'Ana Martínez', evento: 'Boda', fecha: '2024-07-05', estado: 'cancelada', hora: '15:00' },
  ];

  const eventosHoy = [
    { id: 1, tipo: 'Boda', cliente: 'María González', inicio: '14:00', fin: '22:00' },
    { id: 2, tipo: 'Reunión empresarial', cliente: 'Tech Solutions SA', inicio: '09:00', fin: '18:00' },
  ];

  return (
    <div>
      {/* Header del dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración de Alquiler</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricas.map((metrica) => {
          const Icon = metrica.icon;
          return (
            <div key={metrica.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metrica.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metrica.value}</p>
                  <p className="text-sm text-green-600 mt-1">{metrica.change} respecto al mes anterior</p>
                </div>
                <div className={`${metrica.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eventos de hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Eventos de hoy</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {eventosHoy.map((evento) => (
              <div key={evento.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-gray-900">{evento.tipo}</span>
                  </div>
                  <p className="text-sm text-gray-600">{evento.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{evento.inicio} - {evento.fin}</p>
                  <p className="text-sm text-gray-600">En curso</p>
                </div>
              </div>
            ))}
            
            {eventosHoy.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay eventos programados para hoy
              </div>
            )}
          </div>
        </div>

        {/* Reservas recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reservas recientes</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Evento</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasRecientes.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {reserva.cliente.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{reserva.cliente}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{reserva.evento}</td>
                    <td className="py-3 px-2 text-gray-700">
                      <div>{reserva.fecha}</div>
                      <div className="text-sm text-gray-500">{reserva.hora}</div>
                    </td>
                    <td className="py-3 px-2">
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
                        {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center">
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Ver todas las reservas →
            </button>
          </div>
        </div>
      </div>

      {/* Sección de acciones rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nueva reserva</h3>
            <p className="text-sm text-gray-600">Agregar una nueva reserva al sistema</p>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Agregar cliente</h3>
            <p className="text-sm text-gray-600">Registrar un nuevo cliente en el sistema</p>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver inventario</h3>
            <p className="text-sm text-gray-600">Revisar mobiliario y equipos disponibles</p>
          </button>
        </div>
      </div>
    </div>
  );
}