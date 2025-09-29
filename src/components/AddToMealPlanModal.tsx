import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PopoverContent } from '@/components/ui/popover';
import { Recipe } from '@/hooks/useRecipes';
import { Calendar, Utensils, X } from 'lucide-react';

interface AddToMealPlanModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (day: string, mealType: string) => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
];

export const AddToMealPlanModal = ({ recipe, isOpen, onClose, onConfirm, triggerRef }: AddToMealPlanModalProps) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<string>('');

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
    <PopoverContent 
      className="w-80 p-0 pointer-events-auto z-50" 
      align="center"
      side="top"
      sideOffset={8}
    >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Add to Meal Plan
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="h-3 w-3 text-primary" />
                <span className="font-medium text-xs">{recipe.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {recipe.calories} cal • {recipe.prepTime}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Select Day
                </label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Choose a day..." />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day} className="text-xs">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Select Meal Type
                </label>
                <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Choose meal type..." />
                  </SelectTrigger>
                  <SelectContent className="z-[60]">
                    {MEAL_TYPES.map(meal => (
                      <SelectItem key={meal.value} value={meal.value} className="text-xs">
                        {meal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1 h-8 text-xs">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={!selectedDay || !selectedMealType}
                className="flex-1 h-8 text-xs"
              >
                Add to Plan
              </Button>
            </div>
          </CardContent>
        </Card>
    </PopoverContent>
  );
};