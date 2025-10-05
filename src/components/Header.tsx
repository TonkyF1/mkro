import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const Header = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/50 backdrop-blur-xl shadow-[var(--shadow-sm)]">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex-1">
          {!isPremium && (
            <Button
              onClick={() => navigate('/premium')}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              size="sm"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          )}
        </div>
        <div 
          className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 flex flex-col items-center group"
          onClick={() => navigate('/')}
        >
          <img 
            src={mkroLogo} 
            alt="MKRO - Your AI Health Coach" 
            className="object-contain w-full max-w-xs drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
          />
        </div>
        <div className="flex-1 flex justify-end">
          {isPremium && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 border border-primary/30">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Premium</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
