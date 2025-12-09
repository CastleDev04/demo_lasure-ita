import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">LS</span>
              </div>
              <span className="ml-3 text-2xl font-bold">Alquiler</span>
            </div>
            <p className="text-gray-400">El lugar perfecto para tus eventos especiales.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Inicio</a></li>
              <li><a href="/servicios" className="text-gray-400 hover:text-white transition">Servicios</a></li>
              <li><a href="/galeria" className="text-gray-400 hover:text-white transition">Galería</a></li>
              <li><a href="/reservas" className="text-gray-400 hover:text-white transition">Reservas</a></li>
              <li><a href="/contacto" className="text-gray-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Alquiler de Quinta</li>
              <li className="text-gray-400">Catering</li>
              <li className="text-gray-400">Mobiliario</li>
              <li className="text-gray-400">Decoración</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Capiatá km 21, ruta 1</li>
              <li>+595 XXX XXX XXX</li>
              <li>@alquiler</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 Alquiler. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}