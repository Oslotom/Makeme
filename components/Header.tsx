
import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigateHome();
  };

  return (
    <header className="w-full bg-white/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" onClick={handleLinkClick} aria-label="Go to homepage">
            <Logo />
        </a>
        <nav className="items-center gap-6">
            <a href="#create" onClick={handleLinkClick} className="text-base font-medium text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-md hover:bg-white/50">Create</a>
        </nav>
      </div>
    </header>
  );
};