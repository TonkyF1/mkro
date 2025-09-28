import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { UserProfile, GOALS, DIETARY_OPTIONS, ALLERGY_OPTIONS } from '@/types/user';
import { getDefaultMacros } from '@/lib/userProfile';
import { User, Target, Utensils, Shield } from 'lucide-react';

const userProfileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  age: z.number().min(18, 'Must be 18 or older').max(100, 'Must be 100 or younger'),
  height: z.number().min(100, 'Height must be at least 100cm or 40 inches').max(250, 'Height must be less than 250cm or 100 inches'),
  weight: z.number().min(30, 'Weight must be at least 30kg or 65lbs').max(300, 'Weight must be less than 300kg or 660lbs'),
  heightUnit: z.enum(['cm', 'inches']),
  weightUnit: z.enum(['kg', 'lbs']),
  goal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'general_health']),
  targetProtein: z.number().min(10).max(50),
  targetCarbs: z.number().min(5).max(70),
  targetFats: z.number().min(10).max(70),
  dietaryPreferences: z.array(z.string()),
  allergies: z.array(z.string()),
});

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<UserProfile['goal']>('maintenance');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      heightUnit: 'cm',
      weightUnit: 'kg',
      goal: 'maintenance',
      targetProtein: 30,
      targetCarbs: 40,
      targetFats: 30,
      dietaryPreferences: [],
      allergies: [],
    },
  });

  const watchedGoal = watch('goal');
  const watchedProtein = watch('targetProtein');
  const watchedCarbs = watch('targetCarbs');
  const watchedFats = watch('targetFats');

  const handleGoalChange = (goal: UserProfile['goal']) => {
    setSelectedGoal(goal);
    setValue('goal', goal);
    const defaultMacros = getDefaultMacros(goal);
    setValue('targetProtein', defaultMacros.protein);
    setValue('targetCarbs', defaultMacros.carbs);
    setValue('targetFats', defaultMacros.fats);
  };

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    const current = watch('dietaryPreferences') || [];
    if (checked) {
      setValue('dietaryPreferences', [...current, preference]);
    } else {
      setValue('dietaryPreferences', current.filter(p => p !== preference));
    }
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    const current = watch('allergies') || [];
    if (checked) {
      setValue('allergies', [...current, allergy]);
    } else {
      setValue('allergies', current.filter(a => a !== allergy));
    }
  };

  const onSubmit = (data: UserProfile) => {
    onComplete(data);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const macroTotal = watchedProtein + watchedCarbs + watchedFats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Utensils className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Lovable Meals
            </h1>
          </div>
          <p className="text-muted-foreground">
            Let's personalize your nutrition journey
          </p>
          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full mx-1 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="mt-1"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  className="mt-1"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
                {errors.age && (
                  <p className="text-sm text-destructive mt-1">{errors.age.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="height"
                      type="number"
                      {...register('height', { valueAsNumber: true })}
                      placeholder="170"
                    />
                    <Select onValueChange={(value: 'cm' | 'inches') => setValue('heightUnit', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="cm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="inches">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.height && (
                    <p className="text-sm text-destructive mt-1">{errors.height.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="weight"
                      type="number"
                      {...register('weight', { valueAsNumber: true })}
                      placeholder="70"
                    />
                    <Select onValueChange={(value: 'kg' | 'lbs') => setValue('weightUnit', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="kg" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.weight && (
                    <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Goals</h2>
              </div>
              
              <div>
                <Label>What's your primary goal?</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {GOALS.map((goal) => (
                    <Button
                      key={goal.value}
                      type="button"
                      variant={selectedGoal === goal.value ? "default" : "outline"}
                      className="justify-start h-auto p-4"
                      onClick={() => handleGoalChange(goal.value)}
                    >
                      {goal.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Target Macronutrient Distribution (%)</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust your daily macro targets (Total: {macroTotal}%)
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Protein: {watchedProtein}%</Label>
                    </div>
                    <Slider
                      value={[watchedProtein]}
                      onValueChange={([value]) => setValue('targetProtein', value)}
                      max={50}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Carbohydrates: {watchedCarbs}%</Label>
                    </div>
                    <Slider
                      value={[watchedCarbs]}
                      onValueChange={([value]) => setValue('targetCarbs', value)}
                      max={70}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Fats: {watchedFats}%</Label>
                    </div>
                    <Slider
                      value={[watchedFats]}
                      onValueChange={([value]) => setValue('targetFats', value)}
                      max={70}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {macroTotal !== 100 && (
                  <p className="text-sm text-amber-600">
                    Tip: Macros should total 100% for best results
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Dietary Preferences</h2>
              </div>
              
              <div>
                <Label>Select your dietary preferences (optional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {DIETARY_OPTIONS.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={preference}
                        onCheckedChange={(checked) =>
                          handleDietaryPreferenceChange(preference, checked as boolean)
                        }
                      />
                      <Label htmlFor={preference} className="capitalize">
                        {preference.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Allergies & Restrictions</h2>
              </div>
              
              <div>
                <Label>Select any food allergies (optional)</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {ALLERGY_OPTIONS.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        onCheckedChange={(checked) =>
                          handleAllergyChange(allergy, checked as boolean)
                        }
                      />
                      <Label htmlFor={allergy} className="capitalize">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Save Profile & Continue
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};