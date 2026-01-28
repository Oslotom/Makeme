
import React from 'react';

interface HeaderProps {
  apiKey: string | null;
  onClearKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiKey, onClearKey }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          MakeMeLookLike.com
        </h1>
        {apiKey && (
          <button
            onClick={onClearKey}
            className="text-sm font-semibold text-gray-600 hover:text-blue-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
          >
            Change Key
          </button>
        )}
      </div>
    </header>
  );
};