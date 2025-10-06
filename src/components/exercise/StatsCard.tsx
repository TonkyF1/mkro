import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  trend,
  className
}) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl",
      `bg-gradient-to-br ${gradient}`,
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm",
            "group-hover:scale-110 transition-transform duration-300"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold",
              trend.isPositive ? "bg-emerald-500/20 text-emerald-600" : "bg-red-500/20 text-red-600"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <p className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
