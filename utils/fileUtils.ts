
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const extractBase64Parts = (base64String: string): { mimeType: string; data: string } => {
    const match = base64String.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    if (!match || match.length < 3) {
        throw new Error("Invalid base64 string format. Expected 'data:image/...;base64,...'");
    }
    return { mimeType: match[1], data: match[2] };
};