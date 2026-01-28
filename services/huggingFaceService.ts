
import { HfInference } from "https://esm.sh/@huggingface/inference@^2.7.0";
import { blobToBase64 } from "../utils/fileUtils";

const MODEL_NAME = "timbrooks/instruct-pix2pix";

/**
 * Generates an image by calling the Hugging Face Instruct-Pix2Pix model using the official SDK.
 * @param base64ImageData The raw base64 image data.
 * @param prompt The instruction for how to edit the image.
 * @param apiKey The user's Hugging Face API key.
 * @param mimeType The MIME type of the original image (e.g., 'image/jpeg').
 * @returns A promise that resolves to an object with the base64 string and MIME type of the generated image.
 */
export const generateImage = async (
    base64ImageData: string,
    prompt: string,
    apiKey: string,
    mimeType: string
): Promise<{ base64: string; mimeType: string }> => {

    if (!apiKey) {
        throw new Error("Hugging Face API key is missing.");
    }

    try {
        const hf = new HfInference(apiKey);
        
        // Use the robust browser-native fetch API to convert the data URL to a Blob
        const dataUrl = `data:${mimeType};base64,${base64ImageData}`;
        const response = await fetch(dataUrl);
        const imageBlob = await response.blob();

        const resultBlob = await hf.imageToImage({
            model: MODEL_NAME,
            data: imageBlob,
            parameters: {
                prompt: prompt,
            }
        });

        if (!resultBlob) {
            throw new Error("The AI model returned an empty response. This might be a temporary issue.");
        }

        const resultBase64Url = await blobToBase64(resultBlob);
        const [prefix, base64] = resultBase64Url.split(',');
        const resultMimeType = prefix.replace('data:', '').replace(';base64', '');

        return {
            base64: base64,
            mimeType: resultMimeType,
        };

    } catch (error: any)
 {
        console.error("Error from Hugging Face API:", error);
        
        let errorMessage = error.message || 'Unknown error';
        if (errorMessage.includes('401')) {
            errorMessage = "Authentication failed. Please check if your Hugging Face API key is correct.";
        } else if (errorMessage.includes('503') || error.status === 503) {
            errorMessage = "The AI model is currently loading. This can take a moment, especially on the first try. Please wait and try again.";
        }

        throw new Error(`Failed to generate image: ${errorMessage}`);
    }
};