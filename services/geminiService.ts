
import { base64ToBlob } from '../utils/fileUtils';

// Using a CORS proxy to bypass browser security restrictions (CORS) 
// that prevent direct calls to the Hugging Face API from a web app.
// NOTE: Free CORS proxies are notoriously unreliable and can stop working at any time. 
// This is a common point of failure in client-side-only applications.
const CORS_PROXY = "https://corsproxy.io/?";
const API_URL = `${CORS_PROXY}https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix`;

/**
 * Generates an image by calling the Hugging Face Inference API for the instruct-pix2pix model.
 * NOTE: The filename is kept as geminiService.ts to minimize changes, but it no longer uses Gemini.
 * @param base64ImageData The raw base64 image data, without the 'data:image/...' prefix.
 * @param prompt The instruction for how to edit the image.
 * @param mimeType The MIME type of the input image (e.g., 'image/jpeg').
 * @param hfToken The Hugging Face API token.
 * @returns A promise that resolves to an object with the base64 string and MIME type of the generated image.
 */
export const generateImage = async (
    base64ImageData: string,
    prompt: string,
    mimeType: string,
    hfToken: string
): Promise<{ base64: string; mimeType: string }> => {

    if (!hfToken) {
        throw new Error("Hugging Face API token is missing.");
    }

    const urlWithPrompt = `${API_URL}?prompt=${encodeURIComponent(prompt)}`;
    
    // Convert the base64 string from the app into a Blob to send as the request body.
    const imageBlob = base64ToBlob(base64ImageData, mimeType);

    try {
        const response = await fetch(urlWithPrompt, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': mimeType,
            },
            body: imageBlob,
        });

        if (response.status === 503) {
            // The model is loading, which is common on the free tier.
            const errorJson = await response.json();
            const estimatedTime = errorJson.estimated_time || 20;
            throw new Error(`The AI model is loading. Please try again in ~${Math.round(estimatedTime)} seconds.`);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error from Hugging Face API:", errorText);
            throw new Error(`Failed to generate image. The AI model returned an error.`);
        }
        
        // The API returns the generated image as a binary blob.
        const resultBlob = await response.blob();

        // Convert the resulting blob back to a base64 string for the <img> tag.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                resolve({
                    base64: dataUrl.split(',')[1],
                    mimeType: resultBlob.type,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(resultBlob);
        });
    } catch (error) {
        console.error("Network request failed:", error);
        throw new Error("The request failed. This might be due to a network issue, browser restrictions (like CORS), or an ad-blocker. Please check your browser's console for more details.");
    }
};