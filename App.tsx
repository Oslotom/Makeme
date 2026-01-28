
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Gallery } from './components/Gallery';
import { ApiKeyInput } from './components/ApiKeyInput';
import type { GeneratedImage } from './types';
import { MOCK_IMAGES } from './constants';

const API_KEY_STORAGE_KEY = 'hfToken';

const App: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(MOCK_IMAGES);
  const [hfToken, setHfToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedToken) {
        setHfToken(storedToken);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsReady(true);
  }, []);

  const handleKeySubmit = useCallback((token: string) => {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, token);
      setHfToken(token);
    } catch (error) {
      console.error("Could not save to localStorage:", error);
    }
  }, []);

  const handleClearKey = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setHfToken(null);
    } catch (error) {
      console.error("Could not remove from localStorage:", error);
    }
  }, []);

  const addImageToGallery = (newImage: GeneratedImage) => {
    setGalleryImages(prevImages => [newImage, ...prevImages]);
  };

  if (!isReady) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header hfToken={hfToken} onClearKey={handleClearKey} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!hfToken ? (
          <ApiKeyInput onKeySubmit={handleKeySubmit} />
        ) : (
          <>
            <Generator onImageGenerated={addImageToGallery} hfToken={hfToken} />
            <div className="my-16 md:my-24 border-t border-gray-200"></div>
            <Gallery images={galleryImages} />
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
