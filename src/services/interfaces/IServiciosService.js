// src/services/interfaces/IServiciosService.js
export default class IServiciosService {
  async getAllServicios(filtros = {}) {
    throw new Error('Método getAllServicios debe ser implementado');
  }

  async getServicioById(id) {
    throw new Error('Método getServicioById debe ser implementado');
  }

  async createServicio(servicioData) {
    throw new Error('Método createServicio debe ser implementado');
  }

  async updateServicio(id, updates) {
    throw new Error('Método updateServicio debe ser implementado');
  }

  async deleteServicio(id) {
    throw new Error('Método deleteServicio debe ser implementado');
  }

  async getEstadisticas() {
    throw new Error('Método getEstadisticas debe ser implementado');
  }

  async cambiarEstadoServicio(id, activo) {
    throw new Error('Método cambiarEstadoServicio debe ser implementado');
  }
}