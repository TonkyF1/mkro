import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex-1" />
        <div 
          className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 flex flex-col items-center"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO - Your AI Health Coach" 
            className="object-contain w-full max-w-2xl drop-shadow-md"
          />
        </div>
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Header;
