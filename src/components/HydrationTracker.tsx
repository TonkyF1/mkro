import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Plus } from 'lucide-react';

interface HydrationTrackerProps {
  className?: string;
}

export const HydrationTracker = ({ className = '' }: HydrationTrackerProps) => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(2000); // 2L default goal
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedIntake = localStorage.getItem('hydration-intake');
    const savedGoal = localStorage.getItem('hydration-goal');
    const lastDate = localStorage.getItem('hydration-date');
    const today = new Date().toDateString();
    
    if (lastDate === today && savedIntake) {
      setIntake(parseInt(savedIntake));
    } else {
      // Reset for new day
      setIntake(0);
      localStorage.setItem('hydration-date', today);
    }
    
    if (savedGoal) {
      setGoal(parseInt(savedGoal));
    }
  }, []);
  
  // Save to localStorage when intake changes
  useEffect(() => {
    localStorage.setItem('hydration-intake', intake.toString());
    localStorage.setItem('hydration-date', new Date().toDateString());
  }, [intake]);
  
  const addWater = (amount: number) => {
    setIntake(prev => Math.min(prev + amount, goal + 500)); // Allow slight overage
  };
  
  const progressPercentage = Math.min((intake / goal) * 100, 100);
  const remainingIntake = Math.max(goal - intake, 0);
  
  const getReminderMessage = () => {
    if (intake >= goal) return "Great job! You've reached your hydration goal! 🎉";
    if (remainingIntake <= 500) return "Almost there! Just a bit more water needed.";
    return `Time to hydrate – ${(remainingIntake / 1000).toFixed(1)}L left!`;
  };

  return (
    <div className={`bg-gradient-to-r from-hydration/10 to-hydration/5 rounded-xl p-6 border border-hydration/20 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Droplets className="h-6 w-6 text-hydration" />
        <h2 className="text-xl font-bold text-foreground">Daily Hydration</h2>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{intake}ml</span>
          <span>{goal}ml goal</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-hydration to-hydration/80 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Add Water Buttons */}
      <div className="flex gap-3 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(250)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          +250ml
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(500)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          +500ml
        </Button>
      </div>
      
      {/* Reminder Message */}
      <div className="text-center">
        <p className="text-sm font-medium text-hydration">
          {getReminderMessage()}
        </p>
      </div>
    </div>
  );
};