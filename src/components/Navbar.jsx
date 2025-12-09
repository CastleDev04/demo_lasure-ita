import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-orange-600">Alquiler</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition">Inicio</Link>
            <Link to="/servicios" className="text-gray-700 hover:text-orange-600 transition">Servicios</Link>
            <Link to="/galeria" className="text-gray-700 hover:text-orange-600 transition">Galería</Link>
            <Link to="/reservas" className="text-gray-700 hover:text-orange-600 transition">Reservas</Link>
            <Link to="/contacto" className="text-gray-700 hover:text-orange-600 transition">Contacto</Link>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="text-orange-600" /> : <Menu className="text-orange-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded">Inicio</Link>
            <Link to="/servicios" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded">Servicios</Link>
            <Link to="/galeria" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded">Galería</Link>
            <Link to="/reservas" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded">Reservas</Link>
            <Link to="/contacto" className="block px-3 py-2 text-gray-700 hover:bg-orange-50 rounded">Contacto</Link>
          </div>
        </div>
      )}
    </nav>
  );
}