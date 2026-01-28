
import React from 'react';
import type { CategoryOption } from './types';
import { Category } from './types';

const iconSize = "h-10 w-10 text-slate-600 group-hover:text-indigo-600 transition-colors";

const StrongIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728" />
    </svg>
);

const OverweightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PrincessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 16s1.29-2.58 3-3.58S12 11 12 11s2.21.08 4 1.08 3 3.58 3 3.58" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V3l4 4-4 4-4-4 4-4z" />
    </svg>
);

const AnimalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.82 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 12.5c0-1.5-2-4.5-3.5-4.5s-3.5 3-3.5 4.5" />
    </svg>
);

const RichIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
    </svg>
);


export const CATEGORIES: CategoryOption[] = [
  {
    id: Category.Strong,
    name: 'Really Strong',
    icon: <StrongIcon />,
    prompt: "Transform the person in this photo to have a very muscular and strong physique, like a professional bodybuilder. The final image should be photorealistic. It is very important to maintain the original person's facial features, hair, and expression to ensure they are still recognizable."
  },
  {
    id: Category.Overweight,
    name: 'Overweight',
    icon: <OverweightIcon />,
    prompt: "Realistically alter the body of the person in this photo to appear significantly overweight. The style should be photorealistic. Please preserve the person's original facial identity, hair, and core features, ensuring they remain clearly recognizable, even with natural-looking changes in facial fullness."
  },
  {
    id: Category.Princess,
    name: 'A Princess',
    icon: <PrincessIcon />,
    prompt: "Reimagine the person in this photo as a photorealistic fairytale princess. Dress them in elegant royal attire and add a beautiful tiara. The background should be a majestic, enchanting setting like a castle. It is essential to keep the person's original face, hair, and expression perfectly intact, so they are instantly recognizable."
  },
  {
    id: Category.Animal,
    name: 'An Animal',
    icon: <AnimalIcon />,
    prompt: "Artistically and subtly merge the person in this portrait with features of a noble animal (such as a lion or a wolf). The result should be a powerful, elegant, and photorealistic hybrid. It is crucial that the person's core facial identity, especially their eyes and recognizable features, are preserved."
  },
  {
    id: Category.Rich,
    name: 'Rich',
    icon: <RichIcon />,
    prompt: "Transform the person in this photo to look extremely wealthy in a photorealistic style. Edit their clothing to be high-end and designer, add tasteful luxury accessories, and place them in an opulent setting like a modern penthouse. It is absolutely essential to keep their face, hair, and expression identical to the original photo, ensuring they remain perfectly recognizable."
  },
];