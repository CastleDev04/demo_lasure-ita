import React, { useState } from 'react';
import { Calendar, Users, Phone, Mail, CheckCircle } from 'lucide-react';

export default function Reservas() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha: '',
    tipoEvento: '',
    personas: '',
    servicio: '',
    mensaje: ''
  });

  const [step, setStep] = useState(1);

  const tiposEvento = [
    { value: 'boda', label: '🎎 Boda' },
    { value: 'cumpleaños', label: '🎂 Cumpleaños' },
    { value: 'corporativo', label: '💼 Evento Corporativo' },
    { value: 'familiar', label: '👨‍👩‍👧‍👦 Reunión Familiar' },
    { value: 'quince', label: '👸 Quinceañera' },
    { value: 'graduacion', label: '🎓 Graduación' },
    { value: 'otro', label: '✨ Otro' }
  ];

  const servicios = [
    { value: 'alquiler', label: 'Solo alquiler de espacio' },
    { value: 'basico', label: 'Paquete básico' },
    { value: 'estandar', label: 'Paquete estándar' },
    { value: 'premium', label: 'Paquete premium' },
    { value: 'personalizado', label: 'Paquete personalizado' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Reserva enviada con éxito! Nos pondremos en contacto contigo pronto.');
    console.log('Datos de reserva:', formData);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const paso1Valido = () => {
    return formData.nombre && formData.email && formData.telefono;
  };

  const paso2Valido = () => {
    return formData.fecha && formData.tipoEvento && formData.personas;
  };

  return (
    <div className="min-h-screen pt-16 bg-amber-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Reserva tu Evento</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Completa el formulario y nos pondremos en contacto para coordinar todos los detalles
          </p>
        </div>
      </section>

      {/* Progreso */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > num ? <CheckCircle size={24} /> : num}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {num === 1 ? 'Datos' : num === 2 ? 'Evento' : 'Confirmación'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Paso 1: Información personal */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h2>
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
                    <label className="block text-gray-700 font-semibold mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!paso1Valido()}
                      className={`px-8 py-3 rounded-lg font-semibold transition ${
                        paso1Valido() 
                          ? 'bg-orange-600 text-white hover:bg-orange-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Detalles del evento */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalles del Evento</h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Fecha del evento *</label>
                      <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Cantidad de personas *</label>
                      <input
                        type="number"
                        name="personas"
                        value={formData.personas}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Tipo de evento *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {tiposEvento.map((tipo) => (
                        <label 
                          key={tipo.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                            formData.tipoEvento === tipo.value
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-300 hover:border-orange-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tipoEvento"
                            value={tipo.value}
                            checked={formData.tipoEvento === tipo.value}
                            onChange={handleInputChange}
                            className="mr-2"
                            required
                          />
                          {tipo.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Servicio deseado</label>
                    <select
                      name="servicio"
                      value={formData.servicio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.value} value={servicio.value}>
                          {servicio.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!paso2Valido()}
                      className={`px-8 py-3 rounded-lg font-semibold transition ${
                        paso2Valido() 
                          ? 'bg-orange-600 text-white hover:bg-orange-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmación y Mensaje</h2>
                  
                  <div className="mb-8 p-6 bg-amber-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Resumen de tu reserva</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Nombre</p>
                        <p className="font-semibold">{formData.nombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha del evento</p>
                        <p className="font-semibold">{formData.fecha}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tipo de evento</p>
                        <p className="font-semibold">
                          {tiposEvento.find(t => t.value === formData.tipoEvento)?.label || 'No especificado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cantidad de personas</p>
                        <p className="font-semibold">{formData.personas}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Mensaje adicional</label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      placeholder="Cuéntanos más sobre tu evento, necesidades especiales, o cualquier pregunta que tengas..."
                    ></textarea>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="terminos"
                      required
                      className="mr-2"
                    />
                    <label htmlFor="terminos" className="text-gray-700">
                      Acepto los términos y condiciones y autorizo el tratamiento de mis datos
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                    >
                      Enviar Reserva
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Información de contacto adicional */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">¿Prefieres contactarnos directamente?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:+595XXX"
              className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
            >
              <Phone size={20} />
              Llamar ahora
            </a>
            <a 
              href="mailto:info@lasurenita.com"
              className="flex items-center justify-center gap-2 border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition"
            >
              <Mail size={20} />
              Enviar email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}