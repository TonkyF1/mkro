import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO Logo" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-foreground">MKRO</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Meal Planning & Recipe Assistant
        </div>
      </div>
    </header>
  );
};

export default Header;