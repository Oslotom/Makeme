
import type React from 'react';

export enum Category {
  Strong = 'Really strong',
  Overweight = 'Overweight',
  Princess = 'A princess',
  Animal = 'An animal',
  Rich = 'Rich',
  Headshot = 'Headshot',
}

export interface GeneratedImage {
  id: string;
  originalUrl: string;
  generatedUrls: string[];
  category: Category;
}

export interface CategoryOption {
  id: Category;
  name: string;
  icon: React.ReactNode;
  prompt: string;
  suggestions: string[];
}