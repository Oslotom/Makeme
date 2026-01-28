
import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="w-full bg-transparent border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onReset(); }} 
            aria-label="Go to homepage"
        >
            <Logo />
        </a>
        <nav className="flex items-center gap-6">
            <a href="#create" className="text-base font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-md">Create</a>
        </nav>
      </div>
    </header>
  );
};