
import React from 'react';

// FIX: This component is no longer rendered but is updated to reflect that API keys are handled via environment variables as per Gemini API best practices.
interface ApiKeyInputProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onKeySubmit }) => {
  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 flex flex-col items-center justify-center animate-fade-in w-full max-w-lg">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">API Key Configuration</h2>
        <p className="text-gray-600 mb-6">
          To use this AI, please provide your Google AI API key.
          You can get a free Access Token from your{' '}
          <a
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio account
          </a>.
        </p>
      </div>
    </section>
  );
};
