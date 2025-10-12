import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Plus } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface HydrationTrackerProps {
  userProfile?: UserProfile | null;
  className?: string;
}

export const HydrationTracker = ({ userProfile, className = '' }: HydrationTrackerProps) => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(2000); // Default goal
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedIntake = localStorage.getItem('hydration-intake');
    const lastDate = localStorage.getItem('hydration-date');
    const today = new Date().toDateString();
    
    if (lastDate === today && savedIntake) {
      setIntake(parseInt(savedIntake));
    } else {
      // Reset for new day
      setIntake(0);
      localStorage.setItem('hydration-date', today);
    }
    
    // Set goal based on user profile
    if (userProfile?.hydration_goal) {
      setGoal(userProfile.hydration_goal);
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
    <div className={`bg-gradient-to-r from-hydration/10 to-hydration/5 rounded-lg p-2 border border-hydration/20 ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Droplets className="h-4 w-4 text-hydration" />
          <h3 className="text-sm font-semibold text-foreground">Hydration</h3>
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {intake}ml / {goal}ml
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-1.5">
        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-hydration to-hydration/80 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Add Water Buttons */}
      <div className="flex gap-1.5 mb-1.5">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(250)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10 text-xs h-7 px-2"
        >
          <Plus className="h-2.5 w-2.5 mr-0.5" />
          +250ml
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(500)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10 text-xs h-7 px-2"
        >
          <Plus className="h-2.5 w-2.5 mr-0.5" />
          +500ml
        </Button>
      </div>
      
      {/* Reminder Message */}
      <div className="text-center">
        <p className="text-xs font-medium text-hydration leading-tight">
          {getReminderMessage()}
        </p>
      </div>
    </div>
  );
};