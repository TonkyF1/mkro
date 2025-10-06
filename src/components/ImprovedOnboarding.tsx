import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, TrendingDown, TrendingUp, Activity, Heart } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ImprovedOnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const ImprovedOnboarding = ({ onComplete }: ImprovedOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    height_unit: 'cm',
    weight_unit: 'kg',
  });

  const goals = [
    { value: 'weight_loss', label: 'Lose Weight', icon: TrendingDown, color: 'from-rose-500 to-pink-600' },
    { value: 'muscle_gain', label: 'Build Muscle', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
    { value: 'maintenance', label: 'Stay Fit', icon: Activity, color: 'from-emerald-500 to-teal-600' },
    { value: 'general_health', label: 'Be Healthy', icon: Heart, color: 'from-purple-500 to-violet-600' },
  ];

  const handleNext = () => {
    if (step === 1 && !profile.goal) return;
    if (step === 2 && (!profile.age || !profile.height || !profile.weight)) return;
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 animate-fade-in">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step ? 'bg-primary w-12' : 'bg-muted w-8'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">Step 1 of 3</Badge>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                What's Your Goal?
              </h2>
              <p className="text-muted-foreground">Choose your primary fitness objective</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setProfile({ ...profile, goal: goal.value as any })}
                  className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                    profile.goal === goal.value
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center`}>
                    <goal.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold">{goal.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Quick Stats */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">Step 2 of 3</Badge>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quick Stats
              </h2>
              <p className="text-muted-foreground">Just the basics to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Age</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                  className="text-lg p-6"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Height</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="170"
                      value={profile.height || ''}
                      onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) })}
                      className="text-lg p-6"
                    />
                    <select
                      value={profile.height_unit}
                      onChange={(e) => setProfile({ ...profile, height_unit: e.target.value as any })}
                      className="px-3 border rounded-lg"
                    >
                      <option value="cm">cm</option>
                      <option value="inches">in</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Weight</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="70"
                      value={profile.weight || ''}
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) })}
                      className="text-lg p-6"
                    />
                    <select
                      value={profile.weight_unit}
                      onChange={(e) => setProfile({ ...profile, weight_unit: e.target.value as any })}
                      className="px-3 border rounded-lg"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Food Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="mb-2">Step 3 of 3</Badge>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Food Preferences
              </h2>
              <p className="text-muted-foreground">Tap what you eat (optional)</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {['🥩 Meat', '🐟 Fish', '🥚 Eggs', '🥛 Dairy', '🌾 Grains', '🥬 Veggies', '🍎 Fruits', '🥜 Nuts', '🍰 Sweets'].map((item) => {
                const isSelected = profile.dietary_preferences?.includes(item) || false;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      const current = profile.dietary_preferences || [];
                      setProfile({
                        ...profile,
                        dietary_preferences: isSelected
                          ? current.filter(p => p !== item)
                          : [...current, item]
                      });
                    }}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <p className="text-2xl mb-1">{item.split(' ')[0]}</p>
                    <p className="text-xs">{item.split(' ')[1]}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={step === 1 && !profile.goal}
            className={`ml-auto gap-2 ${step === 3 ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
          >
            {step === 3 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Let's Go!
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
