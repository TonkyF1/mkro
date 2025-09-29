import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, ShoppingCart, User, Bot } from 'lucide-react';

type NavigationView = 'home' | 'planner' | 'shopping' | 'profile' | 'mcro-coach';

interface PageNavigationProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ currentView, onViewChange }) => {
  const navItems: Array<{ id: NavigationView; label: string; icon: any }> = [
    { id: 'home', label: 'Recipes', icon: Home },
    { id: 'planner', label: 'Meal Planner', icon: Calendar },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
    { id: 'mcro-coach', label: 'MCRO Coach', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full bg-muted/50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 py-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(id)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;