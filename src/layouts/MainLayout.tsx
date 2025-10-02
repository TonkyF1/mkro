import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import Header from '@/components/Header';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (!authLoading && !profileLoading && user && !profile?.completed_at && location.pathname !== '/questionnaire') {
      navigate('/questionnaire');
    }
  }, [user, profile, authLoading, profileLoading, location.pathname, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
