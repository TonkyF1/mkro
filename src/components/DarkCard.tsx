import React from 'react';
import { cn } from '@/lib/utils';

interface DarkCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  onClick?: () => void;
}

export const DarkCard: React.FC<DarkCardProps> = ({ 
  children, 
  className, 
  gradient,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-3xl p-6 overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-slate-800 to-slate-900",
        "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]",
        "hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)]",
        "border border-white/10",
        onClick && "cursor-pointer hover:-translate-y-1",
        className
      )}
      style={gradient ? {
        background: gradient
      } : undefined}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
