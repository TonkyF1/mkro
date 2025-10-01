import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrialBanner />
      <PageNavigation />
      
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
