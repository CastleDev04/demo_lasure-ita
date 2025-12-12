// src/services/interfaces/IPagosService.js
export default class IPagosService {
  async getAllPagos(filtros = {}) {
    throw new Error('Método getAllPagos debe ser implementado');
  }

  async getPagoById(id) {
    throw new Error('Método getPagoById debe ser implementado');
  }

  async crearPago(pagoData) {
    throw new Error('Método crearPago debe ser implementado');
  }

  async actualizarPago(id, updates) {
    throw new Error('Método actualizarPago debe ser implementado');
  }

  async eliminarPago(id) {
    throw new Error('Método eliminarPago debe ser implementado');
  }

  async getPagosPorReserva(reservaId) {
    throw new Error('Método getPagosPorReserva debe ser implementado');
  }

  async getEstadisticasPagos() {
    throw new Error('Método getEstadisticasPagos debe ser implementado');
  }

  async getBalanceReserva(reservaId) {
    throw new Error('Método getBalanceReserva debe ser implementado');
  }

  async registrarPagoCompleto(reservaId, metodo) {
    throw new Error('Método registrarPagoCompleto debe ser implementado');
  }

  async registrarAnticipo(reservaId, monto, metodo) {
    throw new Error('Método registrarAnticipo debe ser implementado');
  }
}