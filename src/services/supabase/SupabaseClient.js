import { createClient } from '@supabase/supabase-js';

// URL y clave de tu proyecto Supabase
// Estas las obtienes de: supabase.com → tu proyecto → Settings → API
const supabaseUrl = 'https://jzrjyhpaszwvkxtyzxqt.supabase.co'; // CAMBIAR POR TU URL
const supabaseAnonKey = 'sb_publishable_ggb-k3WiuGUTqxbdZDqOhA_4jpFRZsk'; // CAMBIAR POR TU KEY

// Verificar que tenemos las credenciales
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERROR: Faltan credenciales de Supabase');
  console.log('Ve a supabase.com, crea un proyecto y obtén:');
  console.log('1. URL (ej: https://abc123.supabase.co)');
  console.log('2. anon key (empieza con eyJ...)');
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Función para probar la conexión con Supabase
 */
export const testSupabaseConnection = async () => {
  console.log('🔗 Probando conexión a Supabase...');
  
  try {
    // Intentar obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️  Supabase conectado, pero error en auth:', error.message);
    } else {
      console.log('✅ Supabase conectado correctamente');
      console.log('📡 URL:', supabaseUrl);
      if (session) {
        console.log('👤 Sesión activa:', session.user.email);
      }
    }
    
    return { success: true, session };
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return { success: false, error: error.message };
  }
};