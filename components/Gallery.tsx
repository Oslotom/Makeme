
import React, { useState, useMemo } from 'react';
import type { GeneratedImage } from '../types';
import { Category } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
}

const allFilters = ['All', ...Object.values(Category)];

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredImages = useMemo(() => {
    if (activeFilter === 'All') {
      return images;
    }
    return images.filter(image => image.category === activeFilter);
  }, [images, activeFilter]);

  const FilterButton:React.FC<{filterName: string}> = ({filterName}) => {
     const isActive = activeFilter === filterName;
     return (
        <button
            onClick={() => setActiveFilter(filterName)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
        >
            {filterName}
        </button>
     )
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-center mb-4">Community Gallery</h2>
      <p className="text-center text-gray-600 mb-8">See what others have created</p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allFilters.map(filter => (
            <FilterButton key={filter} filterName={filter} />
        ))}
      </div>

      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map(image => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg aspect-square">
                <img
                    src={image.generatedUrl}
                    alt={`Generated as ${image.category}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <span className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded">{image.category}</span>
                </div>
            </div>
            ))}
        </div>
       ) : (
        <div className="text-center py-16 px-4 bg-gray-100 rounded-lg">
            <p className="text-gray-500">No images found for this category.</p>
        </div>
       )}
    </section>
  );
};
