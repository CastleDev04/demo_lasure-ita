import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="bg-gray-200 h-96 rounded-xl flex items-center justify-center overflow-hidden">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            {images[currentImageIndex].title}
          </h3>
          <p className="text-gray-600">{images[currentImageIndex].category}</p>
        </div>
      </div>

      <button 
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-orange-100 transition"
      >
        <ChevronLeft className="text-orange-600" />
      </button>
      <button 
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-orange-100 transition"
      >
        <ChevronRight className="text-orange-600" />
      </button>

      <div className="flex justify-center mt-6 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentImageIndex ? 'bg-orange-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}