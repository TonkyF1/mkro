import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export const PremiumStatCard: React.FC<PremiumStatCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  subtitle,
  trend,
  className
}) => {
  return (
    <Card className={cn(
      "group relative p-6 overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
      className
    )}>
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        gradient
      )} />
      
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 bg-gradient-to-br from-primary/50 to-accent/50" />
      
      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <span className={cn(
                "text-sm font-semibold",
                trend.positive ? "text-accent" : "text-destructive"
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {/* Icon */}
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
          "group-hover:scale-110 transition-transform duration-500",
          gradient
        )}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
};
