
// FIX: This service is updated to use the Google Gemini API instead of Hugging Face.
import { GoogleGenAI } from "@google/genai";
import { blobToBase64, extractBase64Parts } from "../utils/fileUtils";

/**
 * Generates an image by calling the Gemini API for image editing.
 * @param imageFile The image as a `File` or `Blob` object.
 * @param prompt The instruction for how to edit the image.
 * @returns A promise that resolves to an object with the base64 string and MIME type of the generated image.
 */
export const generateImage = async (
    imageFile: File | Blob,
    prompt: string,
): Promise<{ base64: string; mimeType: string }> => {

    if (!process.env.API_KEY) {
        throw new Error("Google AI API key is not configured. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const base64Url = await blobToBase64(imageFile);
    const { mimeType, data: base64ImageData } = extractBase64Parts(base64Url);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
        });

        // The output response may contain both image and text parts; you must iterate through all parts to find the image part.
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                };
            }
        }
        
        if (response.text) {
            throw new Error(`The AI model responded with text instead of an image: "${response.text}"`);
        }
        
        throw new Error("The AI model did not return an image. The response was empty or in an unexpected format.");

    } catch (error: any) {
        console.error("Full error object from Gemini API:", error);
        
        let detailedMessage = error.message || "An unknown error occurred.";

        // Provide more user-friendly error messages for common cases.
        if (detailedMessage.includes("API key not valid")) {
            detailedMessage = "Authentication failed. Please ensure your Google AI API key is correct and has billing enabled.";
        } else if (detailedMessage.includes("429")) { // Quota exceeded
             detailedMessage = "You have exceeded your API request quota. Please check your usage limits and billing status.";
        } else if (error.message.includes("Failed to fetch")) {
             detailedMessage = "A network error occurred. This could be due to a CORS issue, an internet connection problem, or a browser extension blocking the request. Check the browser's developer console for more details.";
        }
        
        throw new Error(`Failed to generate image: ${detailedMessage}`);
    }
};
