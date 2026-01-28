
import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedImage, CategoryOption } from '../types';
import { CATEGORIES } from '../constants';
import { generateImage } from '../services/geminiService';
// FIX: import blobToBase64 instead of fileToBase64 to align with the utility file update.
import { blobToBase64 } from '../utils/fileUtils';


interface HeroProps {
  onGenerationComplete: (data: Omit<GeneratedImage, 'id'>) => void;
  // FIX: apiKey is no longer needed as it's handled by environment variables within the service.
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
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
                setUploadedFile(file);
                // FIX: use blobToBase64 utility function.
                const base64 = await blobToBase64(file);
                setUploadedImage(base64);
            } catch (err) {
                setError('Could not read file. Please try another image.');
                setUploadedImage(null);
                setUploadedFile(null);
                setFileName(null);
            }
        }
    }, []);

    const handleGenerateClick = useCallback(async () => {
        if (!selectedCategory) {
            setError('You must select a style before generating.');
            return;
        }
        if (!uploadedFile) {
            setError('Please upload an image to generate.');
            return;
        }
        
        setIsGenerating(true);
        setError(null);

        try {
            // FIX: apiKey is no longer passed to generateImage.
            const { base64: newImageBase64, mimeType: newMimeType } = await generateImage(uploadedFile, selectedCategory.prompt);
            const newImageUrl = `data:${newMimeType};base64,${newImageBase64}`;
            
            onGenerationComplete({
                originalUrl: uploadedImage!,
                generatedUrl: newImageUrl,
                category: selectedCategory.id,
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while generating the image.');
        } finally {
            setIsGenerating(false);
        }
    // FIX: apiKey removed from dependency array.
    }, [uploadedImage, uploadedFile, selectedCategory, onGenerationComplete]);

    return (
        <section id="create" className="text-center py-12 md:py-16 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-4 leading-tight">
                Unleash Your Alter Ego
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
                Pick a style, upload a photo, and let our AI work its magic in seconds.
            </p>

            <div className="relative max-w-2xl mx-auto bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 border border-white/20">
                {isGenerating && <LoadingSpinner />}
                <div className="flex flex-col items-center gap-6">
                    
                    {/* Step 1: Categories */}
                     <div className="w-full">
                        <label className="text-lg font-semibold text-slate-800 text-left block mb-3">1. Pick a Style</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat)} 
                                    className={`relative group flex flex-col items-center justify-center text-white font-bold rounded-lg border-4 transition-all duration-200 aspect-square overflow-hidden ${selectedCategory?.id === cat.id ? 'border-indigo-500 scale-105 shadow-xl' : 'border-transparent hover:border-indigo-400'}`}
                                >
                                    {cat.icon}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                    <span className="absolute bottom-2 text-xs text-center font-medium drop-shadow-md">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Upload & Generate */}
                    <div className="w-full pt-4">
                        <label className="text-lg font-semibold text-slate-800 text-left block mb-2">2. Upload & Create</label>
                         <div className="flex items-center gap-3 w-full bg-white/50 border-2 border-slate-300/70 rounded-lg p-2">
                             <span className="text-slate-600 pl-2 text-sm flex-grow text-left truncate">
                                {fileName || "No file selected..."}
                            </span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-md transition-colors text-sm flex-shrink-0"
                            >
                                Choose File
                            </button>
                            <button
                                onClick={handleGenerateClick}
                                disabled={!uploadedFile || !selectedCategory || isGenerating}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-5 rounded-md text-sm transition-all transform hover:scale-105 shadow-md disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                </div>
                 {error && <p className="text-red-600 bg-red-100/80 border border-red-300 rounded-md p-3 font-medium text-sm mt-4">{error}</p>}
            </div>
        </section>
    );
};
