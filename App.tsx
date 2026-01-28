
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultPage } from './components/ResultPage';
import type { GeneratedImage } from './types';

const App: React.FC = () => {
  const [resultData, setResultData] = useState<Omit<GeneratedImage, 'id' | 'category'> | null>(null);

  const handleGenerationComplete = (data: Omit<GeneratedImage, 'id'>) => {
    setResultData(data);
  };
  
  const handleReset = () => {
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {resultData ? (
          <ResultPage 
            originalUrl={resultData.originalUrl}
            generatedUrl={resultData.generatedUrl}
            onReset={handleReset}
          />
        ) : (
          <Hero onGenerationComplete={handleGenerationComplete} />
        )}
      </main>
      <footer className="text-center p-6 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MakeMeLookLike.com. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;