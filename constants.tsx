
import React from 'react';
import type { CategoryOption, GeneratedImage } from './types';
import { Category } from './types';

export const CATEGORIES: CategoryOption[] = [
  {
    id: Category.Strong,
    name: 'Really Strong',
    icon: <span role="img" aria-label="muscle" className="text-3xl">💪</span>,
    prompt: "Transform the person in this photo to have a very muscular and strong physique, like a professional bodybuilder. The final image should be photorealistic. It is very important to maintain the original person's facial features, hair, and expression to ensure they are still recognizable."
  },
  {
    id: Category.Overweight,
    name: 'Overweight',
    icon: <span role="img" aria-label="burger" className="text-3xl">🍔</span>,
    prompt: "Realistically alter the body of the person in this photo to appear significantly overweight. The style should be photorealistic. Please preserve the person's original facial identity, hair, and core features, ensuring they remain clearly recognizable, even with natural-looking changes in facial fullness."
  },
  {
    id: Category.Princess,
    name: 'A Princess',
    icon: <span role="img" aria-label="crown" className="text-3xl">👑</span>,
    prompt: "Reimagine the person in this photo as a photorealistic fairytale princess. Dress them in elegant royal attire and add a beautiful tiara. The background should be a majestic, enchanting setting like a castle. It is essential to keep the person's original face, hair, and expression perfectly intact, so they are instantly recognizable."
  },
  {
    id: Category.Animal,
    name: 'An Animal',
    icon: <span role="img" aria-label="dog" className="text-3xl">🐶</span>,
    prompt: "Artistically and subtly merge the person in this portrait with features of a noble animal (such as a lion or a wolf). The result should be a powerful, elegant, and photorealistic hybrid. It is crucial that the person's core facial identity, especially their eyes and recognizable features, are preserved."
  },
  {
    id: Category.Rich,
    name: 'Rich',
    icon: <span role="img" aria-label="gem" className="text-3xl">💎</span>,
    prompt: "Transform the person in this photo to look extremely wealthy in a photorealistic style. Edit their clothing to be high-end and designer, add tasteful luxury accessories, and place them in an opulent setting like a modern penthouse. It is absolutely essential to keep their face, hair, and expression identical to the original photo, ensuring they remain perfectly recognizable."
  },
];

export const MOCK_IMAGES: GeneratedImage[] = [
    { id: '1', originalUrl: 'https://picsum.photos/id/1027/500/500', generatedUrl: 'https://picsum.photos/id/237/500/500', category: Category.Animal },
    { id: '2', originalUrl: 'https://picsum.photos/id/1011/500/500', generatedUrl: 'https://picsum.photos/id/3/500/500', category: Category.Princess },
    { id: '3', originalUrl: 'https://picsum.photos/id/1012/500/500', generatedUrl: 'https://picsum.photos/id/431/500/500', category: Category.Strong },
    { id: '4', originalUrl: 'https://picsum.photos/id/1025/500/500', generatedUrl: 'https://picsum.photos/id/5/500/500', category: Category.Rich },
    { id: '5', originalUrl: 'https://picsum.photos/id/63/500/500', generatedUrl: 'https://picsum.photos/id/111/500/500', category: Category.Overweight },
    { id: '6', originalUrl: 'https://picsum.photos/id/1005/500/500', generatedUrl: 'https://picsum.photos/id/103/500/500', category: Category.Strong },
];