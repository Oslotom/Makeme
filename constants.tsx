
import React from 'react';
import type { CategoryOption, GeneratedImage } from './types';
import { Category } from './types';

export const CATEGORIES: CategoryOption[] = [
  {
    id: Category.Strong,
    name: 'Really Strong',
    icon: <span role="img" aria-label="muscle" className="text-3xl">💪</span>,
    prompt: 'Transform the person in this portrait to look incredibly muscular and strong, like a professional bodybuilder or a superhero. Enhance muscle definition, size, and overall physical power.'
  },
  {
    id: Category.Overweight,
    name: 'Overweight',
    icon: <span role="img" aria-label="burger" className="text-3xl">🍔</span>,
    prompt: 'Modify this portrait to make the person appear significantly overweight. Add features like a double chin, fuller cheeks, and a larger body frame in a realistic manner.'
  },
  {
    id: Category.Princess,
    name: 'A Princess',
    icon: <span role="img" aria-label="crown" className="text-3xl">👑</span>,
    prompt: 'Reimagine the person in this photo as a fairytale princess. Give them elegant royal attire, a tiara, and a majestic, enchanting background like a castle or a magical forest.'
  },
  {
    id: Category.Animal,
    name: 'An Animal',
    icon: <span role="img" aria-label="dog" className="text-3xl">🐶</span>,
    prompt: 'Creatively merge the person in this portrait with their noble spirit animal, creating a beautiful and artistic human-animal hybrid. The result should be elegant and powerful.'
  },
  {
    id: Category.Rich,
    name: 'Rich',
    icon: <span role="img" aria-label="gem" className="text-3xl">💎</span>,
    prompt: 'Make the person in this photo look extremely wealthy and luxurious. Place them in an opulent setting, dress them in designer clothes, and add accessories like expensive jewelry.'
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
