
import { GoogleGenAI } from "@google/genai";

/**
 * Generates an image by calling the Google Gemini API.
 * @param base64ImageData The raw base64 image data, without the 'data:image/...' prefix.
 * @param prompt The instruction for how to edit the image.
 * @param mimeType The MIME type of the input image.
 * @returns A promise that resolves to an object with the base64 string and MIME type of the generated image.
 */
export const generateImage = async (
    base64ImageData: string,
    prompt: string,
    mimeType: string
): Promise<{ base64: string; mimeType: string }> => {

    // Safely access the API key to prevent crashing in browser environments.
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (!apiKey) {
        throw new Error("Google Gemini API key is missing. It must be provided via the API_KEY environment variable.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
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
        
        // Validate the response before accessing nested properties
        if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
            // Log the full response for easier debugging
            console.error("Invalid or empty response from Gemini API:", response);
            // Check for a specific block reason to provide better user feedback
            if (response.promptFeedback?.blockReason) {
                throw new Error(`Request was blocked by the AI. Reason: ${response.promptFeedback.blockReason}. Please try a different image.`);
            }
            throw new Error("The AI returned an invalid response. This may be due to safety filters or an issue with the uploaded image. Please try a different one.");
        }


        // Find the image part in the response
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                };
            }
        }
        
        throw new Error("The AI did not return an image. It might have refused the request.");

    } catch (error: any) {
        console.error("Error from Gemini API:", error);
        // Provide a more user-friendly error message
        const message = error.message?.includes('API key not valid') 
            ? 'Your Google Gemini API key is not valid. Please check it and try again.'
            : `Failed to generate image. The AI model returned an error: ${error.message || 'Unknown error'}`;
        throw new Error(message);
    }
};