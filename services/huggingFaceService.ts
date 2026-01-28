
import { HfInference } from "@huggingface/inference";
import { blobToBase64, base64ToArrayBuffer } from "../utils/fileUtils";

const MODEL_NAME = "timbrooks/instruct-pix2pix";

/**
 * Generates an image by calling the Hugging Face Instruct-Pix2Pix model using the official SDK.
 * @param base64ImageData The raw base64 image data.
 * @param prompt The instruction for how to edit the image.
 * @param apiKey The user's Hugging Face API key.
 * @returns A promise that resolves to an object with the base64 string and MIME type of the generated image.
 */
export const generateImage = async (
    base64ImageData: string,
    prompt: string,
    apiKey: string
): Promise<{ base64: string; mimeType: string }> => {

    if (!apiKey) {
        throw new Error("Hugging Face API key is missing.");
    }

    try {
        const hf = new HfInference(apiKey);
        const imageArrayBuffer = base64ToArrayBuffer(base64ImageData);

        const resultBlob = await hf.imageToImage({
            model: MODEL_NAME,
            data: imageArrayBuffer,
            parameters: {
                prompt: prompt,
            }
        });

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