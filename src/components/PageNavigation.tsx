import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, User, Bot, Dumbbell, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

const PageNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Recipes', shortLabel: 'Home', icon: Home },
    { path: '/planner', label: 'Planner', shortLabel: 'Plan', icon: Calendar },
    { path: '/shopping', label: 'Shopping', shortLabel: 'Shop', icon: ShoppingCart },
    { path: '/exercise', label: 'Exercise', shortLabel: 'Gym', icon: Dumbbell },
    { path: '/food-diary', label: 'Food', shortLabel: 'Food', icon: Utensils },
    { path: '/coach', label: 'Coach', shortLabel: 'AI', icon: Bot },
    { path: '/profile', label: 'Profile', shortLabel: 'Me', icon: User },
  ];

  return (
    <nav className="w-full bg-muted/50 border-b border-border">
      <div className="container mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 py-2 overflow-x-auto">
          {navItems.map(({ path, label, shortLabel, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center justify-center p-1 sm:p-2 flex-shrink-0 min-w-0 h-auto gap-0.5 text-xs rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:hidden text-[10px] leading-none">
                  {shortLabel}
                </span>
                <span className="hidden sm:inline text-xs leading-none">
                  {label}
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