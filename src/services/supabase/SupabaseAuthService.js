// SupabaseAuthService.js - COMPLETO
import { supabase } from "./SupabaseClient"

export default class SupabaseAuthService {
  constructor() {
    this.supabase = supabase;
    console.log('🔧 SupabaseAuthService inicializado');
  }

  // 🔑 MÉTODO FALTANTE: Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data, error } = await this.supabase.auth.getUser();
      
      if (error) {
        console.warn('⚠️ Error obteniendo usuario actual:', error.message);
        return null;
      }
      
      if (!data?.user) {
        return null;
      }

      // Obtener datos adicionales de la tabla users
      const { data: userProfile } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const completeUser = {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        ...data.user.user_metadata, // Datos del metadata de auth
        ...userProfile // Datos de tu tabla
      };

      return completeUser;
    } catch (error) {
      console.error('❌ Error en getCurrentUser:', error);
      return null;
    }
  }

  // 🔑 Método para verificar si está autenticado
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // 🔑 Método para obtener rol del usuario
  async getUserRole() {
    const user = await this.getCurrentUser();
    return user?.rol || null;
  }

  // 🔑 Método para verificar si es admin
  async isAdmin() {
    const role = await this.getUserRole();
    return role === 'admin';
  }

  // 🔑 MÉTODO FALTANTE: Cerrar sesión
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error en signOut:', error.message);
      throw error;
    }
  }

  // 🔑 MÉTODO FALTANTE: Recuperar contraseña
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      
      if (error) throw error;
      
      console.log('✅ Email de recuperación enviado a:', email);
      return { success: true, message: 'Email de recuperación enviado' };
    } catch (error) {
      console.error('❌ Error en resetPassword:', error.message);
      throw error;
    }
  }

  // 🔑 MÉTODO FALTANTE: Obtener sesión actual
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  // 🔑 MÉTODO FALTANTE: Actualizar perfil de usuario
  async updateProfile(userId, updates) {
    try {
      // Actualizar metadata en auth
      const { error: authError } = await this.supabase.auth.updateUser({
        data: updates
      });

      if (authError) throw authError;

      // Actualizar en tabla users
      const { data, error: dbError } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('✅ Perfil actualizado para:', data.email);
      return { success: true, user: data };
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error.message);
      throw error;
    }
  }

  // ========== MÉTODOS QUE YA TIENES ==========

  async signUp(userData) {
    console.log('📝 Supabase signUp llamado para:', userData.email);
    
    try {
      // 1. Crear usuario en Auth de Supabase (sin enviar datos extra)
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre,
            apellido: userData.apellido,
            telefono: userData.telefono,
            rol: userData.rol
          }
        }
      });

      if (authError) {
        console.error('❌ Error en signUp de auth:', authError.message);
        throw authError;
      }

      console.log('✅ Usuario creado en auth:', authData.user?.email);

      // 2. Crear registro en tu tabla users SIN password
      const { data: userRecord, error: dbError } = await this.supabase
        .from('users')
        .insert({
          id: authData.user.id, // Mismo ID que en auth.users
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          rol: userData.rol,
          fecha_registro: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Error creando usuario en tabla:', dbError.message);
        
        // Si falla crear en la tabla, rollback: eliminar usuario de auth
        await this.supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Error creando perfil de usuario: ${dbError.message}`);
      }

      console.log('✅ Usuario creado en tabla:', userRecord.email);

      // 3. Retornar usuario unificado
      const completeUser = {
        id: authData.user.id,
        email: authData.user.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        rol: userData.rol,
        created_at: authData.user.created_at,
        token: authData.session?.access_token,
        ...userRecord
      };

      return {
        user: completeUser,
        session: authData.session,
        message: 'Usuario registrado exitosamente'
      };

    } catch (error) {
      console.error('❌ Error completo en signUp:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    console.log('🔐 Supabase signIn llamado para:', email);
    
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Obtener datos adicionales de tu tabla users
      const { data: userProfile, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ No se encontró perfil de usuario, usando datos básicos');
      }

      const completeUser = {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        ...data.user.user_metadata, // Datos del metadata de auth
        ...userProfile // Datos de tu tabla
      };

      console.log('✅ Login exitoso para:', completeUser.email);

      return {
        user: completeUser,
        session: data.session,
        message: 'Login exitoso'
      };

    } catch (error) {
      console.error('❌ Error en signIn:', error.message);
      throw error;
    }
  }
}