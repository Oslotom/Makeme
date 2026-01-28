
import React from 'react';

interface ResultPageProps {
  originalUrl: string;
  generatedUrl: string;
  onReset: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ originalUrl, generatedUrl, onReset }) => {
  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 animate-fade-in">
        <div className="w-full">
            <h2 className="text-center text-4xl font-extrabold mb-8 text-gray-900">Your Transformation is Ready!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-3 text-gray-600">Original</h3>
                    <img 
                        src={originalUrl} 
                        alt="Original" 
                        className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" 
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-3 text-green-600">Generated</h3>
                    <img 
                        src={generatedUrl} 
                        alt="Generated" 
                        className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" 
                    />
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a 
                    href={generatedUrl} 
                    download="makemelooklike-creation.png" 
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md"
                >
                    Download Image
                </a>
                <button 
                    onClick={onReset} 
                    className="w-full sm:w-auto text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                >
                    Create Another
                </button>
            </div>
        </div>
    </section>
  );
};
