import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO" 
            className="h-16 object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;