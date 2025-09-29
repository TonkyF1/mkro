import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 will-change-transform"
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
    >
      <Card 
        className="w-full max-w-md bg-background transform-gpu backface-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Add to Meal Plan
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{recipe.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {recipe.calories} cal • {recipe.prepTime}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Day
              </label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a day..." />
                </SelectTrigger>
                <SelectContent>
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
              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose meal type..." />
                </SelectTrigger>
                <SelectContent>
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
        </CardContent>
      </Card>
    </div>
  );
};