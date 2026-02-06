
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultPage } from './components/ResultPage';
import type { GeneratedImage } from './types';
import { Category } from './types';
import { CATEGORIES } from './constants';
import { generateImage } from './services/geminiService';
import { extractBase64Parts, base64ToBlob } from './utils/fileUtils';

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
        let promptContext: string;
        if (resultData.category === Category.Custom) {
            promptContext = "The person in the photo was transformed based on a custom description.";
        } else {
            const categoryData = CATEGORIES.find(c => c.id === resultData.category);
            if (!categoryData) {
                throw new Error("Could not find the data for the original generation category.");
            }
            promptContext = `The person in the photo was transformed based on the instruction: "${categoryData.prompt}".`;
        }

        const newPrompt = `${promptContext} Now, apply this additional modification: "${modificationPrompt}". CRITICAL INSTRUCTION: Adhere strictly to the facial features from the original uploaded photo. The person's face, including structure, features, skin tone, and expression, must not be altered and must remain 100% recognizable from the original photo.`;

        const { mimeType, data } = extractBase64Parts(resultData.originalUrl);
        const imageBlob = base64ToBlob(data, mimeType);
        
        let newImageUrls: string[] = [];
        const isHeadshot = resultData.category === Category.Headshot;
        
        if (isHeadshot) {
            const promptVariations = [
                ' with soft, natural lighting',
                ' with dramatic, cinematic lighting',
                ' against a clean, professional studio background',
                ' in a bright, modern office setting'
            ];
            const generationPromises = promptVariations.map(variation => 
                generateImage(imageBlob, newPrompt + variation)
            );
            const results = await Promise.all(generationPromises);
            newImageUrls = results.map(result => `data:${result.mimeType};base64,${result.base64}`);
        } else {
            const { base64, mimeType } = await generateImage(imageBlob, newPrompt);
            newImageUrls.push(`data:${mimeType};base64,${base64}`);
        }
        
        setResultData(prev => ({
            ...prev!,
            generatedUrls: newImageUrls,
        }));

    } catch (err: any) {
        setModificationError(err.message || "An unknown error occurred during modification.");
    } finally {
        setIsModifying(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header onReset={handleReset} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {resultData ? (
          <ResultPage 
            originalUrl={resultData.originalUrl}
            generatedUrls={resultData.generatedUrls}
            category={resultData.category}
            onReset={handleReset}
            onModify={handleModification}
            isModifying={isModifying}
            modificationError={modificationError}
          />
        ) : (
          <Hero 
            onGenerationComplete={handleGenerationComplete} 
          />
        )}
      </main>
      <footer className="text-center p-6 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MakeMeLookLike.com. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;