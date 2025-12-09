import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Bell, Search, LogOut,
  Home, Calendar, Image as ImageIcon,
  Users, BarChart3, DollarSign, Settings
} from 'lucide-react';

export default function AdminLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
    { id: 'reservas', label: 'Reservas', icon: Calendar, path: '/admin/reservas' },
    { id: 'galeria', label: 'Galería', icon: ImageIcon, path: '/admin/galeria' },
    { id: 'usuarios', label: 'Usuarios', icon: Users, path: '/admin/usuarios' },
    { id: 'clientes', label: 'Clientes', icon: Users, path: '/admin/clientes' },
    // { id: 'finanzas', label: 'Finanzas', icon: DollarSign, path: '/admin/finanzas' },
    // { id: 'configuracion', label: 'Configuración', icon: Settings, path: '/admin/configuracion' },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  const handleNavigation = (path, id) => {
    setActiveTab(id);
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y botón hamburguesa */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-2"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Alquiler</h1>
                  <p className="text-sm text-gray-600">Panel de Administración</p>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda y notificaciones */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none w-64"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Perfil de usuario */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="font-medium text-gray-900">Alexis Castillo</p>
                  <p className="text-sm text-gray-600">Administrador</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-white font-semibold">
                  LS
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar para desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigation(item.path, item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-l-4 border-orange-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              
              {/* Estadísticas rápidas */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Resumen del día
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reservas hoy:</span>
                    <span className="font-semibold text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Eventos activos:</span>
                    <span className="font-semibold text-green-600">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mensajes nuevos:</span>
                    <span className="font-semibold text-blue-600">5</span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Sidebar móvil */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                <nav className="p-4 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Menú</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <ul className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleNavigation(item.path, item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                              activeTab === item.id
                                ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-l-4 border-orange-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Contenido principal */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}