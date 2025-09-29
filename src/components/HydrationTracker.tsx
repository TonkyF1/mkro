import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Plus } from 'lucide-react';
import { loadUserProfile, calculateDailyWaterGoal } from '@/lib/userProfile';

interface HydrationTrackerProps {
  className?: string;
}

export const HydrationTracker = ({ className = '' }: HydrationTrackerProps) => {
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
    
    // Calculate goal based on user profile
    const userProfile = loadUserProfile();
    if (userProfile) {
      const personalizedGoal = calculateDailyWaterGoal(userProfile.weight, userProfile.weightUnit);
      setGoal(personalizedGoal);
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
    <div className={`bg-gradient-to-r from-hydration/10 to-hydration/5 rounded-lg p-4 border border-hydration/20 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-hydration" />
          <h3 className="text-lg font-semibold text-foreground">Daily Hydration</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {intake}ml / {goal}ml
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-hydration to-hydration/80 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Add Water Buttons */}
      <div className="flex gap-2 mb-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(250)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          +250ml
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => addWater(500)}
          className="flex-1 border-hydration/30 hover:bg-hydration/10 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          +500ml
        </Button>
      </div>
      
      {/* Reminder Message */}
      <div className="text-center">
        <p className="text-xs font-medium text-hydration">
          {getReminderMessage()}
        </p>
      </div>
    </div>
  );
};