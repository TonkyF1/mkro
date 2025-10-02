import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex-1" />
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO - Your AI Health Coach" 
            className="object-contain w-full max-w-2xl"
          />
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Header;