import React from 'react';
import { useNavigate } from 'react-router-dom';
import mkroLogo from '@/assets/mkro-logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO" 
            className="h-12 object-contain mb-2"
          />
          <p className="text-sm font-light text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Personal Nutrition Journey
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;