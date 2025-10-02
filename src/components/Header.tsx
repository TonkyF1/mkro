import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo.svg';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-1" />
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO" 
            className="object-contain h-32 sm:h-40"
          />
          <p className="mt-2 text-sm sm:text-base italic text-foreground tracking-wide">
            Training & Meal Planning Coach
          </p>
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Header;