
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

const ModifyingSpinner = () => (
    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-md text-slate-300 font-semibold mt-3">Updating images...</p>
    </div>
);

interface ResultPageProps {
  originalUrl: string;
  generatedUrls: string[];
  category: Category;
  onReset: () => void;
  onModify: (prompt: string) => void;
  isModifying: boolean;
  modificationError: string | null;
}

export const ResultPage: React.FC<ResultPageProps> = ({ 
    originalUrl, 
    generatedUrls, 
    category,
    onReset,
    onModify,
    isModifying,
    modificationError 
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState(generatedUrls[0]);
  
  const suggestions = category === Category.Custom 
    ? [] 
    : CATEGORIES.find(c => c.id === category)?.suggestions || [];
  
  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onModify(customPrompt.trim());
      setCustomPrompt('');
    }
  };

  const isMultiImage = generatedUrls.length > 1;

  return (
    <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-900/10 p-6 md:p-10 border border-slate-700 animate-fade-in">
        <div className="w-full">
            <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-8 text-slate-100">Your Transformation is Ready!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-3 text-slate-400">Original</h3>
                    <img 
                        src={originalUrl} 
                        alt="Original" 
                        className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" 
                    />
                </div>

                {isMultiImage ? (
                     <div className="relative flex flex-col text-center">
                        {isModifying && <ModifyingSpinner />}
                        <h3 className="text-xl font-semibold mb-3 text-emerald-400">Your Headshots</h3>
                        <img 
                            src={mainImageUrl} 
                            alt="Main generated headshot" 
                            className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover mb-2" 
                        />
                        <div className="grid grid-cols-4 gap-2">
                            {generatedUrls.map((url, index) => (
                                <button key={index} onClick={() => setMainImageUrl(url)} className="rounded-md overflow-hidden">
                                    <img
                                        src={url}
                                        alt={`Variant ${index + 1}`}
                                        className={`w-full h-full aspect-square object-cover transition-all duration-200 ${mainImageUrl === url ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-800' : 'opacity-60 hover:opacity-100'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="relative text-center">
                        {isModifying && <ModifyingSpinner />}
                        <h3 className="text-xl font-semibold mb-3 text-emerald-400">Generated</h3>
                        <img 
                            src={generatedUrls[0]} 
                            alt="Generated" 
                            className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" 
                        />
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
                <h4 className="text-center text-lg font-semibold text-slate-300 mb-4">Refine Your Image</h4>
                
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        {suggestions.map((suggestion, index) => (
                            <button 
                                key={index}
                                onClick={() => onModify(suggestion)} 
                                disabled={isModifying}
                                className="bg-slate-700/70 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-full text-sm transition border border-slate-600 shadow-sm disabled:opacity-50 disabled:cursor-wait"
                            >
                               ✨ {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleCustomPromptSubmit} className="mt-6 max-w-lg mx-auto flex items-center gap-2">
                    <input 
                        type="text"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Or type your own change... (e.g., 'give me a red hat')"
                        disabled={isModifying}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-800 text-slate-100 placeholder-slate-400"
                        aria-label="Custom refinement prompt"
                    />
                    <button 
                        type="submit"
                        disabled={isModifying || !customPrompt.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                    >
                        Refine
                    </button>
                </form>

                {modificationError && <p className="text-center text-red-400 bg-red-900/30 border border-red-500/50 rounded-md p-3 font-medium text-sm mt-6 max-w-lg mx-auto">{modificationError}</p>}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a 
                    href={mainImageUrl} 
                    download="makemelooklike-creation.png" 
                    className="w-full sm:w-auto text-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-indigo-500/20"
                >
                    Download Image
                </a>
                <button 
                    onClick={onReset} 
                    className="w-full sm:w-auto text-center bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 px-6 rounded-lg transition"
                >
                    Create Another
                </button>
            </div>
        </div>
    </section>
  );
};