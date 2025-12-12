// ServiceFactory.jsx - ACTUALIZADO CON SERVICIOS Y PAGOS
import IAuthService from './interfaces/IAuthService';
import IReservasService from './interfaces/IReservasService';
import {IClientesService} from './interfaces/IClientesService';
import IServiciosService from './interfaces/IServiciosService';
import IPagosService from './interfaces/IPagosService';

import SupabaseAuthService from './supabase/SupabaseAuthService';
import SupabaseReservasService from './supabase/SupabaseReservasService';
import SupabaseClientesService from './supabase/SupabaseClientesService';
import SupabaseServiciosService from './supabase/SupabaseServiciosService';
import SupabasePagosService from './supabase/SupabasePagosService';

class ServiceFactory {
  constructor() {
    this.backendType = 'supabase';
    console.log(`🏭 ServiceFactory iniciado con backend: ${this.backendType}`);
    
    // Inicializar todos los servicios
    this._authService = null;
    this._reservasService = null;
    this._clientesService = null;
    this._serviciosService = null;
    this._pagosService = null;
  }

  setBackendType(type) {
    if (['supabase', 'laravel'].includes(type)) {
      console.log(`🔄 Cambiando backend de ${this.backendType} a ${type}`);
      this.backendType = type;
      
      // Resetear todos los servicios para que se creen con el nuevo backend
      this._authService = null;
      this._reservasService = null;
      this._clientesService = null;
      this._serviciosService = null;
      this._pagosService = null;
      
      localStorage.setItem('preferred_backend', type);
      setTimeout(() => window.location.reload(), 500);
    } else {
      console.warn(`⚠️ Tipo de backend no soportado: ${type}`);
    }
  }

  getBackendType() {
    return this.backendType;
  }

  // ========== MÉTODOS PARA CREAR SERVICIOS ==========

  /**
   * Crear servicio de autenticación (SINGLETON)
   * @returns {IAuthService}
   */
  createAuthService() {
    if (this._authService) {
      console.log('♻️ Reutilizando AuthService existente');
      return this._authService;
    }

    console.log(`🛠️ Creando AuthService para: ${this.backendType}`);
    
    try {
      if (this.backendType === 'supabase') {
        this._authService = new SupabaseAuthService();
        console.log('✅ SupabaseAuthService creado exitosamente');
      } else {
        this._authService = this.createMockAuthService();
        console.log('⚠️ Usando LaravelAuthService (MOCK)');
      }
      
      return this._authService;
    } catch (error) {
      console.error('❌ Error creando AuthService:', error);
      this._authService = this.createMockAuthService();
      return this._authService;
    }
  }

  /**
   * Crear servicio de reservas (SINGLETON)
   * @returns {IReservasService}
   */
  createReservasService() {
    if (this._reservasService) {
      console.log('♻️ Reutilizando ReservasService existente');
      return this._reservasService;
    }

    console.log(`🛠️ Creando ReservasService para: ${this.backendType}`);
    
    try {
      if (this.backendType === 'supabase') {
        this._reservasService = new SupabaseReservasService();
        console.log('✅ SupabaseReservasService creado exitosamente');
      } else {
        this._reservasService = this.createMockReservasService();
        console.log('⚠️ Usando LaravelReservasService (MOCK)');
      }
      
      return this._reservasService;
    } catch (error) {
      console.error('❌ Error creando ReservasService:', error);
      this._reservasService = this.createMockReservasService();
      return this._reservasService;
    }
  }

  /**
   * Crear servicio de clientes (SINGLETON)
   * @returns {IClientesService}
   */
  createClientesService() {
    if (this._clientesService) {
      console.log('♻️ Reutilizando ClientesService existente');
      return this._clientesService;
    }

    console.log(`🛠️ Creando ClientesService para: ${this.backendType}`);
    
    try {
      if (this.backendType === 'supabase') {
        this._clientesService = new SupabaseClientesService();
        console.log('✅ SupabaseClientesService creado exitosamente');
      } else {
        this._clientesService = this.createMockClientesService();
        console.log('⚠️ Usando LaravelClientesService (MOCK)');
      }
      
      return this._clientesService;
    } catch (error) {
      console.error('❌ Error creando ClientesService:', error);
      this._clientesService = this.createMockClientesService();
      return this._clientesService;
    }
  }

