import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Galeria() {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['todas', 'espacios', 'bodas', 'cumpleaños', 'corporativos', 'decoracion', 'catering'];

  const imagenes = [
    { id: 1, title: 'Salón Principal', category: 'espacios', description: 'Nuestro salón principal con capacidad para 200 personas' },
    { id: 2, title: 'Jardines', category: 'espacios', description: 'Áreas verdes perfectas para ceremonias al aire libre' },
    { id: 3, title: 'Boda Romántica', category: 'bodas', description: 'Decoración para bodas con estilo romántico' },
    { id: 4, title: 'Área de Fogata', category: 'espacios', description: 'Espacio acogedor para reuniones nocturnas' },
    { id: 5, title: 'Cumpleaños Infantil', category: 'cumpleaños', description: 'Decoración temática para cumpleaños infantiles' },
    { id: 6, title: 'Evento Corporativo', category: 'corporativos', description: 'Montaje para eventos empresariales' },
    { id: 7, title: 'Mesas Decoradas', category: 'decoracion', description: 'Ejemplos de nuestras decoraciones de mesa' },
    { id: 8, title: 'Buffet Premium', category: 'catering', description: 'Presentación de nuestro servicio de catering' },
    { id: 9, title: 'Ceremonia al Aire Libre', category: 'bodas', description: 'Setup para ceremonias en el jardín' },
    { id: 10, title: 'Iluminación Nocturna', category: 'decoracion', description: 'Ambientación nocturna con luces' },
    { id: 11, title: 'Coctelería', category: 'catering', description: 'Barra de cócteles personalizada' },
    { id: 12, title: 'Terraza', category: 'espacios', description: 'Terraza con vista a los jardines' }
  ];

  const imagenesFiltradas = selectedCategory === 'todas' 
    ? imagenes 
    : imagenes.filter(img => img.category === selectedCategory);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    document.getElementById('lightbox').classList.remove('hidden');
  };

  const closeLightbox = () => {
    document.getElementById('lightbox').classList.add('hidden');
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imagenesFiltradas.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imagenesFiltradas.length) % imagenesFiltradas.length);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Galería</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Descubre nuestros espacios y los eventos que hemos realizado
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar en galería..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid de imágenes */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imagenesFiltradas.map((imagen, index) => (
              <div 
                key={imagen.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="h-64 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-2">📷</div>
                    <h3 className="text-xl font-bold text-white">{imagen.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm mb-3">
                    {imagen.category}
                  </span>
                  <p className="text-gray-600">{imagen.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div id="lightbox" className="hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <button 
          onClick={closeLightbox}
          className="absolute top-4 right-4 text-white text-3xl hover:text-orange-400 transition"
        >
          ✕
        </button>
        
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-orange-100 transition"
        >
          <ChevronLeft className="text-orange-600" />
        </button>

        <div className="max-w-4xl mx-4">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 h-96 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {imagenesFiltradas[currentIndex]?.title}
              </h3>
              <p className="text-orange-100">{imagenesFiltradas[currentIndex]?.description}</p>
            </div>
          </div>
          <div className="text-center text-white">
            <p>{currentIndex + 1} / {imagenesFiltradas.length}</p>
          </div>
        </div>

        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-orange-100 transition"
        >
          <ChevronRight className="text-orange-600" />
        </button>
      </div>
    </div>
  );
}