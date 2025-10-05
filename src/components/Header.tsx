import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/50 backdrop-blur-xl shadow-[var(--shadow-sm)]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1" />
        <div 
          className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 flex flex-col items-center group"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO - Your AI Health Coach" 
            className="object-contain w-full max-w-2xl drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
          />
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Header;