  /**
   * Crear servicio de servicios (SINGLETON)
   * @returns {IServiciosService}
   */
  createServiciosService() {
    if (this._serviciosService) {
      console.log('♻️ Reutilizando ServiciosService existente');
      return this._serviciosService;
    }

    console.log(`🛠️ Creando ServiciosService para: ${this.backendType}`);
    
    try {
      if (this.backendType === 'supabase') {
        this._serviciosService = new SupabaseServiciosService();
        console.log('✅ SupabaseServiciosService creado exitosamente');
      } else {
        this._serviciosService = this.createMockServiciosService();
        console.log('⚠️ Usando LaravelServiciosService (MOCK)');
      }
      
      return this._serviciosService;
    } catch (error) {
      console.error('❌ Error creando ServiciosService:', error);
      this._serviciosService = this.createMockServiciosService();
      return this._serviciosService;
    }
  }

  /**
   * Crear servicio de pagos (SINGLETON)
   * @returns {IPagosService}
   */
  createPagosService() {
    if (this._pagosService) {
      console.log('♻️ Reutilizando PagosService existente');
      return this._pagosService;
    }

    console.log(`🛠️ Creando PagosService para: ${this.backendType}`);
    
    try {
      if (this.backendType === 'supabase') {
        this._pagosService = new SupabasePagosService();
        console.log('✅ SupabasePagosService creado exitosamente');
      } else {
        this._pagosService = this.createMockPagosService();
        console.log('⚠️ Usando LaravelPagosService (MOCK)');
      }
      
      return this._pagosService;
    } catch (error) {
      console.error('❌ Error creando PagosService:', error);
      this._pagosService = this.createMockPagosService();
      return this._pagosService;
    }
  }

  // ========== MÉTODOS MOCK PARA LARAVEL ==========

  createMockAuthService() {
    return {
      signIn: async (email, password) => {
        console.log('🛑 Laravel signIn (MOCK) para:', email);
        return { 
          user: { id: 'laravel-mock', email, nombre: 'Usuario Demo', rol: 'admin' },
          token: 'laravel-mock-token'
        };
      },
      signUp: async () => {
        console.log('🛑 Laravel signUp (MOCK)');
        throw new Error('Laravel no implementado aún');
      },
      signOut: async () => {
        console.log('🛑 Laravel signOut (MOCK)');
      },
      getCurrentUser: async () => {
        console.log('🛑 Laravel getCurrentUser (MOCK)');
        try {
          const userData = localStorage.getItem('admin_user');
          return userData ? JSON.parse(userData) : null;
        } catch (e) {
          return null;
        }
      },
      resetPassword: async () => {
        console.log('🛑 Laravel resetPassword (MOCK)');
        return { success: true };
      },
      isAuthenticated: () => {
        const userData = localStorage.getItem('admin_user');
        return !!userData;
      },
      getUserRole: () => {
        try {
          const userData = localStorage.getItem('admin_user');
          if (userData) {
            const user = JSON.parse(userData);
            return user.rol || null;
          }
        } catch (e) {
          return null;
        }
        return null;
      },
      isAdmin: () => {
        try {
          const userData = localStorage.getItem('admin_user');
          if (userData) {
            const user = JSON.parse(userData);
            return user.rol === 'admin';
          }
        } catch (e) {
          return false;
        }
        return false;
      }
    };
  }

