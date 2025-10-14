import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const goals = [
  'Weight Loss',
  'Muscle Gain',
  'Booty Build',
  'Strength',
  'Endurance',
  'CrossFit',
  'HYROX',
  'Running',
  'Strongman'
];

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
const dietTypes = ['Balanced', 'High Protein', 'Low Carb', 'Keto', 'Vegetarian', 'Vegan', 'Pescatarian'];
const workoutLocations = ['Gym', 'Home', 'Outdoor', 'CrossFit Box', 'Running Track'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    goal: '',
    age: '',
    weight: '',
    height: '',
    fitness_level: '',
    diet_type: '',
    workout_preference: ''
  });

  const totalSteps = 6;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          target_calories: 2000,
          target_protein: 150,
          target_carbs: 200,
          target_fats: 65
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile completed!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return formData.goal !== '';
      case 2: return formData.age && formData.weight && formData.height;
      case 3: return formData.fitness_level !== '';
      case 4: return formData.diet_type !== '';
      case 5: return formData.workout_preference !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted mt-2 text-center">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {step === 0 && (
            <div className="text-center space-y-6">
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
                  MK
                </span>
                <span className="bg-gradient-to-br from-secondary to-secondary-light bg-clip-text text-transparent">
                  RO
                </span>
              </h1>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Welcome to MKRO</h2>
                <p className="text-lg text-muted">Your AI-powered fitness journey starts here</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">What's your goal?</h2>
                <p className="text-muted">Choose your primary fitness objective</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData({ ...formData, goal })}
                    className={`glass rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                      formData.goal === goal ? 'gradient-primary text-white' : 'text-foreground'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your Stats</h2>
                <p className="text-muted">Help us personalize your plan</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 bg-surface rounded-xl border border-white/10 text-foreground focus:border-primary focus:outline-none"
                    placeholder="25"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-3 bg-surface rounded-xl border border-white/10 text-foreground focus:border-primary focus:outline-none"
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-3 bg-surface rounded-xl border border-white/10 text-foreground focus:border-primary focus:outline-none"
                      placeholder="175"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Fitness Level</h2>
                <p className="text-muted">Be honest - we'll adjust accordingly</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {fitnessLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, fitness_level: level })}
                    className={`glass rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                      formData.fitness_level === level ? 'gradient-primary text-white' : 'text-foreground'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Diet Preference</h2>
                <p className="text-muted">What suits your lifestyle?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dietTypes.map((diet) => (
                  <button
                    key={diet}
                    onClick={() => setFormData({ ...formData, diet_type: diet })}
                    className={`glass rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                      formData.diet_type === diet ? 'gradient-primary text-white' : 'text-foreground'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Where do you train?</h2>
                <p className="text-muted">We'll customize your workouts</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {workoutLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setFormData({ ...formData, workout_preference: location })}
                    className={`glass rounded-2xl p-4 hover:scale-[1.02] active:scale-[0.98] transition-all ${
                      formData.workout_preference === location ? 'gradient-primary text-white' : 'text-foreground'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl text-foreground hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 gradient-primary rounded-xl text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {step === totalSteps - 1 ? 'Complete' : 'Continue'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}