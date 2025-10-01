import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, User, Bot, Dumbbell, Utensils, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

const PageNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', shortLabel: 'Home', icon: Home },
    { path: '/recipes', label: 'Recipes', shortLabel: 'Food', icon: ChefHat },
    { path: '/nutrition', label: 'Nutrition', shortLabel: 'Diary', icon: Utensils },
    { path: '/shopping', label: 'Shopping', shortLabel: 'Shop', icon: ShoppingCart },
    { path: '/exercise', label: 'Exercise', shortLabel: 'Gym', icon: Dumbbell },
    { path: '/coach', label: 'Coach', shortLabel: 'AI', icon: Bot },
    { path: '/profile', label: 'Profile', shortLabel: 'Me', icon: User },
  ];

  return (
    <nav className="w-full bg-muted/50 border-b border-border">
      <div className="container mx-auto px-1 sm:px-4">
        <div className="flex items-center justify-around py-2 w-full">
          {navItems.map(({ path, label, shortLabel, icon: Icon }) => {
            const isActive = location.pathname === path;
            const isCoach = path === '/coach';
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center justify-center p-1 sm:p-2 flex-shrink-0 min-w-0 h-auto gap-0.5 text-xs rounded-md transition-colors",
                  isCoach
                    ? isActive
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-black dark:text-white"
                      : "text-black dark:text-white hover:text-yellow-600 dark:hover:text-yellow-500"
                    : isActive 
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