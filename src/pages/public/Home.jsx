import React from 'react';
import Gallery from '../../components/Gallery';

export default function Home() {
  const galleryImages = [
    { title: 'Espacios al aire libre', category: 'Espacios' },
    { title: 'Salón de eventos', category: 'Espacios' },
    { title: 'Decoración para bodas', category: 'Bodas' },
    { title: 'Área de fogata', category: 'Fogata' },
    { title: 'Catering especializado', category: 'Catering' },
    { title: 'Mobiliario elegante', category: 'Mobiliario' }
  ];

  const servicios = [
    {
      titulo: 'Alquiler de Quinta',
      descripcion: 'Espacio amplio y natural perfecto para cualquier tipo de evento',
      icon: '🏡'
    },
    {
      titulo: 'Catering',
      descripcion: 'Servicio de comida personalizado para tu evento',
      icon: '🍽️'
    },
    {
      titulo: 'Mobiliario',
      descripcion: 'Sillas, mesas y equipamiento completo para tu celebración',
      icon: '🪑'
    },
    {
      titulo: 'Decoración',
      descripcion: 'Ambientación y decoración temática para hacer tu evento único',
      icon: '🎨'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-orange-600 to-orange-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Alquiler</h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              El lugar perfecto para tus eventos especiales
            </p>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Alquiler para eventos | Catering | Mobiliario | Decoración
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/reservas" className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
                Reservar Ahora
              </a>
              <a href="/servicios" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition">
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
        <div className="bg-white h-16" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }}></div>
      </section>

      {/* Servicios destacados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas para tu evento perfecto</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicios.map((servicio, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-xl transition">
                <div className="text-5xl mb-4">{servicio.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{servicio.titulo}</h3>
                <p className="text-gray-600">{servicio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería destacada */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Galería</h2>
            <p className="text-xl text-gray-600">Conoce nuestros espacios y eventos</p>
          </div>
          <Gallery images={galleryImages} />
          <div className="text-center mt-8">
            <a href="/galeria" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
              Ver galería completa
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}