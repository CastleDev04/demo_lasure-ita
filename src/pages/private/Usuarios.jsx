import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';

export default function AdminUsuarios() {
  const [selectedRole, setSelectedRole] = useState('todos');

  const usuarios = [
    { 
      id: 1, 
      nombre: 'Alexis Castillo', 
      email: 'alexis@lasurenita.com', 
      telefono: '+595991111111', 
      rol: 'Administrador',
      fechaRegistro: '2023-11-10',
      estado: 'activo'
    },
    { 
      id: 2, 
      nombre: 'María González', 
      email: 'maria@email.com', 
      telefono: '+595991111111', 
      rol: 'Cliente',
      fechaRegistro: '2024-01-15',
      estado: 'activo'
    },
    { 
      id: 3, 
      nombre: 'Carlos Ruiz', 
      email: 'carlos@email.com', 
      telefono: '++595991111111', 
      rol: 'Cliente',
      fechaRegistro: '2024-02-20',
      estado: 'inactivo'
    },
    { 
      id: 4, 
      nombre: 'Juan Pérez', 
      email: 'juan@lasurenita.com', 
      telefono: '+595991111111', 
      rol: 'Empleado',
      fechaRegistro: '2024-03-05',
      estado: 'activo'
    },
    { 
      id: 5, 
      nombre: 'Ana Martínez', 
      email: 'ana@email.com', 
      telefono: '+595991111111', 
      rol: 'Cliente',
      fechaRegistro: '2024-04-12',
      estado: 'activo'
    },
  ];

  const roles = ['todos', 'Administrador', 'Empleado', 'Cliente'];
  const estados = ['todos', 'activo', 'inactivo'];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">Gestiona usuarios, empleados y clientes</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Agregar Usuario
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
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
          
          {/* Filtro por rol */}
          <div>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              {roles.map((rol, index) => (
                <option key={index} value={rol}>
                  {rol === 'todos' ? 'Todos los roles' : rol}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por estado */}
          <div>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
              {estados.map((estado, index) => (
                <option key={index} value={estado}>
                  {estado === 'todos' ? 'Todos los estados' : estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Contacto</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Fecha registro</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios
                .filter(user => selectedRole === 'todos' || user.rol === selectedRole)
                .map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {usuario.nombre.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{usuario.nombre}</div>
                          <div className="text-sm text-gray-500">ID: USR-{usuario.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{usuario.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{usuario.telefono}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          usuario.rol === 'Administrador' ? 'bg-red-500' :
                          usuario.rol === 'Empleado' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`font-medium ${
                          usuario.rol === 'Administrador' ? 'text-red-700' :
                          usuario.rol === 'Empleado' ? 'text-blue-700' : 'text-green-700'
                        }`}>
                          {usuario.rol}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{usuario.fechaRegistro}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {usuario.estado === 'activo' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactivo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Más opciones">
                          <MoreVertical className="w-4 h-4" />
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
            Mostrando 1-5 de 42 usuarios
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-semibold">Total usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-sm text-blue-600">Clientes</p>
                  <p className="text-lg font-semibold">36</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Empleados</p>
                  <p className="text-lg font-semibold">4</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Admins</p>
                  <p className="text-lg font-semibold">2</p>
                </div>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-semibold">Usuarios activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">38</p>
              <p className="text-sm text-green-600 mt-2">90% de usuarios activos</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-semibold">Nuevos este mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              <p className="text-sm text-orange-600 mt-2">+4 respecto al mes anterior</p>
            </div>
            <Shield className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Información de roles */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles y permisos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Administrador</h3>
                <p className="text-sm text-gray-600">Acceso completo</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gestión completa del sistema
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Configuración y reportes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gestión de usuarios
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Empleado</h3>
                <p className="text-sm text-gray-600">Acceso limitado</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gestión de reservas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Atención al cliente
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Sin acceso a configuración
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cliente</h3>
                <p className="text-sm text-gray-600">Acceso básico</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ver sus reservas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ver galería de eventos
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Solo acceso a sus datos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}