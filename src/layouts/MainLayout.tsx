import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageNavigation from '@/components/PageNavigation';
import TrialBanner from '@/components/TrialBanner';
import mkroLogo from '@/assets/mkro-logo-bounce.svg';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';

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
          className="w-64 h-64 object-contain animate-bounce-slow hover:scale-110 transition-transform"
        />
        <p className="text-xs text-muted-foreground mt-2">Your AI Health Coach</p>
        {isPremium && location.pathname === '/reports' && (
          <Badge variant="outline" className="mt-2 border-primary/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            Premium Reports
          </Badge>
        )}
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
