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
  const totalSteps = 5;

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
        <CardHeader className="space-y-4 pb-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <span className="text-3xl font-bold text-primary">{currentStep}</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to MKRO
            </CardTitle>
            <p className="text-muted-foreground">Let's personalize your experience in just a few steps</p>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold">Let's get to know you</h2>
                      <p className="text-muted-foreground">Tell us about yourself</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">What's your name?</FormLabel>
                          <FormControl>
                            <Input className="h-12 text-lg" placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Your age</FormLabel>
                          <FormControl>
                            <Input className="h-12 text-lg" type="number" placeholder="25" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold">Your Body Stats & Goals</h2>
                      <p className="text-muted-foreground">This helps us create your perfect plan</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height ({form.watch('height_unit')})</FormLabel>
                            <FormControl>
                              <Input className="h-12 text-lg" type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight ({form.watch('weight_unit')})</FormLabel>
                            <FormControl>
                              <Input className="h-12 text-lg" type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">What's your main goal?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-3"
                            >
                              {GOALS.map((goal) => (
                                <div key={goal.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-colors">
                                  <RadioGroupItem value={goal.value} id={goal.value} />
                                  <Label htmlFor={goal.value} className="cursor-pointer">{goal.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold">Activity & Diet</h2>
                      <p className="text-muted-foreground">Help us tailor your nutrition</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="activity_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">How active are you?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {ACTIVITY_LEVELS.map((level) => (
                                <div key={level.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-colors">
                                  <RadioGroupItem value={level.value} id={level.value} />
                                  <Label htmlFor={level.value} className="cursor-pointer flex-1">{level.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dietary_preferences"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">Dietary preferences (optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {DIETARY_OPTIONS.slice(0, 6).map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="dietary_preferences"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 border rounded-lg p-2 hover:bg-primary/5 transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option]
                                            : (field.value || []).filter((value) => value !== option);
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm capitalize cursor-pointer">{option.replace('-', ' ')}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold">Cooking & Budget</h2>
                      <p className="text-muted-foreground">Let's match meals to your lifestyle</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="cooking_time_preference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">How much time do you have for cooking?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {COOKING_TIME_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-colors">
                                  <RadioGroupItem value={option.value} id={option.value} />
                                  <Label htmlFor={option.value} className="cursor-pointer flex-1">{option.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget_preference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">What's your food budget?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-3 gap-3"
                            >
                              {BUDGET_OPTIONS.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-primary/5 transition-colors">
                                  <RadioGroupItem value={option.value} id={option.value} />
                                  <Label htmlFor={option.value} className="cursor-pointer capitalize">{option.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h2 className="text-2xl font-bold">Almost Done!</h2>
                      <p className="text-muted-foreground">A few final details</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">Any food allergies? (optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {ALLERGY_OPTIONS.map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 border rounded-lg p-2 hover:bg-primary/5 transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option]
                                            : (field.value || []).filter((value) => value !== option);
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm capitalize cursor-pointer">{option}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="kitchen_equipment"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-base">What kitchen equipment do you have? (optional)</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {KITCHEN_EQUIPMENT.slice(0, 6).map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="kitchen_equipment"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 border rounded-lg p-2 hover:bg-primary/5 transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [...(field.value || []), option]
                                            : (field.value || []).filter((value) => value !== option);
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm capitalize cursor-pointer">{option.replace('_', ' ')}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-6 gap-4">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} className={currentStep === 1 ? 'w-full' : 'flex-1'}>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Get Started
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedQuestionnaire;