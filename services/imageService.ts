export const generateImage = async (
    imageFile: File | Blob,
    prompt: string
): Promise<{ base64: string; mimeType: string }> => {

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Stability AI API key is missing. Ensure the API_KEY environment variable is set with your key from DreamStudio.");
    }

    // The Stability AI API requires FormData for image-to-image requests
    const formData = new FormData();
    formData.append('init_image', imageFile);
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    // A lower image_strength (0-1) gives more weight to the original image, preserving features.
    // We use 0.45 to ensure the user's face remains recognizable, which is key for this app.
    formData.append('image_strength', '0.45'); 
    formData.append('text_prompts[0][text]', prompt);
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '30');
    // Using a photorealistic style preset
    formData.append('style_preset', 'photographic');


    try {
        const response = await fetch(
            "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/image-to-image",
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Stability AI API Error:", errorText);
            throw new Error(`Non-200 response from Stability AI: ${response.status} ${response.statusText}. Details: ${errorText}`);
        }

        const responseJSON = await response.json();
        
        if (!responseJSON.artifacts || responseJSON.artifacts.length === 0) {
            console.error("Invalid response from Stability AI:", responseJSON);
            throw new Error("The AI returned an invalid response. No image artifacts found.");
        }

        const image = responseJSON.artifacts[0];
        
        if (image.finishReason === 'SUCCESS') {
            return {
                base64: image.base64,
                mimeType: 'image/png', // Stability AI returns PNG
            };
        } else if (image.finishReason === 'CONTENT_FILTERED') {
             throw new Error("The request was blocked by Stability AI's safety filter.");
        }
        
        throw new Error(`Image generation failed with reason: ${image.finishReason}`);

    } catch (error: any) {
        console.error("Full error object from Stability AI:", error);
        
        let detailedMessage = error.message || "An unknown error occurred.";
        if (error.message?.includes('authentication')) {
             detailedMessage = "Your Stability AI API key is not valid. Please check your key from DreamStudio.";
        }
        
        throw new Error(`Failed to generate image: ${detailedMessage}`);
    }
};