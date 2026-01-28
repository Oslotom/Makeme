
import React from 'react';
import type { CategoryOption } from './types';
import { Category } from './types';

const ImagePreview = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
);


export const CATEGORIES: CategoryOption[] = [
  {
    id: Category.Strong,
    name: 'Really Strong',
    icon: <ImagePreview src="https://placehold.co/128x128/a3e635/1e293b?text=Strong" alt="An example of the 'Strong' style" />,
    prompt: "Transform the person in this photo to have a very muscular and strong physique, like a professional bodybuilder. The final image should be photorealistic. It is very important to maintain the original person's facial features, hair, and expression to ensure they are still recognizable.",
    suggestions: ["Add dramatic gym lighting", "Put them on a competition stage", "Make the muscles even bigger", "Give them a superhero costume"]
  },
  {
    id: Category.Overweight,
    name: 'Overweight',
    icon: <ImagePreview src="https://placehold.co/128x128/f97316/1e293b?text=Overweight" alt="An example of the 'Overweight' style" />,
    prompt: "Realistically alter the body of the person in this photo to appear significantly overweight. The style should be photorealistic. Please preserve the person's original facial identity, hair, and core features, ensuring they remain clearly recognizable, even with natural-looking changes in facial fullness.",
    suggestions: ["Place them in a cozy kitchen", "Add a feast of food on a table", "Change outfit to comfy clothes", "Make them look jolly"]
  },
  {
    id: Category.Princess,
    name: 'A Princess',
    icon: <ImagePreview src="https://placehold.co/128x128/f472b6/1e293b?text=Princess" alt="An example of the 'Princess' style" />,
    prompt: "Reimagine the person in this photo as a photorealistic fairytale princess. Dress them in elegant royal attire and add a beautiful tiara. The background should be a majestic, enchanting setting like a castle. It is essential to keep the person's original face, hair, and expression perfectly intact, so they are instantly recognizable.",
    suggestions: ["Add sparkling magic effects", "Put a castle in the background", "Change the dress color to blue", "Give them a fantasy animal companion"]
  },
  {
    id: Category.Animal,
    name: 'An Animal',
    icon: <ImagePreview src="https://placehold.co/128x128/a16207/1e293b?text=Animal" alt="An example of the 'Animal' style" />,
    prompt: "Artistically and subtly merge the person in this portrait with features of a noble animal (such as a lion or a wolf). The result should be a powerful, elegant, and photorealistic hybrid. It is crucial that the person's core facial identity, especially their eyes and recognizable features, are preserved.",
    suggestions: ["Make the animal features more prominent", "Place them in a mystical forest", "Add glowing eyes", "Show their spirit animal beside them"]
  },
  {
    id: Category.Rich,
    name: 'Rich',
    icon: <ImagePreview src="https://placehold.co/128x128/06b6d4/1e293b?text=Rich" alt="An example of the 'Rich' style" />,
    prompt: "Transform the person in this photo to look extremely wealthy in a photorealistic style. Edit their clothing to be high-end and designer, add tasteful luxury accessories, and place them in an opulent setting like a modern penthouse. It is absolutely essential to keep their face, hair, and expression identical to the original photo, ensuring they remain perfectly recognizable.",
    suggestions: ["Put a luxury car in the background", "Change the setting to a yacht", "Add a shower of money", "Give them a crown"]
  },
];