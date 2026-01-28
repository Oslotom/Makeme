
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { ResultPage } from './components/ResultPage';
import type { GeneratedImage } from './types';
import { MOCK_IMAGES } from './constants';

const HEADER_HEIGHT_OFFSET = '100px';

const App: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(MOCK_IMAGES);
  const [resultData, setResultData] = useState<Omit<GeneratedImage, 'id' | 'category'> | null>(null);

  const addImageToGallery = useCallback((newImage: GeneratedImage) => {
    setGalleryImages(prevImages => [newImage, ...prevImages]);
  }, []);

  const handleGenerationComplete = (data: Omit<GeneratedImage, 'id'>) => {
    setResultData(data);
    addImageToGallery({ ...data, id: new Date().toISOString() });
  };
  
  const handleReset = () => {
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {resultData ? (
          <ResultPage 
            originalUrl={resultData.originalUrl}
            generatedUrl={resultData.generatedUrl}
            onReset={handleReset}
          />
        ) : (
          <>
            <Hero onGenerationComplete={handleGenerationComplete} />
            <div className="my-16 md:my-24 border-t border-gray-200"></div>
            <section id="gallery" style={{ scrollMarginTop: HEADER_HEIGHT_OFFSET }}>
              <Gallery images={galleryImages} />
            </section>
          </>
        )}
      </main>
      <footer className="text-center p-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MakeMeLookLike.com. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
