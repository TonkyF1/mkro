import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  UserProfile,
  GOALS,
  ACTIVITY_LEVELS,
  DIETARY_OPTIONS,
  ALLERGY_OPTIONS,
  COOKING_TIME_OPTIONS,
  BUDGET_OPTIONS,
  KITCHEN_EQUIPMENT,
  EATING_OUT_OPTIONS,
  HEALTH_CONDITIONS,
  SUPPLEMENT_OPTIONS,
  MOTIVATION_FACTORS,
} from '@/types/profile';

interface DetailedQuestionnaireProps {
  onComplete: (profile: UserProfile) => void;
  initialData?: Partial<UserProfile>;
}

const DetailedQuestionnaire: React.FC<DetailedQuestionnaireProps> = ({
  onComplete,
  initialData = {},
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const form = useForm({
    defaultValues: {
      name: initialData.name || '',
      age: initialData.age || 25,
      height: initialData.height || 170,
      weight: initialData.weight || 70,
      height_unit: initialData.height_unit || 'cm',
      weight_unit: initialData.weight_unit || 'kg',
      goal: initialData.goal || 'general_health',
      activity_level: initialData.activity_level || 'moderately_active',
      dietary_preferences: initialData.dietary_preferences || [],
      allergies: initialData.allergies || [],
      cooking_time_preference: initialData.cooking_time_preference || '15_30',
      budget_preference: initialData.budget_preference || 'moderate',
      meal_frequency: initialData.meal_frequency || 3,
      kitchen_equipment: initialData.kitchen_equipment || [],
      eating_out_frequency: initialData.eating_out_frequency || 'sometimes',
      health_conditions: initialData.health_conditions || [],
      supplement_usage: initialData.supplement_usage || [],
      sleep_hours: initialData.sleep_hours || 8,
      stress_level: initialData.stress_level || 5,
      motivation_factors: initialData.motivation_factors || [],
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: any) => {
    const weightInKg = data.weight_unit === 'lbs' ? data.weight * 0.453592 : data.weight;
    const hydration_goal = Math.round(weightInKg * 30);

    const getDefaultMacros = (goal: string) => {
      switch (goal) {
        case 'weight_loss':
          return { protein: 35, carbs: 35, fats: 30 };
        case 'muscle_gain':
          return { protein: 30, carbs: 45, fats: 25 };
        case 'maintenance':
          return { protein: 30, carbs: 40, fats: 30 };
        case 'general_health':
          return { protein: 25, carbs: 45, fats: 30 };
        default:
          return { protein: 25, carbs: 45, fats: 30 };
      }
    };

    const macros = getDefaultMacros(data.goal);

    const profile: UserProfile = {
      ...data,
      target_protein: macros.protein,
      target_carbs: macros.carbs,
      target_fats: macros.fats,
      hydration_goal,
      completed_at: new Date().toISOString(),
    };

    onComplete(profile);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Personal Nutrition Questionnaire</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Let's get started!</h2>
                  <p className="text-muted-foreground">Complete your personalized profile</p>
                </div>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your name?</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <Button type="submit" className="flex items-center">
                  Complete Setup
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedQuestionnaire;