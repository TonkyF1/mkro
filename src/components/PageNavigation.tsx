import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, ShoppingCart, User, Bot, Dumbbell, Utensils, ChefHat, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const PageNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', shortLabel: 'Home', icon: Home },
    { path: '/recipes', label: 'Recipes', shortLabel: 'Food', icon: ChefHat },
    { path: '/nutrition', label: 'Nutrition', shortLabel: 'Diary', icon: Utensils },
    { path: '/shopping', label: 'Shopping', shortLabel: 'Shop', icon: ShoppingCart },
    { path: '/exercise', label: 'Exercise', shortLabel: 'Gym', icon: Dumbbell },
    { path: '/coach', label: 'Coach', shortLabel: 'AI', icon: Bot },
  ];

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="w-full bg-muted/50 border-b border-border">
      <div className="container mx-auto px-1 sm:px-2">
        <div className="flex items-center justify-between py-2 w-full max-w-full gap-0.5 sm:gap-1">
          {navItems.map(({ path, label, shortLabel, icon: Icon }) => {
            const isActive = location.pathname === path;
            const isCoach = path === '/coach';
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex flex-col items-center justify-center p-1 sm:p-2 flex-shrink-0 flex-1 min-w-0 h-auto gap-0.5 text-xs rounded-md transition-colors",
                  isCoach
                    ? isActive
                      ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-black"
                      : "hover:text-yellow-600"
                    : isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px] sm:text-xs leading-none truncate max-w-full">
                  {shortLabel}
                </span>
              </NavLink>
            );
          })}
          
          {/* Profile/Login Icon */}
          <button
            onClick={handleProfileClick}
            className={cn(
              "flex flex-col items-center justify-center p-1 sm:p-2 flex-shrink-0 flex-1 min-w-0 h-auto gap-0.5 text-xs rounded-md transition-colors",
              (location.pathname === '/profile' || location.pathname === '/auth')
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {user ? (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px] sm:text-xs leading-none truncate max-w-full">
                  Me
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px] sm:text-xs leading-none truncate max-w-full">
                  Login
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PageNavigation;