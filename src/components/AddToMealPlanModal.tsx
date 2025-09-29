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
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Side Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Add to Meal Plan</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-6">
            {/* Recipe Info */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <Utensils className="h-5 w-5 text-primary" />
                <span className="font-medium">{recipe.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {recipe.calories} cal • {recipe.prepTime} • {recipe.servingSize}
              </div>
            </div>

            {/* Day Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Day
              </label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Choose a day..." />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {DAYS.map(day => (
                    <SelectItem key={day} value={day} className="py-3">
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meal Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select Meal Type
              </label>
              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Choose meal type..." />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {MEAL_TYPES.map(meal => (
                    <SelectItem key={meal.value} value={meal.value} className="py-3">
                      {meal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={!selectedDay || !selectedMealType}
                className="flex-1 h-12"
              >
                Add to Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};