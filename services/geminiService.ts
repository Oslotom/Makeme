
import { GoogleGenAI } from "@google/genai";

async function fileToGenerativePart(file: File | Blob) {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  return {
    inlineData: {
      data: base64EncodedData.split(',')[1],
      mimeType: file.type,
    },
  };
}

export const generateImage = async (
    imageFile: File | Blob,
    prompt: string
): Promise<{ base64: string; mimeType: string }> => {

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Google Gemini API key is missing. Ensure the API_KEY environment variable is set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
        });

        if (!response.candidates?.[0]?.content?.parts) {
            console.error("Invalid response from Gemini API:", response);
            if (response.promptFeedback?.blockReason) {
                throw new Error(`Request was blocked. Reason: ${response.promptFeedback.blockReason}.`);
            }
            throw new Error("The AI returned an invalid response. Please try a different image.");
        }

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
        console.error("Full error object from Gemini API:", error);
        
        let detailedMessage = error.message || "An unknown error occurred.";
        if (error.message?.includes('API key not valid') || error.message?.includes('PERMISSION_DENIED')) {
             detailedMessage = "Your Google Gemini API key is not valid or does not have the required permissions. Please check your key in Google AI Studio.";
        } else if (error.message.includes('SAFETY')) {
            detailedMessage = "The request was blocked due to safety concerns with the prompt or image.";
        }
        
        throw new Error(`Failed to generate image: ${detailedMessage}`);
    }
};