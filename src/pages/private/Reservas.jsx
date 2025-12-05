import React from 'react';
import { 
  Calendar, 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Search
} from 'lucide-react';

export default function AdminReservas() {
  const reservas = [
    { 
      id: 1, 
      codigo: 'RES-001', 
      cliente: 'María González', 
      evento: 'Boda', 
      fecha: '2024-06-15', 
      personas: 150, 
      total: '$5,200', 
      estado: 'confirmada',
      pagado: true
    },
    { 
      id: 2, 
      codigo: 'RES-002', 
      cliente: 'Carlos Ruiz', 
      evento: 'Cumpleaños XV', 
      fecha: '2024-06-22', 
      personas: 80, 
      total: '$3,800', 
      estado: 'pendiente',
      pagado: false
    },
    { 
      id: 3, 
      codigo: 'RES-003', 
      cliente: 'Familia López', 
      evento: 'Reunión familiar', 
      fecha: '2024-06-10', 
      personas: 60, 
      total: '$2,500', 
      estado: 'confirmada',
      pagado: true
    },
    { 
      id: 4, 
      codigo: 'RES-004', 
      cliente: 'Ana Martínez', 
      evento: 'Boda', 
      fecha: '2024-07-05', 
      personas: 200, 
      total: '$7,500', 
      estado: 'pendiente',
      pagado: true
    },
    { 
      id: 5, 
      codigo: 'RES-005', 
      cliente: 'Tech Solutions SA', 
      evento: 'Evento corporativo', 
      fecha: '2024-06-28', 
      personas: 120, 
      total: '$4,800', 
      estado: 'confirmada',
      pagado: false
    },
  ];

  const estados = ['Todas', 'Confirmadas', 'Pendientes', 'Canceladas'];
  const tiposEvento = ['Boda', 'Cumpleaños', 'Reunión familiar', 'Evento corporativo', 'Otro'];

  return (
    <div>
      {/* Header con título y acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-2">Gestiona todas las reservas y eventos programados</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente, código o evento..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
              <option value="">Todos los estados</option>
              {estados.map((estado, index) => (
                <option key={index} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por tipo de evento */}
          <div>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
              <option value="">Todos los eventos</option>
              {tiposEvento.map((tipo, index) => (
                <option key={index} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtros de fecha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="date"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <input
            type="date"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium">
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              {reservas.map((reserva) => (
                <tr key={reserva.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{reserva.codigo}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {reserva.cliente.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{reserva.cliente}</div>
                        <div className="text-sm text-gray-500">
                          {reserva.pagado ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Pagado
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pendiente pago
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{reserva.evento}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{reserva.fecha}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{reserva.personas}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{reserva.total}</div>
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
                      {reserva.estado === 'cancelada' && <XCircle className="w-3 h-3 mr-1" />}
                      {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver detalles">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
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
            Mostrando 1-5 de 24 reservas
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 bg-orange-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Reservas del mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Tasa de confirmación</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">92%</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-semibold">Ingresos mensuales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$28,400</p>
            </div>
            <Download className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
}