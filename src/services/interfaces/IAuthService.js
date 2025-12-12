/**
 * Interfaz para servicios de autenticación
 */
export default class IAuthService {
  async signIn(email, password) {
    throw new Error('Método signIn no implementado');
  }

  async signUp(userData) {
    throw new Error('Método signUp no implementado');
  }

  async signOut() {
    throw new Error('Método signOut no implementado');
  }

  async getCurrentUser() {
    throw new Error('Método getCurrentUser no implementado');
  }

  async resetPassword(email) {
    throw new Error('Método resetPassword no implementado');
  }

  isAuthenticated() {
    throw new Error('Método isAuthenticated no implementado');
  }

  getUserRole() {
    throw new Error('Método getUserRole no implementado');
  }

  isAdmin() {
    throw new Error('Método isAdmin no implementado');
  }
}