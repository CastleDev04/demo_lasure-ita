import React from 'react';
import { CheckCircle, Settings, Utensils, Palette, Home, Sparkles } from 'lucide-react';

export default function Servicios() {
  const serviciosCompletos = [
    {
      icon: <Home size={40} className="text-orange-600" />,
      titulo: 'Alquiler de Quinta',
      descripcion: 'Disponemos de un espacio amplio y natural perfecto para cualquier tipo de evento. Áreas verdes, salón principal y espacios al aire libre.',
      caracteristicas: [
        'Capacidad para 200 personas',
        'Estacionamiento amplio',
        'Baños completos',
        'Cocina equipada',
        'Área de fogata'
      ]
    },
    {
      icon: <Utensils size={40} className="text-orange-600" />,
      titulo: 'Catering',
      descripcion: 'Servicio de comida personalizado para tu evento con menús adaptados a tus necesidades y preferencias.',
      caracteristicas: [
        'Menú personalizado',
        'Opción vegetariana/vegana',
        'Postres especiales',
        'Bebidas incluidas',
        'Personal de servicio'
      ]
    },
    {
      icon: <Settings size={40} className="text-orange-600" />,
      titulo: 'Mobiliario',
      descripcion: 'Sillas, mesas y equipamiento completo para tu celebración. Diferentes estilos disponibles.',
      caracteristicas: [
        'Mesas redondas y rectangulares',
        'Sillas elegantes',
        'Mobiliario infantil',
        'Barras para bebidas',
        'Pista de baile'
      ]
    },
    {
      icon: <Palette size={40} className="text-orange-600" />,
      titulo: 'Decoración',
      descripcion: 'Ambientación y decoración temática para hacer tu evento único y memorable.',
      caracteristicas: [
        'Decoración temática',
        'Centros de mesa',
        'Iluminación especial',
        'Arreglos florales',
        'Ambientación completa'
      ]
    },
    {
      icon: <Sparkles size={40} className="text-orange-600" />,
      titulo: 'Coordinación de Eventos',
      descripcion: 'Servicio completo de coordinación para que solo te preocupes por disfrutar.',
      caracteristicas: [
        'Coordinador dedicado',
        'Planificación detallada',
        'Proveedores confiables',
        'Timeline del evento',
        'Soporte durante el evento'
      ]
    }
  ];

  const paquetes = [
    {
      nombre: 'Básico',
      precio: '$1500000',
      descripcion: 'Ideal para eventos pequeños',
      servicios: ['Alquiler de espacio', 'Mobiliario básico', 'Electricidad'],
      destacado: false
    },
    {
      nombre: 'Estándar',
      precio: '$2000000',
      descripcion: 'Perfecto para la mayoría de eventos',
      servicios: ['Alquiler de espacio', 'Mobiliario completo', 'Decoración básica', 'Coordinador'],
      destacado: true
    },
    {
      nombre: 'Premium',
      precio: '$3500000',
      descripcion: 'Eventos de lujo completos',
      servicios: ['Alquiler de espacio', 'Mobiliario premium', 'Decoración completa', 'Catering básico', 'Coordinador full-time'],
      destacado: false
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Nuestros Servicios</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Ofrecemos todo lo necesario para que tu evento sea inolvidable
          </p>
        </div>
      </section>

      {/* Servicios detallados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {serviciosCompletos.map((servicio, index) => (
              <div key={index} className="bg-amber-50 rounded-xl p-8 shadow-lg">
                <div className="flex items-start mb-6">
                  <div className="bg-white p-3 rounded-lg shadow mr-4">
                    {servicio.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{servicio.titulo}</h3>
                    <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {servicio.caracteristicas.map((caracteristica, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      <span className="text-gray-700">{caracteristica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paquetes */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Paquetes Disponibles</h2>
            <p className="text-xl text-gray-600">Elige el paquete que mejor se adapte a tus necesidades</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {paquetes.map((paquete, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-8 shadow-lg ${paquete.destacado ? 'border-2 border-orange-600 transform scale-105' : ''}`}
              >
                {paquete.destacado && (
                  <div className="bg-orange-600 text-white text-center py-2 px-4 rounded-full -mt-10 mb-6 inline-block">
                    Más popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{paquete.nombre}</h3>
                <div className="text-4xl font-bold text-orange-600 mb-4">{paquete.precio}</div>
                <p className="text-gray-600 mb-6">{paquete.descripcion}</p>
                <ul className="space-y-3 mb-8">
                  {paquete.servicios.map((servicio, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                      <span>{servicio}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/reservas" 
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                    paquete.destacado 
                      ? 'bg-orange-600 text-white hover:bg-orange-700' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Seleccionar Paquete
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Necesitas algo personalizado?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Contáctanos para crear un paquete a medida para tu evento especial
          </p>
          <a 
            href="/contacto" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
          >
            Contactar para personalizar
          </a>
        </div>
      </section>
    </div>
  );
}