
import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedImage, CategoryOption } from '../types';
import { CATEGORIES } from '../constants';
import { generateImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';


interface HeroProps {
  onGenerationComplete: (data: Omit<GeneratedImage, 'id'>) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-700 font-semibold mt-4">AI is creating your new look...</p>
    </div>
);


export const Hero: React.FC<HeroProps> = ({ onGenerationComplete }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setError(null);
                const base64 = await fileToBase64(file);
                setUploadedImage(base64);
            } catch (err) {
                setError('Could not read file. Please try another image.');
                setUploadedImage(null);
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                Unleash Your Alter Ego
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
                Upload a photo, pick a style, and let our AI work its magic in seconds.
            </p>

            <div className="relative max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
                {isGenerating && <LoadingSpinner />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Image Upload */}
                    <div 
                      className="relative border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 bg-gray-50 aspect-square flex flex-col justify-center items-center p-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                        {uploadedImage ? (
                            <img src={uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <>
                                <UploadIcon/>
                                <h3 className="text-base font-semibold text-gray-800">Upload Your Image</h3>
                                <p className="text-xs text-gray-500">Click or drag & drop</p>
                            </>
                        )}
                    </div>
                    
                    {/* Categories & Generate Button */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-gray-800 text-left">1. Pick a Style</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat)} 
                                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 ${selectedCategory?.id === cat.id ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200 bg-white hover:border-blue-400'}`}
                                >
                                    {cat.icon}
                                    <span className="mt-1.5 text-xs text-center font-medium text-gray-700">{cat.name}</span>
                                </button>
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 text-left mt-4">2. Create!</h3>
                        <button
                            onClick={handleGenerateClick}
                            disabled={!uploadedImage || !selectedCategory || isGenerating}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Generate Image
                        </button>
                    </div>

                </div>
                 {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        </section>
    );
};
