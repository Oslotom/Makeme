import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedImage, CategoryOption } from '../types';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { generateImage } from '../services/imageService';

interface HeroProps {
  onGenerationComplete: (data: Omit<GeneratedImage, 'id'>) => void;
}

const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
        <svg className="animate-spin h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-slate-200 font-semibold mt-4">AI is creating your new look...</p>
    </div>
);


export const Hero: React.FC<HeroProps> = ({ onGenerationComplete }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setError(null);
            setSelectedCategory(null);
            setUploadedImage(null);
            setUploadedFile(null);

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                const img = new Image();
                img.onload = () => {
                    const minPixels = 262144; // 512x512
                    if (img.width * img.height < minPixels) {
                        setError(`Image is too small. Please upload an image that is at least 512x512 pixels.`);
                        setUploadedImage(null);
                        setUploadedFile(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = ""; // Reset file input to allow re-uploading the same file name
                        }
                    } else {
                        setUploadedFile(file);
                        setUploadedImage(imageUrl);
                    }
                };
                img.onerror = () => {
                    setError('Could not validate the image file. Please try another one.');
                    setUploadedImage(null);
                    setUploadedFile(null);
                };
                img.src = imageUrl;
            };
            reader.onerror = () => {
                setError('Could not read file. Please try another image.');
                setUploadedImage(null);
                setUploadedFile(null);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleGenerateClick = useCallback(async () => {
        if (!selectedCategory) {
            setError('You must select a style before generating.');
            return;
        }
        if (!uploadedImage || !uploadedFile) {
            setError('Please upload an image to generate.');
            return;
        }
        
        setIsGenerating(true);
        setError(null);

        try {
            let generatedUrls: string[] = [];
            
            if (selectedCategory.id === Category.Headshot) {
                // Generate 4 unique images in parallel for Headshot category by varying the prompt
                const promptVariations = [
                    ' with soft, natural lighting',
                    ' with dramatic, cinematic lighting',
                    ' against a clean, professional studio background',
                    ' in a bright, modern office setting'
                ];
                const promises = promptVariations.map(variation => 
                    generateImage(uploadedFile, selectedCategory.prompt + variation)
                );
                const results = await Promise.all(promises);
                generatedUrls = results.map(result => `data:${result.mimeType};base64,${result.base64}`);
            } else {
                // Generate a single image for other categories
                const { base64: newImageBase64, mimeType: newMimeType } = await generateImage(uploadedFile, selectedCategory.prompt);
                const newImageUrl = `data:${newMimeType};base64,${newImageBase64}`;
                generatedUrls.push(newImageUrl);
            }
            
            onGenerationComplete({
                originalUrl: uploadedImage,
                generatedUrls: generatedUrls,
                category: selectedCategory.id,
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred while generating the image.');
        } finally {
            setIsGenerating(false);
        }
    }, [uploadedImage, uploadedFile, selectedCategory, onGenerationComplete]);

    return (
        <section id="create" className="text-center py-12 md:py-16 px-4">
             <div className="relative max-w-3xl mx-auto">
                {isGenerating && <LoadingSpinner />}

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-100 mb-4 leading-tight">
                    Unleash Your{' '}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                        Alter Ego
                    </span>
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-10">
                    Get your AI photoshoot. Start by uploading a selfie.
                </p>

                {uploadedImage && (
                    <div className="w-full mb-8 animate-fade-in">
                        <label className="text-lg font-semibold text-slate-200 text-center block mb-4">1. Now, Pick a Style</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                            {CATEGORIES.map(cat => (
                                <button 
                                    key={cat.id} 
                                    onClick={() => setSelectedCategory(cat)} 
                                    className={`relative group flex flex-col items-center justify-center text-white font-bold rounded-lg transition-all duration-300 aspect-square overflow-hidden bg-slate-700/50 hover:bg-slate-700 ring-2 ring-transparent hover:ring-indigo-500 ${selectedCategory?.id === cat.id ? '!ring-indigo-500 shadow-lg shadow-indigo-500/20' : 'ring-slate-700'}`}
                                >
                                    {cat.icon}
                                    <span className="absolute bottom-2 text-xs text-center font-medium drop-shadow-md text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="relative flex justify-between items-center w-full bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-900/10 p-4 border border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center hover:border-indigo-500 hover:bg-slate-700 transition-colors duration-300"
                            >
                                {uploadedImage ? (
                                    <img src={uploadedImage} alt="Selfie preview" className="w-full h-full object-cover rounded-md"/>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </button>
                            <span className="text-xs text-slate-400 mt-1 block">Selfie</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleGenerateClick}
                        disabled={!uploadedFile || !selectedCategory || isGenerating}
                        className="bg-slate-300 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-md disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                    >
                        Generate my preview
                    </button>
                </div>

                 {error && <p className="text-red-400 bg-red-900/30 border border-red-500/50 rounded-md p-3 font-medium text-sm mt-4">{error}</p>}
                
                 <p className="text-slate-500 text-sm mt-4">
                    Free preview · No photoshoot · Ready in 2 minutes
                </p>

            </div>
        </section>
    );
};