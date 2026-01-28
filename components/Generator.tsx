
import React, { useState, useCallback, useRef, useMemo } from 'react';
import type { GeneratedImage, CategoryOption } from '../types';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { generateImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface GeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  apiKey: string;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin -ml-1 mr-3 h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-gray-600 font-medium">Our AI is working its magic...</p>
        <p className="text-gray-500">This can take a moment.</p>
    </div>
);


export const Generator: React.FC<GeneratorProps> = ({ onImageGenerated, apiKey }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setUploadedImage(base64);
        setGeneratedImageUrl(null);
        setSelectedCategory(null);
        setError(null);
      } catch (err) {
        setError('Could not read file. Please try another image.');
      }
    }
  }, []);

  const handleCategorySelect = useCallback(async (category: CategoryOption) => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }
    setSelectedCategory(category);
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const { mimeType, data } = extractBase64Parts(uploadedImage);
      const { base64: newImageBase64, mimeType: newMimeType } = await generateImage(data, category.prompt, mimeType, apiKey);
      const newImageUrl = `data:${newMimeType};base64,${newImageBase64}`;
      setGeneratedImageUrl(newImageUrl);
      onImageGenerated({
        id: new Date().toISOString(),
        originalUrl: uploadedImage,
        generatedUrl: newImageUrl,
        category: category.id,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedImage, onImageGenerated, apiKey]);
  
  const extractBase64Parts = (base64String: string) => {
    const match = base64String.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    if (!match) throw new Error("Invalid base64 string");
    return { mimeType: match[1], data: match[2] };
  };

  const resetFlow = () => {
    setUploadedImage(null);
    setSelectedCategory(null);
    setGeneratedImageUrl(null);
    setIsGenerating(false);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return <LoadingSpinner />;
    }

    if (generatedImageUrl && uploadedImage) {
      return (
        <div className="w-full">
            <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">Your Transformation!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">Original</h3>
                    <img src={uploadedImage} alt="Original" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-green-600">Generated</h3>
                    <img src={generatedImageUrl} alt="Generated" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover" />
                </div>
            </div>
             <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href={generatedImageUrl} download="made-with-makemelooklike.png" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                    Download Image
                </a>
                <button onClick={resetFlow} className="w-full sm:w-auto text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition">
                    Try Another One
                </button>
            </div>
        </div>
      );
    }

    if (uploadedImage) {
      return (
        <div className="w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Step 2: Choose Your New Look</h2>
          <img src={uploadedImage} alt="Uploaded preview" className="rounded-lg shadow-md max-w-xs w-full mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategorySelect(cat)} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
                {cat.icon}
                <span className="mt-2 text-center font-semibold text-gray-700">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    return (
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Transform Your Selfies With AI</h2>
            <p className="text-lg text-gray-600 mb-8">Upload a photo, pick a style, and see the magic happen.</p>
            <div 
              className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
                <UploadIcon/>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Click to upload or drag & drop</h3>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG, or WEBP</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
        </div>
    );
  };

  return (
    <section className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 flex justify-center items-center min-h-[400px] relative">
       {error && <div className="absolute top-5 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center" role="alert">{error}</div>}
       {renderContent()}
    </section>
  );
};