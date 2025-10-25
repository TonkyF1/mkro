import React from 'react';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const LoadingScreen = () => {

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo with pulse animation */}
        <div className="relative">
          <img 
            src={mkroLogo} 
            alt="MKRO" 
            className="w-24 h-24 object-contain animate-pulse"
          />
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">MKRO</h2>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[slide-in-right_2s_ease-in-out_infinite] origin-left"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;