import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import Servicios from './pages/public/Servicios';
import Galeria from './pages/public/Galeria';
import Reservas from './pages/public/Reservas';
import Contacto from './pages/public/Contacto';
import AdminLogin from './pages/private/Login';
import AdminRegister from './pages/private/Register'; // 🔥 NUEVO
import Dashboard from './pages/private/Dashboard';
import AdminReservas from './pages/private/Reservas';
import AdminGaleria from './pages/private/Galeria';
import AdminUsuarios from './pages/private/Usuarios';
import AdminClientes from './pages/private/Clientes';
import AdminServicios from './pages/private/Servicios';
import AdminLayout from './pages/private/AdminLayout';
import AdminPagos from './pages/private/Pagos';

function App() {
  // Verificar si es ruta de admin
  const isAdminRoute = () => {
    return window.location.pathname.startsWith('/admin');
  };

  return (
    <Router>
      {/* 🔥 AuthProvider envuelve TODA la aplicación */}
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {/* Solo mostrar Navbar y Footer en rutas públicas */}
          {!isAdminRoute() && <Navbar />}
          
          <main className="flex-grow">
            <Routes>
              {/* ====================== */}
              {/* 🏠 RUTAS PÚBLICAS */}
              {/* ====================== */}
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/contacto" element={<Contacto />} />
              
              {/* ====================== */}
              {/* 🔐 RUTAS DE AUTENTICACIÓN */}
              {/* ====================== */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} /> {/* 🔥 NUEVA RUTA */}
              
              {/* ====================== */}
              {/* 🛡️ RUTAS PROTEGIDAS */}
              {/* ====================== */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="reservas" element={<AdminReservas />} />
                <Route path="galeria" element={<AdminGaleria />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="clientes" element={<AdminClientes />} />
                <Route path="pagos" element={<AdminPagos />} />
                <Route path="servicios" element={<AdminServicios />} />
                {/* Agrega aquí más rutas protegidas */}
                <Route path="*" element={<Navigate to="/admin" />} />
              </Route>
              
              {/* ====================== */}
              {/* 🔀 RUTAS ESPECIALES */}
              {/* ====================== */}
              {/* Redirección para cuando alguien va a /admin sin estar logueado */}
              <Route path="/admin" element={<Navigate to="/admin/login" />} />
              
              {/* Página 404 personalizada (opcional) */}
              <Route path="/404" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">404</h1>
                    <p className="text-gray-600 mt-2">Página no encontrada</p>
                    <a href="/" className="mt-4 inline-block text-orange-600 hover:text-orange-700">
                      Volver al inicio
                    </a>
                  </div>
                </div>
              } />
              
              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          {/* Solo mostrar Footer en rutas públicas */}
          {!isAdminRoute() && <Footer />}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;