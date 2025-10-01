import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import mkroLogo from '@/assets/mkro-logo.png';
import mkroLogoWhite from '@/assets/mkro-logo-white.png';

const Header = () => {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light';
  const logoSrc = currentTheme === 'dark' ? mkroLogoWhite : mkroLogo;

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-center">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={logoSrc} 
            alt="MKRO" 
            className={`object-contain ${currentTheme === 'dark' ? 'h-16 sm:h-20' : 'h-24 sm:h-28'}`}
          />
        </div>
        <p className="mt-2 text-sm sm:text-base italic text-foreground tracking-wide">
          Training & Meal Planning Coach
        </p>
      </div>
    </header>
  );
};

export default Header;