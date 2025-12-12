// src/services/supabase/SupabasePagosService.js
import { supabase } from './SupabaseClient';
import IPagosService from '../interfaces/IPagosService';

export default class SupabasePagosService extends IPagosService {
  constructor() {
    super();
    this.supabase = supabase;
    this.tableName = 'pagos';
  }

  async getAllPagos(filtros = {}) {
    try {
      console.log('💰 Obteniendo pagos con filtros:', filtros);
      
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          reserva:reservas(*, cliente:clientes(*))
        `)
        .order('fecha_pago', { ascending: false });

      // Aplicar filtros
      if (filtros.reserva_id) {
        query = query.eq('reserva_id', filtros.reserva_id);
      }

      if (filtros.estado && filtros.estado !== 'todos') {
        query = query.eq('estado', filtros.estado);
      }

      if (filtros.tipo && filtros.tipo !== 'todos') {
        query = query.eq('tipo', filtros.tipo);
      }

      if (filtros.metodo) {
        query = query.eq('metodo', filtros.metodo);
      }

      if (filtros.fecha_desde) {
        query = query.gte('fecha_pago', filtros.fecha_desde);
      }

      if (filtros.fecha_hasta) {
        query = query.lte('fecha_pago', filtros.fecha_hasta);
      }

      if (filtros.search) {
        query = query.or(`comprobante.ilike.%${filtros.search}%,notas.ilike.%${filtros.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error obteniendo pagos:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} pagos obtenidos`);
      return data || [];
    } catch (error) {
      console.error('❌ Error en getAllPagos:', error);
      throw error;
    }
  }

  async getPagoById(id) {
    try {
      console.log('🔍 Obteniendo pago ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          reserva:reservas(*, cliente:clientes(*))
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error obteniendo pago:', error);
        throw error;
      }

      console.log('✅ Pago obtenido:', data?.comprobante || data?.id);
      return data;
    } catch (error) {
      console.error('❌ Error en getPagoById:', error);
      throw error;
    }
  }

  async crearPago(pagoData) {
    try {
      console.log('💳 Creando nuevo pago...');
      
      // Generar código de comprobante automático
      const comprobante = `PAGO-${Date.now().toString().slice(-8)}`;
      
      const pagoCompleto = {
        ...pagoData,
        comprobante,
        fecha_pago: pagoData.fecha_pago || new Date().toISOString(),
        estado: 'completado',
        fecha_creacion: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(pagoCompleto)
        .select(`
          *,
          reserva:reservas(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error creando pago:', error);
        throw error;
      }

      console.log('✅ Pago creado:', data.comprobante);
      return data;
    } catch (error) {
      console.error('❌ Error en crearPago:', error);
      throw error;
    }
  }

