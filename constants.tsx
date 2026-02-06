
import React from 'react';
import type { CategoryOption } from './types';
import { Category } from './types';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:text-white transition-colors duration-300">
        {children}
    </div>
);

export const CATEGORIES: CategoryOption[] = [
  {
    id: Category.Strong,
    name: 'Really Strong',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25278C12 6.25278 14.8866 3 17.5 3C20.1134 3 21 5.69647 21 6.25278V10.8753C21 12.0673 20.2188 13.1253 19.25 13.1253H17.5C15.875 13.1253 15 12 15 10.8753C15 9.75057 15 6.25278 15 6.25278" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.25278C9 6.25278 11.8866 3 14.5 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21V13.1253" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.00001 10.8753C9.00001 12 8.12501 13.1253 6.50001 13.1253H4.75001C3.78126 13.1253 3.00001 12.0673 3.00001 10.8753V6.25278C3.00001 5.69647 3.88661 3 6.50001 3C9.11341 3 12 6.25278 12 6.25278" /></svg></IconWrapper>,
    prompt: "Generate a photorealistic image that transforms the person in the photo to have a very muscular and strong physique, like a professional bodybuilder. CRITICAL INSTRUCTION: The person's face, including all facial features, structure, skin tone, and expression from the original photo, MUST be preserved with 100% accuracy. The person must be instantly and perfectly recognizable.",
    suggestions: ["Add dramatic gym lighting", "Put them on a competition stage", "Make the muscles even bigger", "Give them a superhero costume"]
  },
  {
    id: Category.Overweight,
    name: 'Overweight',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a7 7 0 01-7-7V9a7 7 0 017-7h10a7 7 0 017 7v5a7 7 0 01-7 7z" /></svg></IconWrapper>,
    prompt: "Generate a photorealistic image that realistically alters the body of the person in the photo to appear significantly overweight. CRITICAL INSTRUCTION: The person's face, including all facial features, structure, skin tone, and expression from the original photo, MUST be preserved with 100% accuracy, making only natural-looking adjustments for facial fullness. The person must be instantly and perfectly recognizable.",
    suggestions: ["Place them in a cozy kitchen", "Add a feast of food on a table", "Change outfit to comfy clothes", "Make them look jolly"]
  },
  {
    id: Category.Princess,
    name: 'A Princess',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 4l2-4h4a2 2 0 012 2v10a2 2 0 01-2 2H5z" /></svg></IconWrapper>,
    prompt: "Generate a photorealistic image that reimagines the person in this photo as a fairytale princess. They should be in elegant royal attire with a tiara, in a majestic setting. CRITICAL INSTRUCTION: The person's face, including all facial features, structure, skin tone, and expression from the original photo, MUST be preserved with 100% accuracy. The person must be instantly and perfectly recognizable.",
    suggestions: ["Add sparkling magic effects", "Put a castle in the background", "Change the dress color to blue", "Give them a fantasy animal companion"]
  },
  {
    id: Category.Animal,
    name: 'An Animal',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></IconWrapper>,
    prompt: "Generate a photorealistic image that artistically and subtly merges the person in this portrait with features of a noble animal (e.g., a lion or wolf). CRITICAL INSTRUCTION: The person's core facial identity, especially their eyes, facial structure, and recognizable features from the original photo, MUST be preserved with 100% accuracy. The person must be instantly and perfectly recognizable.",
    suggestions: ["Make the animal features more prominent", "Place them in a mystical forest", "Add glowing eyes", "Show their spirit animal beside them"]
  },
  {
    id: Category.Rich,
    name: 'Rich',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg></IconWrapper>,
    prompt: "Generate a photorealistic image that transforms the person in this photo to look extremely wealthy. Edit their clothing to be high-end and designer and place them in an opulent setting. CRITICAL INSTRUCTION: The person's face, including all facial features, structure, skin tone, and expression from the original photo, MUST be preserved with 100% accuracy. The person must be instantly and perfectly recognizable.",
    suggestions: ["Put a luxury car in the background", "Change the setting to a yacht", "Add a shower of money", "Give them a crown"]
  },
  {
    id: Category.Headshot,
    name: 'Headshot',
    icon: <IconWrapper><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg></IconWrapper>,
    prompt: "Generate a professional, high-quality headshot of the person in the photo, placing them in a neutral, professional setting. CRITICAL INSTRUCTION: The person's face, including all facial features, structure, skin tone, and expression from the original photo, MUST be preserved with 100% accuracy. The person must be instantly and perfectly recognizable.",
    suggestions: ["Wear a business suit", "Change background to an office", "Try a more casual look", "Make it black and white"]
  },
];