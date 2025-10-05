import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <TrialBanner />
      
      {/* Small bouncing MKRO logo */}
      <div className="flex flex-col items-center pt-6 pb-4">
        <img 
          src={mkroLogo} 
          alt="MKRO - Your AI Health Coach" 
          className="w-20 h-20 object-contain animate-bounce"
        />
        <p className="text-xs text-muted-foreground mt-2">Your AI Health Coach</p>
      </div>
      
      <PageNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
