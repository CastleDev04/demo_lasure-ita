import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Clock, Send } from 'lucide-react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensaje enviado. Te contactaremos pronto.');
    console.log('Mensaje de contacto:', formData);
  };

  const horarios = [
    { dia: 'Lunes a Viernes', hora: '8:00 AM - 6:00 PM' },
    { dia: 'Sábados', hora: '9:00 AM - 4:00 PM' },
    { dia: 'Domingos', hora: 'Solo eventos' }
  ];

  const preguntasFrecuentes = [
    {
      pregunta: '¿Cuál es la capacidad máxima?',
      respuesta: 'Nuestra quinta tiene capacidad para 200 personas en el salón principal y hasta 250 en eventos al aire libre.'
    },
    {
      pregunta: '¿Está incluido el mobiliario?',
      respuesta: 'Sí, todos nuestros paquetes incluyen mobiliario básico. Contamos con opciones premium disponibles.'
    },
    {
      pregunta: '¿Se permite música en vivo?',
      respuesta: 'Sí, permitimos música en vivo hasta las 11:00 PM de domingo a jueves, y hasta la 1:00 AM viernes y sábado.'
    },
    {
      pregunta: '¿Hay estacionamiento?',
      respuesta: 'Sí, contamos con estacionamiento privado gratuito para 50 vehículos.'
    },
    {
      pregunta: '¿Se permite decoración externa?',
      respuesta: 'Sí, puedes traer tu propia decoración o podemos recomendarte proveedores confiables.'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contáctanos</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Estamos aquí para responder tus preguntas y hacer realidad tu evento soñado
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Información de contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Información de Contacto</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <MapPin className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Ubicación</h3>
                    <p className="text-gray-600">Capiatá km 21, ruta 1</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 transition text-sm"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Phone className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Teléfono</h3>
                    <p className="text-gray-600">+595 XXX XXX XXX</p>
                    <p className="text-gray-600">+595 XXX XXX XXX</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Mail className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@lasurenita.com</p>
                    <p className="text-gray-600">reservas@lasurenita.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Instagram className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Redes Sociales</h3>
                    <a 
                      href="https://instagram.com/lasurenita.py" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 transition block"
                    >
                      @lasurenita.py
                    </a>
                    <a 
                      href="https://facebook.com/lasurenita" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-orange-600 transition block"
                    >
                      /lasurenita
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Clock className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">Horarios de Atención</h3>
                    <div className="space-y-2">
                      {horarios.map((horario, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-700">{horario.dia}:</span>
                          <span className="font-semibold">{horario.hora}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario y FAQ */}
          <div className="lg:col-span-2">
            {/* Formulario de contacto */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nombre completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Asunto</label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-2">Mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    rows="6"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Preguntas frecuentes */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Preguntas Frecuentes</h2>
              
              <div className="space-y-4">
                {preguntasFrecuentes.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
                      onClick={(e) => {
                        const content = e.currentTarget.nextElementSibling;
                        content.classList.toggle('hidden');
                        e.currentTarget.querySelector('span').textContent = 
                          content.classList.contains('hidden') ? '+' : '−';
                      }}
                    >
                      <span className="font-semibold text-gray-800">{faq.pregunta}</span>
                      <span className="text-xl text-orange-600">+</span>
                    </button>
                    <div className="hidden p-4">
                      <p className="text-gray-600">{faq.respuesta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Cómo llegar</h2>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold mb-2">Quinta La Sureñita</h3>
              <p className="text-orange-100">Capiatá km 21, ruta 1</p>
              <p className="text-orange-100 mt-4">A 30 minutos del centro de Asunción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}