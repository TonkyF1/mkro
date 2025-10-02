import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, streak }) => {
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;
        
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
        });
        
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
        });
      }, 250);
    }
  }, [isOpen, hasTriggeredConfetti]);

  const handleClose = () => {
    setHasTriggeredConfetti(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-none bg-gradient-to-br from-primary/10 via-purple-500/10 to-background backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center py-8 px-4 space-y-6">
          {/* Animated Trophy Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-2xl animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute top-20 left-10 animate-pulse">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-32 right-12 animate-pulse delay-100">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="absolute bottom-32 left-16 animate-pulse delay-200">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Amazing Achievement!
            </h2>
            <p className="text-xl font-semibold text-foreground">
              {streak} Day Streak! 🔥
            </p>
            <p className="text-muted-foreground max-w-sm">
              You've successfully tracked meals for {streak} days this week. You're building incredible healthy habits!
            </p>
          </div>

          {/* Stats Card */}
          <div className="w-full bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Progress</p>
                  <p className="text-lg font-bold">{streak} / 7 Days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-500">
                  {Math.round((streak / 7) * 100)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000 ease-out"
                style={{ width: `${(streak / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-primary">
              {streak >= 7 ? "Perfect Week! 🎉" : "Keep it up!"}
            </p>
            <p className="text-xs text-muted-foreground">
              {streak >= 7 
                ? "You've completed a full week of tracking. You're unstoppable!" 
                : `Just ${7 - streak} more ${7 - streak === 1 ? 'day' : 'days'} to complete the week!`
              }
            </p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleClose}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg"
          >
            Continue Your Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
