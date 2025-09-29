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
                {currentStep === 1 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Let's get started!</h2>
                      <p className="text-muted-foreground">First, tell us your name</p>
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
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                      <p className="text-muted-foreground">Help us understand your physical profile</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height ({form.watch('height_unit')})</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Health Goals</h2>
                      <p className="text-muted-foreground">What's your primary health objective?</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Goal</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {GOALS.map((goal) => (
                                <div key={goal.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={goal.value} id={goal.value} />
                                  <Label htmlFor={goal.value}>{goal.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
                      <p className="text-muted-foreground">How active are you on a typical day?</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="activity_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {ACTIVITY_LEVELS.map((level) => (
                                <div key={level.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={level.value} id={level.value} />
                                  <Label htmlFor={level.value}>{level.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Dietary Preferences</h2>
                      <p className="text-muted-foreground">Select all that apply to you</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="dietary_preferences"
                      render={() => (
                        <FormItem>
                          <FormLabel>Dietary Preferences</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {DIETARY_OPTIONS.map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="dietary_preferences"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                                    <FormLabel className="text-sm capitalize">{option.replace('-', ' ')}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Allergies & Restrictions</h2>
                      <p className="text-muted-foreground">Let us know about any food allergies</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={() => (
                        <FormItem>
                          <FormLabel>Food Allergies</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {ALLERGY_OPTIONS.map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                                    <FormLabel className="text-sm capitalize">{option.replace('-', ' ')}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {currentStep === 7 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Cooking Preferences</h2>
                      <p className="text-muted-foreground">Help us tailor recipes to your lifestyle</p>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cooking_time_preference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Cooking Time</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                {COOKING_TIME_OPTIONS.map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value}>{option.label}</Label>
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
                            <FormLabel>Budget Preference</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                {BUDGET_OPTIONS.map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value}>{option.label}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {currentStep === 8 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">Final Details</h2>
                      <p className="text-muted-foreground">Just a few more details to personalize your experience</p>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="meal_frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Meals Per Day: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={2}
                                max={6}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sleep_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Sleep Hours: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={4}
                                max={12}
                                step={0.5}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stress_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stress Level (1-10): {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
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
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep} className="flex items-center">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center">
                    Complete Setup
                    <ChevronRight className="ml-2 h-4 w-4" />
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