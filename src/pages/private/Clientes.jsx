import React, { useState, useEffect } from 'react';
import { clientesService } from '../../services/ServiceFactory';

const Clientes = () => {
  // Estados para clientes y filtros
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    search: ''
  });

  // Estados para el formulario modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 Cargando clientes con filtros:', filtros);
      
      let data;
      if (filtros.search) {
        data = await clientesService.searchClientes(filtros.search);
      } else {
        data = await clientesService.getClientes();
      }
      
      console.log(`✅ ${data?.length || 0} clientes cargados`);
      setClientes(data || []);
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setError(err.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Abrir modal para nuevo cliente
  const handleOpenModal = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('📝 Creando cliente:', formData);
      
      const nuevoCliente = await clientesService.createCliente(formData);
      console.log('✅ Cliente creado:', nuevoCliente);
      
      // Cerrar modal y actualizar lista
      handleCloseModal();
      await cargarClientes();
      
      // Mostrar mensaje de éxito
      alert(`✅ Cliente "${nuevoCliente.nombre}" creado exitosamente`);
      
    } catch (err) {
      console.error('❌ Error creando cliente:', err);
      
      // Manejar error específico de Supabase (email duplicado)
      if (err.message.includes('duplicate key') || err.message.includes('unique')) {
        setFormErrors({
          ...formErrors,
          email: 'Este email ya está registrado'
        });
      } else {
        alert(`❌ Error al crear cliente: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar cliente
  const handleDeleteCliente = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar al cliente "${nombre}"?`)) {
      return;
    }
    
    try {
      console.log('🗑️ Eliminando cliente ID:', id);
      await clientesService.deleteCliente(id);
      console.log('✅ Cliente eliminado');
      
      // Actualizar lista
      await cargarClientes();
      alert('✅ Cliente eliminado exitosamente');
    } catch (err) {
      console.error('❌ Error eliminando cliente:', err);
      alert(`❌ Error al eliminar cliente: ${err.message}`);
    }
  };

  // Manejar búsqueda
  const handleSearch = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    cargarClientes();
  };

  // Renderizar tabla de clientes
  const renderTablaClientes = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p>Cargando clientes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">❌ Error: {error}</div>
          <button 
            onClick={cargarClientes}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (clientes.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay clientes registrados</p>
          <button 
            onClick={handleOpenModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + Crear primer cliente
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left font-semibold">ID</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Nombre</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Email</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Teléfono</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Dirección</th>
              <th className="py-3 px-4 border-b text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b">{cliente.id}</td>
                <td className="py-3 px-4 border-b font-medium">{cliente.nombre}</td>
                <td className="py-3 px-4 border-b">
                  <a href={`mailto:${cliente.email}`} className="text-blue-500 hover:text-blue-700">
                    {cliente.email}
                  </a>
                </td>
                <td className="py-3 px-4 border-b">
                  {cliente.telefono ? (
                    <a href={`tel:${cliente.telefono}`} className="text-gray-700 hover:text-blue-500">
                      {cliente.telefono}
                    </a>
                  ) : '-'}
                </td>
                <td className="py-3 px-4 border-b">{cliente.direccion || '-'}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {/* Editar - implementar después */}}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteCliente(cliente.id, cliente.nombre)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Componente del modal
  const ModalCrearCliente = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Nuevo Cliente</h2>
            <button 
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
                {formErrors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ejemplo@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              
              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: +34 612 345 678"
                />
              </div>
              
              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dirección completa..."
                />
              </div>
            </div>
            
            {/* Footer del modal */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded text-white ${
                  submitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {submitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Creando...
                  </>
                ) : 'Crear Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Cliente
        </button>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleSubmitSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="search"
                value={filtros.search}
                onChange={handleSearch}
                placeholder="Buscar clientes por nombre, email o teléfono..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setFiltros({ search: '' });
                cargarClientes();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Con Teléfono</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientes.filter(c => c.telefono).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Crecimiento</p>
              <p className="text-2xl font-bold text-gray-800">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Lista de Clientes</h2>
        </div>
        <div className="p-4">
          {renderTablaClientes()}
        </div>
      </div>

      {/* Modal para crear cliente */}
      <ModalCrearCliente />
    </div>
  );
};

export default Clientes;