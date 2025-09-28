import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Calendar, ShoppingCart, User, X } from 'lucide-react';
import { NavigationView } from './Navigation';

interface BurgerMenuProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavigationView, label: 'Home', icon: Home, description: 'Browse recipes and track hydration' },
    { id: 'planner' as NavigationView, label: 'Meal Planner', icon: Calendar, description: 'Plan your weekly meals' },
    { id: 'shopping' as NavigationView, label: 'Shopping List', icon: ShoppingCart, description: 'Generate shopping lists' },
    { id: 'profile' as NavigationView, label: 'Profile', icon: User, description: 'Manage your preferences' },
  ];

  const handleNavigation = (view: NavigationView) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          {navItems.map(({ id, label, icon: Icon, description }) => (
            <Button
              key={id}
              variant={currentView === id ? 'default' : 'ghost'}
              className={`w-full justify-start p-4 h-auto ${
                currentView === id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
              onClick={() => handleNavigation(id)}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-70 mt-1">{description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};