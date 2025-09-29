import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recipe } from '@/hooks/useRecipes';
import { Calendar, Utensils, X } from 'lucide-react';

interface AddToMealPlanModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (day: string, mealType: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
];

export const AddToMealPlanModal = ({ recipe, isOpen, onClose, onConfirm }: AddToMealPlanModalProps) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedDay && selectedMealType) {
      onConfirm(selectedDay, selectedMealType);
      onClose();
      setSelectedDay('');
      setSelectedMealType('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDay('');
    setSelectedMealType('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={handleClose}
      />
      <div className="meal-plan-panel fixed top-0 left-0 h-full w-full max-w-sm bg-background shadow-xl z-50 animate-slide-in-left overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Add to Meal Plan</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{recipe.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {recipe.calories} cal • {recipe.prepTime}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Day
              </label>
              <Select 
                value={selectedDay} 
                onValueChange={setSelectedDay}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a day..." />
                </SelectTrigger>
                <SelectContent 
                  className="panel-popover"
                  position="popper"
                  sideOffset={4}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {DAYS.map(day => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Meal Type
              </label>
              <Select 
                value={selectedMealType} 
                onValueChange={setSelectedMealType}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose meal type..." />
                </SelectTrigger>
                <SelectContent 
                  className="panel-popover"
                  position="popper"
                  sideOffset={4}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {MEAL_TYPES.map(meal => (
                    <SelectItem key={meal.value} value={meal.value}>
                      {meal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedDay || !selectedMealType}
              className="flex-1"
            >
              Add to Plan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};