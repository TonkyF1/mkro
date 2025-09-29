import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, ShoppingCart, User, Bot, Dumbbell, Utensils } from 'lucide-react';

type NavigationView = 'home' | 'planner' | 'shopping' | 'profile' | 'mcro-coach' | 'exercise' | 'food-diary';

interface PageNavigationProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentView, onViewChange }) => {
  const navItems: Array<{ id: NavigationView; label: string; shortLabel: string; icon: any }> = [
    { id: 'home', label: 'Recipes', shortLabel: 'Home', icon: Home },
    { id: 'planner', label: 'Planner', shortLabel: 'Plan', icon: Calendar },
    { id: 'shopping', label: 'Shopping', shortLabel: 'Shop', icon: ShoppingCart },
    { id: 'exercise', label: 'Exercise', shortLabel: 'Gym', icon: Dumbbell },
    { id: 'food-diary', label: 'Food', shortLabel: 'Food', icon: Utensils },
    { id: 'mcro-coach', label: 'Coach', shortLabel: 'AI', icon: Bot },
    { id: 'profile', label: 'Profile', shortLabel: 'Me', icon: User },
  ];

  return (
    <nav className="w-full bg-muted/50 border-b border-border">
      <div className="container mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 py-2 overflow-x-auto">
          {navItems.map(({ id, label, shortLabel, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(id)}
              className="flex flex-col items-center justify-center p-1 sm:p-2 flex-shrink-0 min-w-0 h-auto gap-0.5 text-xs"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="hidden xs:inline sm:hidden text-[10px] leading-none">
                {shortLabel}
              </span>
              <span className="hidden sm:inline text-xs leading-none">
                {label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;