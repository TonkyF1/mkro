import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, Bot, Dumbbell, Utensils, ChefHat, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/useUserProfile';

const PageNavigation: React.FC = () => {
  const location = useLocation();
  const { profile } = useUserProfile();
  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';
  
  const navItems = [
    { path: '/', label: 'Home', shortLabel: 'Home', icon: Home, premium: false },
    { path: '/planner', label: 'Planner', shortLabel: 'Plan', icon: ChefHat, premium: false },
    { path: '/nutrition', label: 'Nutrition', shortLabel: 'Diary', icon: Utensils, premium: false },
    { path: '/exercise', label: 'Exercise', shortLabel: 'Gym', icon: Dumbbell, premium: false },
    { path: '/coach', label: 'Coach', shortLabel: 'AI', icon: Bot, premium: false },
    { path: '/profile', label: 'Profile', shortLabel: 'Me', icon: User, premium: false },
  ];

  return (
    <nav className="w-full bg-muted/95 backdrop-blur-lg border-t border-border sticky bottom-0 z-40 md:relative md:border-t-0 md:border-b">
      <div className="container mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-around py-3 w-full">
          {navItems.map(({ path, label, shortLabel, icon: Icon, premium }) => {
            const isActive = location.pathname === path;
            const isCoach = path === '/coach';
            const isPremiumLocked = premium && !isPremium;
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 sm:p-3 flex-shrink-0 min-w-[60px] sm:min-w-[80px] min-h-[48px] gap-1 text-xs rounded-xl transition-all relative touch-manipulation",
                  isCoach
                    ? isActive
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg scale-105"
                      : "text-foreground hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                    : isActive 
                      ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                      : "hover:bg-accent hover:text-accent-foreground hover:scale-105",
                  isPremiumLocked && "opacity-60"
                )}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                {isPremiumLocked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-background animate-pulse" />
                )}
                <span className="text-[10px] sm:text-xs leading-none font-medium whitespace-nowrap">
                  {shortLabel}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;