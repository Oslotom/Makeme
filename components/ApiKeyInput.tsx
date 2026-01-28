
import React, { useState } from 'react';

interface ApiKeyInputProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim().length > 10) { // Basic validation for API key format
      onKeySubmit(apiKey.trim());
      setError('');
    } else {
      setError('Please enter a valid API key.');
    }
  };

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Your API Key</h2>
        <p className="text-gray-600 mb-6">
          To use this AI, please provide your Google Gemini API key. 
          You can get one for free from{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Gemini API key"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Google Gemini API Key"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400"
            disabled={!apiKey.trim()}
          >
            Start Creating
          </button>
        </form>
      </div>
    </section>
  );
};