  createMockReservasService() {
    return {
      getAllReservas: async (filtros = {}) => {
        console.log('🛑 Laravel getAllReservas (MOCK)', filtros);
        return [];
      },
      getReservaById: async (id) => {
        console.log('🛑 Laravel getReservaById (MOCK)', id);
        return null;
      },
      createReserva: async (reservaData) => {
        console.log('🛑 Laravel createReserva (MOCK)', reservaData);
        throw new Error('Laravel no implementado');
      },
      updateReserva: async (id, updates) => {
        console.log('🛑 Laravel updateReserva (MOCK)', id, updates);
        throw new Error('Laravel no implementado');
      },
      deleteReserva: async (id) => {
        console.log('🛑 Laravel deleteReserva (MOCK)', id);
        throw new Error('Laravel no implementado');
      },
      cambiarEstadoReserva: async (id, estado) => {
        console.log('🛑 Laravel cambiarEstadoReserva (MOCK)', id, estado);
        throw new Error('Laravel no implementado');
      },
      getEstadisticas: async () => {
        console.log('🛑 Laravel getEstadisticas (MOCK)');
        return {
          total: 0,
          confirmadas: 0,
          pendientes: 0,
          ingresos_mensuales: 0,
          tasa_confirmacion: 0
        };
      },
      getClientes: async () => {
        console.log('🛑 Laravel getClientes (MOCK)');
        return [];
      },
      getServicios: async () => {
        console.log('🛑 Laravel getServicios (MOCK)');
        return [];
      }
    };
  }

  createMockClientesService() {
    return {
      getClientes: async (filtros = {}) => {
        console.log('🛑 Laravel getClientes (MOCK)', filtros);
        return [
          { id: 1, nombre: 'Cliente Demo', email: 'demo@email.com', telefono: '555-1234' }
        ];
      },
      getClienteById: async (id) => {
        console.log('🛑 Laravel getClienteById (MOCK)', id);
        return { id: id, nombre: 'Cliente Demo', email: 'demo@email.com', telefono: '555-1234' };
      },
      createCliente: async (clienteData) => {
        console.log('🛑 Laravel createCliente (MOCK)', clienteData);
        return { id: Date.now(), ...clienteData };
      },
      updateCliente: async (id, clienteData) => {
        console.log('🛑 Laravel updateCliente (MOCK)', id, clienteData);
        return { id: id, ...clienteData, updated: true };
      },
      deleteCliente: async (id) => {
        console.log('🛑 Laravel deleteCliente (MOCK)', id);
        return { success: true, id: id };
      },
      searchClientes: async (searchTerm) => {
        console.log('🛑 Laravel searchClientes (MOCK)', searchTerm);
        return [
          { id: 1, nombre: 'Cliente Demo', email: 'demo@email.com', telefono: '555-1234' }
        ];
      }
    };
  }

  createMockServiciosService() {
    return {
      getAllServicios: async (filtros = {}) => {
        console.log('🛑 Laravel getAllServicios (MOCK)', filtros);
        return [
          { 
            id: 1, 
            nombre: 'Catering Premium', 
            descripcion: 'Servicio de comida gourmet', 
            precio: 2500.00, 
            tipo_calculo: 'por_persona',
            duracion_horas: 4,
            activo: true
          },
          { 
            id: 2, 
            nombre: 'Fotografía Profesional', 
            descripcion: 'Sesión fotográfica completa', 
            precio: 1200.00, 
            tipo_calculo: 'fijo',
            duracion_horas: 6,
            activo: true
          }
        ];
      },
      getServicioById: async (id) => {
        console.log('🛑 Laravel getServicioById (MOCK)', id);
        return { 
          id: id, 
          nombre: 'Servicio Demo', 
          descripcion: 'Descripción demo', 
          precio: 1000.00, 
          tipo_calculo: 'fijo',
          duracion_horas: 4,
          activo: true
        };
      },
      createServicio: async (servicioData) => {
        console.log('🛑 Laravel createServicio (MOCK)', servicioData);
        return { id: Date.now(), ...servicioData };
      },
      updateServicio: async (id, updates) => {
        console.log('🛑 Laravel updateServicio (MOCK)', id, updates);
        return { id: id, ...updates, updated: true };
      },
      deleteServicio: async (id) => {
        console.log('🛑 Laravel deleteServicio (MOCK)', id);
        return { success: true, id: id };
      },
      cambiarEstadoServicio: async (id, activo) => {
        console.log('🛑 Laravel cambiarEstadoServicio (MOCK)', id, activo);
        return { success: true, id: id, activo: activo };
      },
      getEstadisticas: async () => {
        console.log('🛑 Laravel getEstadisticas (MOCK)');
        return {
          total: 2,
          activos: 2,
          inactivos: 0,
          precio_promedio: 1850.00,
          tasa_activos: 100,
          por_tipo: { fijo: 1, por_persona: 1 }
        };
      },
      getServiciosMasPopulares: async () => {
        console.log('🛑 Laravel getServiciosMasPopulares (MOCK)');
        return [
          { servicio_id: 1, count: 10, servicios: { nombre: 'Catering Premium', precio: 2500.00 } },
          { servicio_id: 2, count: 8, servicios: { nombre: 'Fotografía Profesional', precio: 1200.00 } }
        ];
      }
    };
  }

