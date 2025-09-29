import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { UserProfile, GOALS, ACTIVITY_LEVELS, BUDGET_OPTIONS, COOKING_TIME_OPTIONS, DIETARY_OPTIONS, ALLERGY_OPTIONS, KITCHEN_EQUIPMENT } from '@/types/profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

interface ProfileEditProps {
  profile: UserProfile;
  onBack: () => void;
}

const ProfileEdit = ({ profile, onBack }: ProfileEditProps) => {
  const { saveProfile } = useUserProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    dietary_preferences: profile.dietary_preferences || [],
    allergies: profile.allergies || [],
    kitchen_equipment: profile.kitchen_equipment || [],
    motivation_factors: profile.motivation_factors || [],
    health_conditions: profile.health_conditions || [],
    supplement_usage: profile.supplement_usage || [],
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveProfile(formData);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      onBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDietaryChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietary_preferences: checked 
        ? [...(prev.dietary_preferences || []), option]
        : (prev.dietary_preferences || []).filter(item => item !== option)
    }));
  };

  const handleAllergyChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergies: checked 
        ? [...(prev.allergies || []), option]
        : (prev.allergies || []).filter(item => item !== option)
    }));
  };

  const handleEquipmentChange = (option: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      kitchen_equipment: checked 
        ? [...(prev.kitchen_equipment || []), option]
        : (prev.kitchen_equipment || []).filter(item => item !== option)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
            />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || undefined }))}
              />
              <Select
                value={formData.height_unit}
                onValueChange={(value: 'cm' | 'inches') => setFormData(prev => ({ ...prev, height_unit: value }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="inches">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
              />
              <Select
                value={formData.weight_unit}
                onValueChange={(value: 'kg' | 'lbs') => setFormData(prev => ({ ...prev, weight_unit: value }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Goals & Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Goals & Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="goal">Goal</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="activity">Activity Level</Label>
            <Select
              value={formData.activity_level}
              onValueChange={(value) => setFormData(prev => ({ ...prev, activity_level: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sleep">Sleep Hours</Label>
            <Input
              id="sleep"
              type="number"
              step="0.5"
              value={formData.sleep_hours || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sleep_hours: parseFloat(e.target.value) || undefined }))}
            />
          </div>
          <div>
            <Label htmlFor="stress">Stress Level (1-10)</Label>
            <div className="mt-2">
              <Slider
                value={[formData.stress_level || 5]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value[0] }))}
                max={10}
                min={1}
                step={1}
              />
              <div className="text-center mt-1 text-sm text-muted-foreground">
                {formData.stress_level || 5}/10
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Budget & Preferences */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Budget & Cooking Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budget">Budget Preference</Label>
            <Select
              value={formData.budget_preference}
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget_preference: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget preference" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cooking-time">Cooking Time Preference</Label>
            <Select
              value={formData.cooking_time_preference}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cooking_time_preference: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cooking time" />
              </SelectTrigger>
              <SelectContent>
                {COOKING_TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="meals">Meals per day</Label>
            <Input
              id="meals"
              type="number"
              value={formData.meal_frequency || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, meal_frequency: parseInt(e.target.value) || undefined }))}
            />
          </div>
          <div>
            <Label htmlFor="hydration">Hydration Goal (ml)</Label>
            <Input
              id="hydration"
              type="number"
              value={formData.hydration_goal || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, hydration_goal: parseInt(e.target.value) || undefined }))}
            />
          </div>
        </div>
      </Card>

      {/* Nutrition Targets */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Nutrition Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              value={formData.target_protein || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, target_protein: parseInt(e.target.value) || undefined }))}
            />
          </div>
          <div>
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              value={formData.target_carbs || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, target_carbs: parseInt(e.target.value) || undefined }))}
            />
          </div>
          <div>
            <Label htmlFor="fats">Fats (g)</Label>
            <Input
              id="fats"
              type="number"
              value={formData.target_fats || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, target_fats: parseInt(e.target.value) || undefined }))}
            />
          </div>
        </div>
      </Card>

      {/* Dietary Preferences */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Dietary Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DIETARY_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`diet-${option}`}
                checked={(formData.dietary_preferences || []).includes(option)}
                onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
              />
              <Label htmlFor={`diet-${option}`} className="text-sm">
                {option.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Allergies */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Allergies</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ALLERGY_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${option}`}
                checked={(formData.allergies || []).includes(option)}
                onCheckedChange={(checked) => handleAllergyChange(option, checked as boolean)}
              />
              <Label htmlFor={`allergy-${option}`} className="text-sm">
                {option.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Kitchen Equipment */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Kitchen Equipment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {KITCHEN_EQUIPMENT.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`equipment-${option}`}
                checked={(formData.kitchen_equipment || []).includes(option)}
                onCheckedChange={(checked) => handleEquipmentChange(option, checked as boolean)}
              />
              <Label htmlFor={`equipment-${option}`} className="text-sm">
                {option.replace('-', ' ')}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pb-8">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEdit;