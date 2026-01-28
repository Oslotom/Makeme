
import React from 'react';

// FIX: Removed API key props and related UI as per Gemini API guidelines.
// The app should not handle API key input from the user.
export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          <a href="#">MakeMeLookLike.com</a>
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#create" className="text-base font-medium text-gray-600 hover:text-blue-700 transition-colors">Generator</a>
            <a href="#gallery" className="text-base font-medium text-gray-600 hover:text-blue-700 transition-colors">Gallery</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
