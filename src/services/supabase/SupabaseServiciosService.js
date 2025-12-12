// src/services/supabase/SupabaseServiciosService.js
import { supabase } from './SupabaseClient';
import IServiciosService from '../interfaces/IServiciosService';

export default class SupabaseServiciosService extends IServiciosService {
  constructor() {
    super();
    this.supabase = supabase;
    this.tableName = 'servicios';
  }

 async getAllServicios(filtros = {}) {
  try {
    console.log('📋 Obteniendo servicios con filtros:', filtros);
    
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .order('nombre', { ascending: true });

    // Aplicar filtros - ¡CORREGIDO!
    if (filtros.activo !== undefined && filtros.activo !== 'todos') {
      // Convertir string 'true'/'false' a boolean si es necesario
      const activoValue = filtros.activo === 'true' ? true : 
                         filtros.activo === 'false' ? false : 
                         filtros.activo;
      query = query.eq('activo', activoValue);
    }

    if (filtros.tipo_calculo) {
      query = query.eq('tipo_calculo', filtros.tipo_calculo);
    }

    if (filtros.search) {
      query = query.or(`nombre.ilike.%${filtros.search}%,descripcion.ilike.%${filtros.search}%`);
    }

    if (filtros.precio_min) {
      query = query.gte('precio', filtros.precio_min);
    }

    if (filtros.precio_max) {
      query = query.lte('precio', filtros.precio_max);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error obteniendo servicios:', error);
      throw error;
    }

    console.log(`✅ ${data?.length || 0} servicios obtenidos`);
    return data || [];
  } catch (error) {
    console.error('❌ Error en getAllServicios:', error);
    throw error;
  }
}

  async getServicioById(id) {
    try {
      console.log('🔍 Obteniendo servicio ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error obteniendo servicio:', error);
        throw error;
      }

      console.log('✅ Servicio obtenido:', data?.nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en getServicioById:', error);
      throw error;
    }
  }

  async createServicio(servicioData) {
    try {
      console.log('📝 Creando nuevo servicio...');
      
      const servicioCompleto = {
        ...servicioData,
        fecha_creacion: new Date().toISOString(),
        activo: true
      };

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(servicioCompleto)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creando servicio:', error);
        throw error;
      }

      console.log('✅ Servicio creado:', data.nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en createServicio:', error);
      throw error;
    }
  }

  async updateServicio(id, updates) {
    try {
      console.log('✏️ Actualizando servicio ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updates,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando servicio:', error);
        throw error;
      }

      console.log('✅ Servicio actualizado:', data.nombre);
      return data;
    } catch (error) {
      console.error('❌ Error en updateServicio:', error);
      throw error;
    }
  }

  async deleteServicio(id) {
    try {
      console.log('🗑️ Eliminando servicio ID:', id);
      
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando servicio:', error);
        throw error;
      }

      console.log('✅ Servicio eliminado');
      return true;
    } catch (error) {
      console.error('❌ Error en deleteServicio:', error);
      throw error;
    }
  }

  async cambiarEstadoServicio(id, activo) {
    try {
      console.log('🔄 Cambiando estado de servicio ID:', id, 'a:', activo ? 'activo' : 'inactivo');
      
      return await this.updateServicio(id, { activo });
    } catch (error) {
      console.error('❌ Error en cambiarEstadoServicio:', error);
      throw error;
    }
  }

  async getEstadisticas() {
    try {
      console.log('📊 Obteniendo estadísticas de servicios...');
      
      const { data: servicios, error } = await this.supabase
        .from(this.tableName)
        .select('*');

      if (error) throw error;

      const totalServicios = servicios?.length || 0;
      const serviciosActivos = servicios?.filter(s => s.activo).length || 0;
      const precioPromedio = servicios?.length > 0 
        ? servicios.reduce((sum, s) => sum + parseFloat(s.precio || 0), 0) / servicios.length
        : 0;

      const porTipo = servicios?.reduce((acc, s) => {
        acc[s.tipo_calculo] = (acc[s.tipo_calculo] || 0) + 1;
        return acc;
      }, {});

      const estadisticas = {
        total: totalServicios,
        activos: serviciosActivos,
        inactivos: totalServicios - serviciosActivos,
        precio_promedio: Math.round(precioPromedio * 100) / 100,
        tasa_activos: totalServicios > 0 ? Math.round((serviciosActivos / totalServicios) * 100) : 0,
        por_tipo: porTipo || {}
      };

      console.log('✅ Estadísticas de servicios obtenidas');
      return estadisticas;
    } catch (error) {
      console.error('❌ Error en getEstadisticas:', error);
      throw error;
    }
  }

  async getServiciosMasPopulares() {
    try {
      console.log('🏆 Obteniendo servicios más populares...');
      
      // Esta consulta necesita la tabla reserva_servicios para contar
      const { data, error } = await this.supabase
        .from('reserva_servicios')
        .select(`
          servicio_id,
          servicios(nombre, precio),
          count:cantidad
        `)
        .group('servicio_id, servicios(nombre, precio)')
        .order('count', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('⚠️ No se pudieron obtener servicios populares:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Error en getServiciosMasPopulares:', error);
      return [];
    }
  }
}