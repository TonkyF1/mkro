import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrialBanner />
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