  async actualizarPago(id, updates) {
    try {
      console.log('✏️ Actualizando pago ID:', id);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          ...updates,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          reserva:reservas(*)
        `)
        .single();

      if (error) {
        console.error('❌ Error actualizando pago:', error);
        throw error;
      }

      console.log('✅ Pago actualizado:', data.comprobante);
      return data;
    } catch (error) {
      console.error('❌ Error en actualizarPago:', error);
      throw error;
    }
  }

  async eliminarPago(id) {
    try {
      console.log('🗑️ Eliminando pago ID:', id);
      
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando pago:', error);
        throw error;
      }

      console.log('✅ Pago eliminado');
      return true;
    } catch (error) {
      console.error('❌ Error en eliminarPago:', error);
      throw error;
    }
  }

  async getPagosPorReserva(reservaId) {
    try {
      console.log('📋 Obteniendo pagos para reserva:', reservaId);
      
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('reserva_id', reservaId)
        .order('fecha_pago', { ascending: false });

      if (error) {
        console.error('❌ Error obteniendo pagos por reserva:', error);
        throw error;
      }

      console.log(`✅ ${data?.length || 0} pagos obtenidos para reserva ${reservaId}`);
      return data || [];
    } catch (error) {
      console.error('❌ Error en getPagosPorReserva:', error);
      throw error;
    }
  }

  async getEstadisticasPagos() {
    try {
      console.log('📊 Obteniendo estadísticas de pagos...');
      
      // Obtener pagos del mes
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const { data: pagosMes, error: errorPagos } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gte('fecha_pago', inicioMes.toISOString());

      if (errorPagos) throw errorPagos;

      // Cálculos
      const totalRecaudado = pagosMes?.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0) || 0;
      const pagosHoy = pagosMes?.filter(p => 
        new Date(p.fecha_pago).toDateString() === new Date().toDateString()
      ).length || 0;

      // Agrupar por método
      const porMetodo = pagosMes?.reduce((acc, pago) => {
        const metodo = pago.metodo || 'desconocido';
        acc[metodo] = (acc[metodo] || 0) + 1;
        return acc;
      }, {});

      // Agrupar por estado
      const porEstado = pagosMes?.reduce((acc, pago) => {
        const estado = pago.estado || 'desconocido';
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {});

      const estadisticas = {
        total_recaudado: totalRecaudado,
        pagos_hoy: pagosHoy,
        pagos_mes: pagosMes?.length || 0,
        promedio_pago: pagosMes?.length > 0 ? totalRecaudado / pagosMes.length : 0,
        por_metodo: porMetodo || {},
        por_estado: porEstado || {}
      };

      console.log('✅ Estadísticas de pagos obtenidas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error en getEstadisticasPagos:', error);
      throw error;
    }
  }

  async getBalanceReserva(reservaId) {
    try {
      console.log('⚖️ Obteniendo balance para reserva:', reservaId);
      
      // Obtener la reserva
      const { data: reserva, error: errorReserva } = await this.supabase
        .from('reservas')
        .select('total, anticipo')
        .eq('id', reservaId)
        .single();

      if (errorReserva) throw errorReserva;

      // Obtener pagos de la reserva
      const pagos = await this.getPagosPorReserva(reservaId);

      const totalPagado = pagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0);
      const totalReserva = parseFloat(reserva.total) || 0;
      const saldoPendiente = totalReserva - totalPagado;
      const porcentajePagado = totalReserva > 0 ? (totalPagado / totalReserva) * 100 : 0;

      const balance = {
        total_reserva: totalReserva,
        total_pagado: totalPagado,
        saldo_pendiente: saldoPendiente,
        porcentaje_pagado: Math.round(porcentajePagado * 100) / 100,
        pagos: pagos.map(pago => ({
          id: pago.id,
          monto: pago.monto,
          tipo: pago.tipo,
          metodo: pago.metodo,
          fecha: pago.fecha_pago,
          comprobante: pago.comprobante
        }))
      };

      console.log('✅ Balance obtenido:', balance);
      return balance;
    } catch (error) {
      console.error('❌ Error en getBalanceReserva:', error);
      throw error;
    }
  }

  async registrarPagoCompleto(reservaId, metodo = 'efectivo') {
    try {
      console.log('💯 Registrando pago completo para reserva:', reservaId);
      
      // Obtener balance actual
      const balance = await this.getBalanceReserva(reservaId);
      
      if (balance.saldo_pendiente <= 0) {
        throw new Error('La reserva ya está pagada completamente');
      }

      // Crear pago por el saldo pendiente
      const pagoData = {
        reserva_id: reservaId,
        monto: balance.saldo_pendiente,
        tipo: 'pago_completo',
        metodo: metodo,
        notas: 'Pago completo del saldo pendiente'
      };

      const pago = await this.crearPago(pagoData);

      // Actualizar estado de la reserva a pagado
      const { error: errorReserva } = await this.supabase
        .from('reservas')
        .update({ 
          pagado: true,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', reservaId);

      if (errorReserva) throw errorReserva;

      console.log('✅ Pago completo registrado:', pago.comprobante);
      return { 
        success: true, 
        pago_id: pago.id,
        reserva_id: reservaId,
        mensaje: 'Pago completo registrado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en registrarPagoCompleto:', error);
      throw error;
    }
  }

  async registrarAnticipo(reservaId, monto, metodo = 'efectivo') {
    try {
      console.log('💰 Registrando anticipo para reserva:', reservaId, 'Monto:', monto);
      
      if (monto <= 0) {
        throw new Error('El monto del anticipo debe ser mayor a 0');
      }

      // Obtener balance actual
      const balance = await this.getBalanceReserva(reservaId);
      
      if (monto > balance.saldo_pendiente) {
        throw new Error(`El anticipo no puede exceder el saldo pendiente ($${balance.saldo_pendiente})`);
      }

      // Crear pago de anticipo
      const pagoData = {
        reserva_id: reservaId,
        monto: monto,
        tipo: 'anticipo',
        metodo: metodo,
        notas: 'Anticipo registrado'
      };

      const pago = await this.crearPago(pagoData);

      // Actualizar anticipo en la reserva
      const { data: reserva, error: errorReserva } = await this.supabase
        .from('reservas')
        .select('anticipo')
        .eq('id', reservaId)
        .single();

      if (errorReserva) throw errorReserva;

      const nuevoAnticipo = (parseFloat(reserva.anticipo) || 0) + monto;
      
      await this.supabase
        .from('reservas')
        .update({ 
          anticipo: nuevoAnticipo,
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('id', reservaId);

      console.log('✅ Anticipo registrado:', pago.comprobante);
      return { 
        success: true, 
        pago_id: pago.id,
        reserva_id: reservaId,
        monto: monto,
        mensaje: 'Anticipo registrado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en registrarAnticipo:', error);
      throw error;
    }
  }
}