// src/services/supabase/SupabaseReservasService.js - VERSION MEJORADA
import { supabase } from './SupabaseClient';
import IReservasService from '../interfaces/IReservasService';

export default class SupabaseReservasService extends IReservasService {
  constructor() {
    super();
    this.supabase = supabase;
    this.tableName = 'reservas';
  }

  async getAllReservas(filtros = {}) {
    try {
      console.log('📋 Obteniendo reservas con filtros:', filtros);
      
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          cliente:clientes(*),
          servicios:reserva_servicios(*, servicio:servicios(*))
        `)
        .order('fecha', { ascending: false });

      // Aplicar filtros
      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado);
      }

      if (filtros.tipo_evento) {
        query = query.eq('tipo_evento', filtros.tipo_evento);
      }

      if (filtros.fecha_desde) {
        query = query.gte('fecha', filtros.fecha_desde);
      }

      if (filtros.fecha_hasta) {
        query = query.lte('fecha', filtros.fecha_hasta);
      }

      if (filtros.search) {
        query = query.or(`codigo.ilike.%${filtros.search}%,cliente.nombre.ilike.%${filtros.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo reservas:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} reservas obtenidas`);
      return data || [];
    } catch (error) {
      console.error('❌ Error en getAllReservas:', error);
      throw error;
    }
  }

  async getReservaById(id) {
    try {
      console.log('🔍 Obteniendo reserva ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          cliente:clientes(*),
          servicios:reserva_servicios(*, servicio:servicios(*))
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error obteniendo reserva:', error);
        throw error;
      }

      console.log('✅ Reserva obtenida:', data?.codigo);
      return data;
    } catch (error) {
      console.error('❌ Error en getReservaById:', error);
      throw error;
    }
  }

  async createReserva(reservaData) {
    try {
      console.log('📝 Creando nueva reserva...');
      
      // Generar código automático
      const codigo = `RES-${Date.now().toString().slice(-6)}`;
      
      const reservaCompleta = {
        ...reservaData,
        codigo,
        fecha_creacion: new Date().toISOString(),
        estado: 'pendiente'
      };

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(reservaCompleta)
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error creando reserva:', error);
        throw error;
      }

      console.log('✅ Reserva creada:', data.codigo);
      return data;
    } catch (error) {
      console.error('❌ Error en createReserva:', error);
      throw error;
    }
  }

  async updateReserva(id, updates) {
    try {
      console.log('✏️ Actualizando reserva ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updates,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error actualizando reserva:', error);
        throw error;
      }

      console.log('✅ Reserva actualizada:', data.codigo);
      return data;
    } catch (error) {
      console.error('❌ Error en updateReserva:', error);
      throw error;
    }
  }

  async deleteReserva(id) {
    try {
      console.log('🗑️ Eliminando reserva ID:', id);
      
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando reserva:', error);
        throw error;
      }

      console.log('✅ Reserva eliminada');
      return true;
    } catch (error) {
      console.error('❌ Error en deleteReserva:', error);
      throw error;
    }
  }

  async cambiarEstadoReserva(id, estado) {
    try {
      console.log('🔄 Cambiando estado de reserva ID:', id, 'a:', estado);
      
      return await this.updateReserva(id, { 
        estado,
        fecha_cambio_estado: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error en cambiarEstadoReserva:', error);
      throw error;
    }
  }

  async getEstadisticas() {
    try {
      console.log('📊 Obteniendo estadísticas...');
      
      // Obtener conteo por estado
      const { data: conteos, error: errorConteos } = await this.supabase
        .from(this.tableName)
        .select('estado')
        .gte('fecha', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (errorConteos) throw errorConteos;

      // Obtener total ingresos del mes
      const { data: ingresos, error: errorIngresos } = await this.supabase
        .from(this.tableName)
        .select('total')
        .eq('estado', 'confirmada')
        .gte('fecha', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (errorIngresos) throw errorIngresos;

      const estadisticas = {
        total: conteos?.length || 0,
        confirmadas: conteos?.filter(r => r.estado === 'confirmada').length || 0,
        pendientes: conteos?.filter(r => r.estado === 'pendiente').length || 0,
        ingresos_mensuales: ingresos?.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0) || 0,
        tasa_confirmacion: conteos?.length > 0 
          ? Math.round((conteos.filter(r => r.estado === 'confirmada').length / conteos.length) * 100)
          : 0
      };

      console.log('✅ Estadísticas obtenidas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error en getEstadisticas:', error);
      throw error;
    }
  }

  // Nuevos métodos para obtener datos relacionados
  async getClientes() {
    try {
      const { data, error } = await this.supabase
        .from('clientes')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw error;
    }
  }

  async getServicios() {
    try {
      const { data, error } = await this.supabase
        .from('servicios')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo servicios:', error);
      throw error;
    }
  }
}