  createMockPagosService() {
    return {
      getAllPagos: async (filtros = {}) => {
        console.log('🛑 Laravel getAllPagos (MOCK)', filtros);
        return [
          { 
            id: 1, 
            reserva_id: 1, 
            monto: 2500.00, 
            tipo: 'anticipo', 
            metodo: 'tarjeta',
            estado: 'completado',
            fecha_pago: new Date().toISOString()
          }
        ];
      },
      getPagoById: async (id) => {
        console.log('🛑 Laravel getPagoById (MOCK)', id);
        return { 
          id: id, 
          reserva_id: 1, 
          monto: 2500.00, 
          tipo: 'anticipo', 
          metodo: 'tarjeta',
          estado: 'completado',
          fecha_pago: new Date().toISOString()
        };
      },
      crearPago: async (pagoData) => {
        console.log('🛑 Laravel crearPago (MOCK)', pagoData);
        return { id: Date.now(), ...pagoData };
      },
      actualizarPago: async (id, updates) => {
        console.log('🛑 Laravel actualizarPago (MOCK)', id, updates);
        return { id: id, ...updates, updated: true };
      },
      eliminarPago: async (id) => {
        console.log('🛑 Laravel eliminarPago (MOCK)', id);
        return { success: true, id: id };
      },
      getPagosPorReserva: async (reservaId) => {
        console.log('🛑 Laravel getPagosPorReserva (MOCK)', reservaId);
        return [
          { 
            id: 1, 
            reserva_id: reservaId, 
            monto: 1000.00, 
            tipo: 'anticipo', 
            metodo: 'efectivo',
            estado: 'completado',
            fecha_pago: new Date().toISOString()
          }
        ];
      },
      getEstadisticasPagos: async () => {
        console.log('🛑 Laravel getEstadisticasPagos (MOCK)');
        return {
          total_recaudado: 10000.00,
          pagos_hoy: 3,
          pagos_mes: 45,
          promedio_pago: 222.22,
          por_metodo: { tarjeta: 60, efectivo: 30, transferencia: 10 },
          por_estado: { completado: 85, pendiente: 10, fallido: 5 }
        };
      },
      getBalanceReserva: async (reservaId) => {
        console.log('🛑 Laravel getBalanceReserva (MOCK)', reservaId);
        return {
          total_reserva: 5000.00,
          total_pagado: 2500.00,
          saldo_pendiente: 2500.00,
          porcentaje_pagado: 50,
          pagos: [
            { id: 1, monto: 1000.00, tipo: 'anticipo', fecha: new Date().toISOString() },
            { id: 2, monto: 1500.00, tipo: 'pago', fecha: new Date().toISOString() }
          ]
        };
      },
      registrarPagoCompleto: async (reservaId, metodo) => {
        console.log('🛑 Laravel registrarPagoCompleto (MOCK)', reservaId, metodo);
        return { 
          success: true, 
          pago_id: Date.now(),
          reserva_id: reservaId,
          mensaje: 'Pago registrado exitosamente'
        };
      },
      registrarAnticipo: async (reservaId, monto, metodo) => {
        console.log('🛑 Laravel registrarAnticipo (MOCK)', reservaId, monto, metodo);
        return { 
          success: true, 
          pago_id: Date.now(),
          reserva_id: reservaId,
          monto: monto,
          mensaje: 'Anticipo registrado exitosamente'
        };
      }
    };
  }

