import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, ShoppingCart, User } from 'lucide-react';

export type NavigationView = 'home' | 'planner' | 'shopping' | 'profile';

interface NavigationProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home' as NavigationView, label: 'Home', icon: Home },
    { id: 'planner' as NavigationView, label: 'Planner', icon: Calendar },
    { id: 'shopping' as NavigationView, label: 'Shopping', icon: ShoppingCart },
    { id: 'profile' as NavigationView, label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-20 md:static md:border-t-0 md:bg-transparent md:backdrop-blur-none h-12">
      <div className="flex justify-around items-center py-2 md:justify-start md:gap-2 md:py-0">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentView === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange(id)}
            className={`flex flex-col md:flex-row items-center gap-1 min-w-0 px-3 py-2 md:px-4 ${
              currentView === id 
                ? 'bg-gradient-primary text-white' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};