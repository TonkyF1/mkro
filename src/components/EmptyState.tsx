import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) => {
  return (
    <Card className="border-2 border-dashed border-primary/20">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {actionLabel && onAction && (
            <Button onClick={onAction} size="lg" className="min-h-[48px] min-w-[120px]">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="outline" size="lg" className="min-h-[48px] min-w-[120px]">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
