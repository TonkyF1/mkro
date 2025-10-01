import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';
import DetailedQuestionnaire from '@/components/DetailedQuestionnaire';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/types/profile';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authHook = useAuth();
  const { user = null, loading: authLoading = true } = authHook || {};
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Only redirect to auth for protected routes, not home page
  useEffect(() => {
    const isProtectedRoute = location.pathname !== '/';
    if (!authLoading && !user && isProtectedRoute) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate, location.pathname]);

  const handleOnboardingComplete = async (profileData: UserProfile) => {
    try {
      await saveProfile(profileData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (authLoading || (user && profileLoading)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Only show questionnaire if user is logged in but hasn't completed profile
  if (user && (!profile || !profile.completed_at)) {
    return <DetailedQuestionnaire onComplete={handleOnboardingComplete} initialData={profile || {}} />;
  }

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
