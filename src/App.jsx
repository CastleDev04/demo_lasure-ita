import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import Servicios from './pages/public/Servicios';
import Galeria from './pages/public/Galeria';
import Reservas from './pages/public/Reservas';
import Contacto from './pages/public/Contacto';
import AdminLogin from './pages/private/Login';
import Dashboard from './pages/private/Dashboard';
import AdminReservas from './pages/private/Reservas';
import AdminGaleria from './pages/private/Galeria';
import AdminUsuarios from './pages/private/Usuarios';
import AdminLayout from './pages/private/AdminLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_authenticated') === 'true'
  );
  
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  const handleLogin = () => {
    localStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Solo mostrar Navbar y Footer en rutas públicas */}
        {!isAdminRoute && <Navbar />}
        
        <main className="flex-grow">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/contacto" element={<Contacto />} />
            
            {/* Rutas de administración */}
            <Route 
              path="/admin/login" 
              element={<AdminLogin onLogin={handleLogin} />} 
            />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout onLogout={handleLogout} />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="reservas" element={<AdminReservas />} />
              <Route path="galeria" element={<AdminGaleria />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* Solo mostrar Footer en rutas públicas */}
        {!isAdminRoute && <Footer />}
      </div>
    </Router>
  );
}

export default App;