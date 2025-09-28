import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, ShoppingCart, User } from 'lucide-react';
import { BurgerMenu } from './BurgerMenu';

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
    <>
      {/* Mobile Burger Menu */}
      <div className="md:hidden">
        <BurgerMenu currentView={currentView} onViewChange={onViewChange} />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:items-center md:gap-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentView === id ? 'default' : 'solid'}
            size="sm"
            onClick={() => onViewChange(id)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
          </Button>
        ))}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-20 md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center gap-1 min-w-0 px-3 py-2 ${
                currentView === id 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
};