  // ========== MÉTODOS DE DIAGNÓSTICO ==========

  /**
   * Verificar estado de todos los servicios
   */
  verificarServicios() {
    console.log('🔍 Verificando estado de servicios...');
    
    const servicios = {
      auth: !!this._authService,
      reservas: !!this._reservasService,
      clientes: !!this._clientesService,
      servicios: !!this._serviciosService,
      pagos: !!this._pagosService
    };

    console.log('📊 Estado de servicios:', servicios);
    console.log('🏗️  Backend activo:', this.backendType);

    return {
      backend: this.backendType,
      servicios: servicios,
      todosActivos: Object.values(servicios).every(Boolean)
    };
  }

  /**
   * Reiniciar todos los servicios (para debugging)
   */
  reiniciarServicios() {
    console.log('🔄 Reiniciando todos los servicios...');
    
    this._authService = null;
    this._reservasService = null;
    this._clientesService = null;
    this._serviciosService = null;
    this._pagosService = null;

    console.log('✅ Todos los servicios reiniciados');
    return this.verificarServicios();
  }
}

// ========== SINGLETON ==========
const serviceFactory = new ServiceFactory();

// Servicios pre-creados (lazy loading)
export const authService = serviceFactory.createAuthService();
export const reservasService = serviceFactory.createReservasService();
export const clientesService = serviceFactory.createClientesService();
export const serviciosService = serviceFactory.createServiciosService();
export const pagosService = serviceFactory.createPagosService();

// Exportar la fábrica
export { serviceFactory };

/**
 * Función de ayuda para probar todos los servicios
 */
export const testAllServices = async () => {
  console.log('🧪 Probando todos los servicios...');
  
  const resultados = {
    auth: { success: false, error: null },
    reservas: { success: false, error: null },
    clientes: { success: false, error: null },
    servicios: { success: false, error: null },
    pagos: { success: false, error: null }
  };

  try {
    // Probar Auth
    try {
      const user = await authService.getCurrentUser();
      resultados.auth = { success: true, user };
    } catch (error) {
      resultados.auth = { success: false, error: error.message };
    }

    // Probar Reservas
    try {
      const reservas = await reservasService.getAllReservas({});
      resultados.reservas = { success: true, count: reservas.length };
    } catch (error) {
      resultados.reservas = { success: false, error: error.message };
    }

    // Probar Clientes
    try {
      const clientes = await clientesService.getClientes();
      resultados.clientes = { success: true, count: clientes.length };
    } catch (error) {
      resultados.clientes = { success: false, error: error.message };
    }

    // Probar Servicios
    try {
      const servicios = await serviciosService.getAllServicios({});
      resultados.servicios = { success: true, count: servicios.length };
    } catch (error) {
      resultados.servicios = { success: false, error: error.message };
    }

    // Probar Pagos
    try {
      const pagos = await pagosService.getAllPagos({});
      resultados.pagos = { success: true, count: pagos.length };
    } catch (error) {
      resultados.pagos = { success: false, error: error.message };
    }

    console.log('📊 Resultados de pruebas:', resultados);
    return resultados;

  } catch (error) {
    console.error('❌ Error en testAllServices:', error);
    return { error: error.message, resultados };
  }
};

/**
 * Función para cambiar entre backends fácilmente
 */
export const cambiarBackend = (tipo) => {
  console.log(`🔄 Solicitando cambio a backend: ${tipo}`);
  
  if (!['supabase', 'laravel'].includes(tipo)) {
    console.error(`❌ Tipo de backend no válido: ${tipo}`);
    return false;
  }

  if (tipo === serviceFactory.getBackendType()) {
    console.log(`ℹ️ Ya estás usando backend: ${tipo}`);
    return true;
  }

  const confirmar = window.confirm(
    `¿Estás seguro de cambiar el backend de ${serviceFactory.getBackendType()} a ${tipo}?\n\n` +
    `Esto reiniciará la aplicación y todos los servicios se crearán de nuevo.`
  );

  if (confirmar) {
    serviceFactory.setBackendType(tipo);
    return true;
  }

  return false;
};