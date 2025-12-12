import { IClientesService } from '../interfaces/IClientesService';
import {supabase }from './supabaseClient';

export default class SupabaseClientesService extends IClientesService {
  async getClientes() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error al obtener clientes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getClientes:', error);
      throw error;
    }
  }

  async getClienteById(id) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error al obtener cliente:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en getClienteById:', error);
      throw error;
    }
  }

  async createCliente(clienteData) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single();

      if (error) {
        console.error('Error al crear cliente:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en createCliente:', error);
      throw error;
    }
  }

  async updateCliente(id, clienteData) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar cliente:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en updateCliente:', error);
      throw error;
    }
  }

  async deleteCliente(id) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error al eliminar cliente:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error en deleteCliente:', error);
      throw error;
    }
  }

  async searchClientes(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .or(`nombre.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefono.ilike.%${searchTerm}%`)
        .order('nombre', { ascending: true });

      if (error) {
        console.error('Error al buscar clientes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en searchClientes:', error);
      throw error;
    }
  }
}