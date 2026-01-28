
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Gallery } from './components/Gallery';
import { ApiKeyInput } from './components/ApiKeyInput';
import type { GeneratedImage } from './types';
import { MOCK_IMAGES } from './constants';

const API_KEY_STORAGE_KEY = 'geminiApiKey';

const App: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(MOCK_IMAGES);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedToken) {
        setApiKey(storedToken);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    setIsReady(true);
  }, []);

  const handleKeySubmit = useCallback((token: string) => {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, token);
      setApiKey(token);
    } catch (error) {
      console.error("Could not save to localStorage:", error);
    }
  }, []);

  const handleClearKey = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
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
      <Header apiKey={apiKey} onClearKey={handleClearKey} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {!apiKey ? (
          <ApiKeyInput onKeySubmit={handleKeySubmit} />
        ) : (
          <>
            <Generator onImageGenerated={addImageToGallery} apiKey={apiKey} />
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