import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMKRO } from '@/hooks/useMKRO';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = ['Basics', 'Goals', 'Food', 'Preferences'];

export const MKROOnboarding = () => {
  const navigate = useNavigate();
  const { profile, saveProfile } = useUserProfile();
  const { recalculateMacros, generatePlan, loading: mkroLoading } = useMKRO();
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    sex: profile?.sex || '',
    dob: profile?.dob || '',
    height_cm: profile?.height_cm || '',
    weight_kg: profile?.weight_kg || '',
    goal: profile?.goal || '',
    activity_level: profile?.activity_level || '',
    training_days_per_week: profile?.training_days_per_week || 3,
    dietary_prefs: profile?.dietary_prefs || {},
    allergies: profile?.allergies || [],
    time_available_minutes: profile?.time_available_minutes || 60,
    budget_level: profile?.budget_level || 'medium',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      // Calculate age from DOB
      const age = formData.dob 
        ? new Date().getFullYear() - new Date(formData.dob).getFullYear()
        : 25;

      // Save profile
      await saveProfile({
        ...formData,
        age,
        onboarding_completed: true,
      } as any);

      // Recalculate macros
      await recalculateMacros();

      // Generate initial 7-day plan
      await generatePlan(7, 'both');

      navigate('/nutrition');
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-3xl">Welcome to MKRO</CardTitle>
            <p className="text-muted-foreground">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Sex</Label>
                  <Select value={formData.sex} onValueChange={(v) => updateField('sex', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="nonbinary">Non-binary</SelectItem>
                      <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => updateField('height_cm', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => updateField('weight_kg', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Primary Goal</Label>
                  <Select value={formData.goal} onValueChange={(v) => updateField('goal', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fat_loss">Fat Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="recomp">Body Recomposition</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="general_health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Activity Level</Label>
                  <Select value={formData.activity_level} onValueChange={(v) => updateField('activity_level', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                      <SelectItem value="light">Light (1-2 workouts/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-4 workouts/week)</SelectItem>
                      <SelectItem value="high">High (5-6 workouts/week)</SelectItem>
                      <SelectItem value="athlete">Athlete (training 2x/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Training Days Per Week</Label>
                  <Input
                    type="number"
                    min="0"
                    max="7"
                    value={formData.training_days_per_week}
                    onChange={(e) => updateField('training_days_per_week', parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Dietary Preferences</Label>
                  <Select 
                    value={formData.dietary_prefs?.diet || 'none'} 
                    onValueChange={(v) => updateField('dietary_prefs', { ...formData.dietary_prefs, diet: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No restrictions</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Allergies (comma-separated)</Label>
                  <Input
                    placeholder="e.g., peanuts, shellfish"
                    value={formData.allergies?.join(', ') || ''}
                    onChange={(e) => updateField('allergies', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Time Available Per Day (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.time_available_minutes}
                    onChange={(e) => updateField('time_available_minutes', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Budget Level</Label>
                  <Select value={formData.budget_level} onValueChange={(v) => updateField('budget_level', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (£20-30/week)</SelectItem>
                      <SelectItem value="medium">Medium (£30-50/week)</SelectItem>
                      <SelectItem value="high">High (£50+/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 0 || mkroLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={mkroLoading}
              >
                {mkroLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : step === STEPS.length - 1 ? (
                  'Complete & Generate Plan'
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};