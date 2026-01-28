
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultPage } from './components/ResultPage';
import type { GeneratedImage } from './types';
import { CATEGORIES } from './constants';
import { generateImage } from './services/geminiService';
import { extractBase64Parts } from './utils/fileUtils';

const App: React.FC = () => {
  const [resultData, setResultData] = useState<Omit<GeneratedImage, 'id'> | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [modificationError, setModificationError] = useState<string | null>(null);

  const handleGenerationComplete = (data: Omit<GeneratedImage, 'id'>) => {
    setResultData(data);
  };
  
  const handleReset = () => {
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModification = async (modificationPrompt: string) => {
    if (!resultData) return;
    
    setIsModifying(true);
    setModificationError(null);

    try {
        const basePrompt = CATEGORIES.find(c => c.id === resultData.category)?.prompt;
        if (!basePrompt) {
            throw new Error("Could not find the original prompt for the selected category.");
        }

        // Construct the new prompt by combining the original transformation idea with the new modification request.
        const newPrompt = `The person has been transformed based on the idea: "${basePrompt}". Now, apply this additional modification: "${modificationPrompt}". It's very important to keep the person's original facial features recognizable from the very first uploaded image.`;

        const { mimeType, data } = extractBase64Parts(resultData.originalUrl);
        const { base64: newImageBase64, mimeType: newMimeType } = await generateImage(data, newPrompt, mimeType);
        const newImageUrl = `data:${newMimeType};base64,${newImageBase64}`;

        setResultData(prev => ({
            ...prev!,
            generatedUrl: newImageUrl,
        }));

    } catch (err: any) {
        setModificationError(err.message || "An unknown error occurred during modification.");
    } finally {
        setIsModifying(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header onNavigateHome={handleReset} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {resultData ? (
          <ResultPage 
            originalUrl={resultData.originalUrl}
            generatedUrl={resultData.generatedUrl}
            category={resultData.category}
            onReset={handleReset}
            onModify={handleModification}
            isModifying={isModifying}
            modificationError={modificationError}
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