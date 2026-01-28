
import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedImage, CategoryOption } from '../types';
import { CATEGORIES } from '../constants';
import { generateImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';


interface HeroProps {
  onGenerationComplete: (data: Omit<GeneratedImage, 'id'>) => void;
}

const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
        <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-slate-700 font-semibold mt-4">AI is creating your new look...</p>
    </div>
);


export const Hero: React.FC<HeroProps> = ({ onGenerationComplete }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setError(null);
                setFileName(file.name);
                const base64 = await fileToBase64(file);
                setUploadedImage(base64);
            } catch (err) {
                setError('Could not read file. Please try another image.');
                setUploadedImage(null);
                setFileName(null);
            }
        }
    }, []);

    const handleGenerateClick = useCallback(async () => {
        if (!uploadedImage || !selectedCategory) {
            setError('Please upload an image and select a category.');
            return;
        }
        
        setIsGenerating(true);
        setError(null);

        try {
            const { mimeType, data } = extractBase64Parts(uploadedImage);
            const { base64: newImageBase64, mimeType: newMimeType } = await generateImage(data, selectedCategory.prompt, mimeType);
            const newImageUrl = `data:${newMimeType};base64,${newImageBase64}`;
            
            onGenerationComplete({
                originalUrl: uploadedImage,
                generatedUrl: newImageUrl,
                category: selectedCategory.id,
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while generating the image.');
        } finally {
            setIsGenerating(false);
        }
    }, [uploadedImage, selectedCategory, onGenerationComplete]);

    const extractBase64Parts = (base64String: string) => {
        const match = base64String.match(/^data:(image\/[a-z]+);base64,(.*)$/);
        if (!match) throw new Error("Invalid base64 string");
        return { mimeType: match[1], data: match[2] };
    };


    return (
        <section id="create" className="text-center py-12 md:py-16 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-4 leading-tight">
                Unleash Your Alter Ego
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
                Upload a photo, pick a style, and let our AI work its magic in seconds.
            </p>

            <div className="relative max-w-xl mx-auto bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20">
                {isGenerating && <LoadingSpinner />}
                <div className="flex flex-col items-center gap-6">
                    
                    {/* Step 1: Upload */}
                    <div className="w-full">
                        <label className="text-lg font-semibold text-slate-800 text-left block mb-2">1. Upload Image</label>
                        <div className="flex items-center border-2 border-slate-300/70 rounded-lg p-2 bg-white/50 w-full">
                            <span className="text-slate-600 pl-2 text-sm flex-grow text-left truncate">
                                {fileName || "No file selected..."}
                            </span>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-md transition-colors text-sm flex-shrink-0"
                            >
                                Choose File
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                    </div>
                    
                    {/* Step 2: Categories */}
                     <div className="w-full">
                        <label className="text-lg font-semibold text-slate-800 text-left block mb-3">2. Pick a Style</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat)} 
                                    className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 aspect-square ${selectedCategory?.id === cat.id ? 'border-indigo-500 bg-indigo-50/80 scale-105 shadow-md' : 'border-slate-200/80 bg-white/70 hover:border-indigo-400'}`}
                                >
                                    {cat.icon}
                                    <span className="text-xs text-center font-medium text-slate-700">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Generate Button */}
                    <div className="w-full pt-4">
                        <button
                            onClick={handleGenerateClick}
                            disabled={!uploadedImage || !selectedCategory || isGenerating}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Generate Image
                        </button>
                    </div>

                </div>
                 {error && <p className="text-red-600 bg-red-100/80 border border-red-300 rounded-md p-3 font-medium text-sm mt-4">{error}</p>}
            </div>
        </section>
    );
};