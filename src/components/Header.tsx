import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { UserRoundPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import mkroLogo from '@/assets/mkro-logo.png';
import mkroLogoWhite from '@/assets/mkro-logo-white.png';

const Header = () => {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const logoSrc = currentTheme === 'dark' ? mkroLogoWhite : mkroLogo;

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-1" />
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center"
          onClick={() => navigate('/')}
        >
          <img 
            src={logoSrc} 
            alt="MKRO" 
            className={`object-contain ${currentTheme === 'dark' ? 'h-16 sm:h-20' : 'h-24 sm:h-28'}`}
          />
          <p className="mt-2 text-sm sm:text-base italic text-foreground tracking-wide">
            Training & Meal Planning Coach
          </p>
        </div>
        <div className="flex-1 flex justify-end">
          {user ? (
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')} className="gap-2">
              <UserRoundPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;