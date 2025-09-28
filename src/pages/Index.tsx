import { useState, useEffect } from 'react';
import { HydrationTracker } from '@/components/HydrationTracker';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import { Navigation, NavigationView } from '@/components/Navigation';
import { MealPlanner } from '@/components/MealPlanner';
import { ShoppingList } from '@/components/ShoppingList';
import { OnboardingForm } from '@/components/OnboardingForm';
import { recipes, Recipe } from '@/data/recipes';
import { Button } from '@/components/ui/button';
import { UserProfile, GOALS } from '@/types/user';
import { loadUserProfile, calculateDailyWaterGoal, saveUserProfile } from '@/lib/userProfile';

interface MealPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);

  // Check for existing user profile on mount
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  const generateShoppingList = (meals: MealPlan[]) => {
    setMealPlan(meals);
    setCurrentView('shopping');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
  };

  // Show onboarding if no user profile
  if (!userProfile) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-muted">
      <div className="container mx-auto px-4 pb-20 md:pb-4">
        <div className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome back, {userProfile.name}!
              </h1>
              <p className="text-muted-foreground">
                Ready to plan your nutritious meals?
              </p>
            </div>
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>

          {currentView === 'home' && (
            <div className="space-y-8">
              <HydrationTracker />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentView === 'planner' && (
            <MealPlanner 
              recipes={recipes} 
              onGenerateShoppingList={generateShoppingList}
            />
          )}

          {currentView === 'shopping' && (
            <ShoppingList 
              mealPlans={mealPlan}
              onBack={() => setCurrentView('planner')}
            />
          )}

          {currentView === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-6 rounded-lg space-y-4">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {userProfile.name}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {userProfile.age}
                  </div>
                  <div>
                    <span className="font-medium">Goal:</span> {GOALS.find(g => g.value === userProfile.goal)?.label}
                  </div>
                  <div>
                    <span className="font-medium">Daily Water:</span> {calculateDailyWaterGoal(userProfile.weight, userProfile.weightUnit)}ml
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedRecipe && (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;