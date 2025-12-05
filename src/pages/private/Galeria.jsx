import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Grid, 
  List, 
  FolderPlus,
  Eye,
  Download,
  Trash2,
  Filter
} from 'lucide-react';

export default function AdminGaleria() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const categorias = [
    { id: 'todas', nombre: 'Todas las categorías', cantidad: 125 },
    { id: 'bodas', nombre: 'Bodas', cantidad: 48 },
    { id: 'cumpleanos', nombre: 'Cumpleaños', cantidad: 32 },
    { id: 'familiares', nombre: 'Reuniones familiares', cantidad: 25 },
    { id: 'corporativos', nombre: 'Eventos corporativos', cantidad: 20 },
  ];

  const imagenes = [
    { 
      id: 1, 
      nombre: 'Boda verano 2024', 
      categoria: 'bodas', 
      fecha: '2024-05-15', 
      tamaño: '4.2 MB',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 2, 
      nombre: 'XV años Sofía', 
      categoria: 'cumpleanos', 
      fecha: '2024-04-22', 
      tamaño: '3.8 MB',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 3, 
      nombre: 'Reunión familiar López', 
      categoria: 'familiares', 
      fecha: '2024-03-10', 
      tamaño: '5.1 MB',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 4, 
      nombre: 'Conferencia Tech 2024', 
      categoria: 'corporativos', 
      fecha: '2024-02-28', 
      tamaño: '6.3 MB',
      url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 5, 
      nombre: 'Boda primavera', 
      categoria: 'bodas', 
      fecha: '2024-01-15', 
      tamaño: '4.5 MB',
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    { 
      id: 6, 
      nombre: 'Cumpleaños infantil', 
      categoria: 'cumpleanos', 
      fecha: '2023-12-20', 
      tamaño: '3.2 MB',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galería</h1>
          <p className="text-gray-600 mt-2">Gestiona las imágenes de eventos y espacios</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg divide-x divide-gray-300">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              title="Vista de cuadrícula"
            >
              <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-orange-600' : 'text-gray-500'}`} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              title="Vista de lista"
            >
              <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-orange-600' : 'text-gray-500'}`} />
            </button>
          </div>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          
          <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Subir Imágenes
          </button>
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h2>
        <div className="flex flex-wrap gap-3">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategory(categoria.id)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === categoria.id
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white border-orange-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{categoria.nombre}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === categoria.id
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {categoria.cantidad}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Galería de imágenes */}
      {viewMode === 'grid' ? (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {imagenes
              .filter(img => selectedCategory === 'todas' || img.categoria === selectedCategory)
              .map((imagen) => (
                <div key={imagen.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={imagen.url} 
                      alt={imagen.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white">
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white">
                        <Download className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{imagen.nombre}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{imagen.fecha}</span>
                      <span>{imagen.tamaño}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {categorias.find(c => c.id === imagen.categoria)?.nombre}
                      </span>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Imagen</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Nombre</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Tamaño</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {imagenes
                .filter(img => selectedCategory === 'todas' || img.categoria === selectedCategory)
                .map((imagen) => (
                  <tr key={imagen.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={imagen.url} 
                          alt={imagen.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{imagen.nombre}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {categorias.find(c => c.id === imagen.categoria)?.nombre}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{imagen.fecha}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-700">{imagen.tamaño}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Vista previa">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Descargar">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Estadísticas de almacenamiento */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Uso de almacenamiento</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Espacio utilizado</span>
              <span className="text-sm font-medium text-gray-900">4.2 GB de 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de imágenes</p>
                <p className="text-xl font-bold text-gray-900">125</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-xl font-bold text-gray-900">6</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Descargas este mes</p>
                <p className="text-xl font-bold text-gray-900">48</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}