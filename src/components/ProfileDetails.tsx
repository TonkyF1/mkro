import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile, GOALS, ACTIVITY_LEVELS, BUDGET_OPTIONS, COOKING_TIME_OPTIONS } from '@/types/profile';
import { DollarSign, Edit, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ProfileDetailsProps {
  profile: UserProfile;
  onEditClick: () => void;
}

const ProfileDetails = ({ profile, onEditClick }: ProfileDetailsProps) => {
  const { theme, setTheme } = useTheme();
  const goalLabel = GOALS.find(g => g.value === profile.goal)?.label;
  const activityLabel = ACTIVITY_LEVELS.find(a => a.value === profile.activity_level)?.label;
  const budgetOption = BUDGET_OPTIONS.find(b => b.value === profile.budget_preference);
  const cookingTimeLabel = COOKING_TIME_OPTIONS.find(c => c.value === profile.cooking_time_preference)?.label;

  const renderBudgetIcons = (budgetType: string | undefined) => {
    const getPoundCount = () => {
      switch (budgetType) {
        case 'budget': return 1;
        case 'moderate': return 2;
        case 'premium': return 3;
        default: return 0;
      }
    };

    const blackPounds = getPoundCount();
    const totalPounds = 3;

    return (
      <div className="flex items-center gap-1">
        {[...Array(totalPounds)].map((_, index) => (
          <span
            key={index}
            className={`text-lg font-bold ${index < blackPounds ? 'text-foreground' : 'text-muted-foreground/30'}`}
          >
            £
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Profile Overview</h2>
        <Button onClick={onEditClick}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Name</span>
            <p className="font-medium">{profile.name || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Age</span>
            <p className="font-medium">{profile.age || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Height</span>
            <p className="font-medium">
              {profile.height ? `${profile.height} ${profile.height_unit}` : 'Not set'}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Weight</span>
            <p className="font-medium">
              {profile.weight ? `${profile.weight} ${profile.weight_unit}` : 'Not set'}
            </p>
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Theme Settings</h3>
        <div className="space-y-3">
          <span className="text-sm text-muted-foreground block">Appearance</span>
          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex-1"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex-1"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              className="flex-1"
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </div>
      </Card>


      {/* Goals & Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Goals & Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Goal</span>
            <p className="font-medium">{goalLabel || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Activity Level</span>
            <p className="font-medium">{activityLabel || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Sleep Hours</span>
            <p className="font-medium">{profile.sleep_hours ? `${profile.sleep_hours} hours` : 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Stress Level</span>
            <p className="font-medium">{profile.stress_level ? `${profile.stress_level}/10` : 'Not set'}</p>
          </div>
        </div>
      </Card>

      {/* Budget & Preferences */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Budget & Cooking Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Budget Preference</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-medium">{budgetOption?.label || 'Not set'}</p>
              {profile.budget_preference && renderBudgetIcons(profile.budget_preference)}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Cooking Time</span>
            <p className="font-medium">{cookingTimeLabel || 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Meal Frequency</span>
            <p className="font-medium">{profile.meal_frequency ? `${profile.meal_frequency} meals/day` : 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Hydration Goal</span>
            <p className="font-medium">{profile.hydration_goal ? `${profile.hydration_goal}ml` : 'Not set'}</p>
          </div>
        </div>
      </Card>

      {/* Nutrition Targets */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Nutrition Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Protein</span>
            <p className="font-medium">{profile.target_protein ? `${profile.target_protein}g` : 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Carbs</span>
            <p className="font-medium">{profile.target_carbs ? `${profile.target_carbs}g` : 'Not set'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Fats</span>
            <p className="font-medium">{profile.target_fats ? `${profile.target_fats}g` : 'Not set'}</p>
          </div>
        </div>
      </Card>

      {/* Dietary Preferences */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Dietary Preferences & Allergies</h3>
        <div className="space-y-4">
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Dietary Preferences</span>
            <div className="flex flex-wrap gap-2">
              {profile.dietary_preferences && profile.dietary_preferences.length > 0 ? (
                profile.dietary_preferences.map((pref) => (
                  <Badge key={pref} variant="secondary">
                    {pref.replace('-', ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">None set</p>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground block mb-2">Allergies</span>
            <div className="flex flex-wrap gap-2">
              {profile.allergies && profile.allergies.length > 0 ? (
                profile.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive">
                    {allergy.replace('-', ' ')}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">None set</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Kitchen Equipment */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Kitchen Equipment</h3>
        <div className="flex flex-wrap gap-2">
          {profile.kitchen_equipment && profile.kitchen_equipment.length > 0 ? (
            profile.kitchen_equipment.map((equipment) => (
              <Badge key={equipment} variant="outline">
                {equipment.replace('-', ' ')}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">None set</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileDetails;