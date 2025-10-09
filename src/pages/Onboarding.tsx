import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    dob: '',
    height_cm: '',
    weight_kg: '',
    goal: '',
    activity_level: '',
    training_days_per_week: '',
    dietary_prefs: {},
    time_available_minutes: '',
    budget_level: '',
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          height_cm: parseInt(formData.height_cm),
          weight_kg: parseFloat(formData.weight_kg),
          training_days_per_week: parseInt(formData.training_days_per_week),
          time_available_minutes: parseInt(formData.time_available_minutes),
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Calculate macros
      const { error: macrosError } = await supabase.functions.invoke('ai-macros-recalc');
      if (macrosError) console.error('Macros calculation error:', macrosError);

      toast({
        title: 'Welcome to MKRO!',
        description: 'Your profile has been set up',
      });

      navigate('/nutrition');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Let's Get Started</CardTitle>
          <CardDescription>
            Help us personalize your MKRO experience
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <Label>Gender</Label>
                <RadioGroup value={formData.gender} onValueChange={(v) => updateField('gender', v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nonbinary" id="nonbinary" />
                    <Label htmlFor="nonbinary">Non-binary</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => updateField('height_cm', e.target.value)}
                    placeholder="170"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => updateField('weight_kg', e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={formData.goal} onValueChange={(v) => updateField('goal', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
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
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={formData.activity_level} onValueChange={(v) => updateField('activity_level', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="high">Very Active</SelectItem>
                    <SelectItem value="athlete">Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="training_days">Training Days per Week</Label>
                <Input
                  id="training_days"
                  type="number"
                  min="0"
                  max="7"
                  value={formData.training_days_per_week}
                  onChange={(e) => updateField('training_days_per_week', e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <Label>Dietary Preferences (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  We'll customize meal suggestions based on your preferences
                </p>
                <div className="text-center text-muted-foreground">
                  Diet preferences can be updated later in your profile
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <Label htmlFor="time">Available Time (minutes per day)</Label>
                <Input
                  id="time"
                  type="number"
                  value={formData.time_available_minutes}
                  onChange={(e) => updateField('time_available_minutes', e.target.value)}
                  placeholder="60"
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget Level</Label>
                <Select value={formData.budget_level} onValueChange={(v) => updateField('budget_level', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Budget-Friendly</SelectItem>
                    <SelectItem value="medium">Moderate</SelectItem>
                    <SelectItem value="high">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;