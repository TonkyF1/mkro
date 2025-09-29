import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HydrationTracker } from '@/components/HydrationTracker';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import Header from '@/components/Header';
import PageNavigation from '@/components/PageNavigation';
import { MealPlanner } from '@/components/MealPlanner';
import { ShoppingList } from '@/components/ShoppingList';
import DetailedQuestionnaire from '@/components/DetailedQuestionnaire';
import { ImageGenerator } from '@/components/ImageGenerator';
import MKROCoach from '@/components/MKROCoach';
import { GeneratedImage } from '@/utils/imageGenerator';
import { useRecipes, Recipe, getAllDietaryTags, getRecipesByCategory } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

type NavigationView = 'home' | 'planner' | 'shopping' | 'profile' | 'mcro-coach';

interface MealPlan {
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();
  const { toast } = useToast();
  const { recipes, loading: recipesLoading, error: recipesError } = useRecipes();
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];
  const dietaryTags = getAllDietaryTags(recipes);

  // Create recipes with generated images, prioritizing generated URLs over static imports
  const recipesWithImages = useMemo(() => {
    return recipes.map(recipe => {
      const generatedImage = generatedImages.find(img => img.recipeId === recipe.id);
      return generatedImage 
        ? { ...recipe, image: generatedImage.imageUrl }
        : recipe;
    });
  }, [recipes, generatedImages]);

  // Filter recipes based on selected criteria
  const filteredRecipes = recipesWithImages.filter(recipe => {
    const categoryMatch = selectedCategory === 'all' || recipe.category === selectedCategory;
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => recipe.dietaryTags.includes(tag));
    return categoryMatch && tagMatch;
  });

  // Check for existing user profile on mount
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const generateShoppingList = (meals: MealPlan[]) => {
    setMealPlan(meals);
    setCurrentView('shopping');
  };

  const handleOnboardingComplete = async (profileData: UserProfile) => {
    try {
      await saveProfile(profileData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    // Add recipe to the next available day or create a new day
    const today = new Date().toISOString().split('T')[0];
    const existingMeals = mealPlan.find(day => day.date === today);
    
    if (existingMeals) {
      // Find the next empty meal slot or create a new day
      if (!existingMeals.breakfast) {
        setMealPlan(prev => prev.map(day => 
          day.date === today ? { ...day, breakfast: recipe } : day
        ));
      } else if (!existingMeals.lunch) {
        setMealPlan(prev => prev.map(day => 
          day.date === today ? { ...day, lunch: recipe } : day
        ));
      } else if (!existingMeals.dinner) {
        setMealPlan(prev => prev.map(day => 
          day.date === today ? { ...day, dinner: recipe } : day
        ));
      } else if (!existingMeals.snack) {
        setMealPlan(prev => prev.map(day => 
          day.date === today ? { ...day, snack: recipe } : day
        ));
      } else {
        // Create a new day
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        setMealPlan(prev => [...prev, { date: tomorrowStr, breakfast: recipe }]);
      }
    } else {
      // Create a new day with this recipe
      setMealPlan(prev => [...prev, { date: today, breakfast: recipe }]);
    }
    
    // Switch to shopping view
    setCurrentView('shopping');
    
    // Show success toast
    toast({
      title: "Recipe Added!",
      description: `${recipe.name} has been added to your shopping list.`
    });
  };

  // Show onboarding if no user profile
  if (authLoading || profileLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  if (!profile || !profile.completed_at) {
    return <DetailedQuestionnaire onComplete={handleOnboardingComplete} initialData={profile || {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageNavigation currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="container mx-auto px-4 py-6">
        {selectedRecipe ? (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
            onAddToShoppingList={handleAddToShoppingList}
          />
        ) : (
          <>
            <div className="mb-6 w-full flex flex-col items-center justify-center text-center">
  <h1 className="text-2xl font-bold text-foreground mb-2">
    Welcome back, {profile?.name?.toUpperCase()}!
  </h1>
  <p className="text-muted-foreground">
    Ready to plan your nutritious meals?
  </p>
</div>

            {currentView === 'home' && (
              <div className="space-y-6">
                <HydrationTracker userProfile={profile} />
                
                <RecipeFilter
                  categories={categories}
                  dietaryTags={dietaryTags}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onCategoryChange={setSelectedCategory}
                  onTagToggle={handleTagToggle}
                  onClearFilters={handleClearFilters}
                />
                
                {recipesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : recipesError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Error loading recipes: {recipesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe} 
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === 'planner' && (
              <MealPlanner 
                recipes={recipesWithImages} 
                onGenerateShoppingList={generateShoppingList}
              />
            )}

            {currentView === 'shopping' && (
              <ShoppingList 
                mealPlans={mealPlan}
                onBack={() => setCurrentView('planner')}
              />
            )}

            {currentView === 'mcro-coach' && <MKROCoach />}

            {currentView === 'profile' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-card border border-border p-6 rounded-lg space-y-4">
                  <h2 className="text-2xl font-bold">Profile Settings</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {profile?.name}
                    </div>
                    <div>
                      <span className="font-medium">Age:</span> {profile?.age}
                    </div>
                    <div>
                      <span className="font-medium">Goal:</span> {profile?.goal?.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Daily Water:</span> {profile?.hydration_goal}ml
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
                
                <div className="bg-card border border-border p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold">Recipe Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate professional food photography using Hugging Face FLUX.1-schnell AI model. Creates stunning, restaurant-quality images for all recipes.
                  </p>
                  <ImageGenerator onImagesGenerated={setGeneratedImages} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;