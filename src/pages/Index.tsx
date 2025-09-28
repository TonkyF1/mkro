import { useState, useMemo, useEffect } from 'react';
import { HydrationTracker } from '@/components/HydrationTracker';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilter } from '@/components/RecipeFilter';
import { RecipeDetail } from '@/components/RecipeDetail';
import { Navigation, NavigationView } from '@/components/Navigation';
import { MealPlanner } from '@/components/MealPlanner';
import { ShoppingList } from '@/components/ShoppingList';
import { OnboardingForm } from '@/components/OnboardingForm';
import { recipes, getAllDietaryTags, Recipe } from '@/data/recipes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Utensils, Heart, Leaf, User, Settings } from 'lucide-react';
import { UserProfile, GOALS } from '@/types/user';
import { loadUserProfile, calculateDailyWaterGoal, saveUserProfile } from '@/lib/userProfile';

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];
  const dietaryTags = getAllDietaryTags();

  // Check for existing user profile on mount
  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setUserProfile(profile);
      // Auto-select user's dietary preferences
      setSelectedTags(profile.dietaryPreferences);
    } else {
      setShowOnboarding(true);
    }
  }, []);
  
  // Filter recipes based on selected criteria and user profile
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const categoryMatch = selectedCategory === 'all' || recipe.category === selectedCategory;
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.some(tag => recipe.dietaryTags.includes(tag));
      
      // Filter out recipes with user allergies
      const allergyMatch = !userProfile?.allergies.length || 
        !userProfile.allergies.some(allergy => 
          recipe.dietaryTags.some(tag => tag.includes(allergy)) ||
          recipe.description.toLowerCase().includes(allergy)
        );
      
      return categoryMatch && tagMatch && allergyMatch;
    });

    // Sort recipes - prioritize those matching user preferences
    if (userProfile?.dietaryPreferences.length) {
      filtered.sort((a, b) => {
        const aMatches = a.dietaryTags.filter(tag => userProfile.dietaryPreferences.includes(tag)).length;
        const bMatches = b.dietaryTags.filter(tag => userProfile.dietaryPreferences.includes(tag)).length;
        return bMatches - aMatches; // Sort by most matches first
      });
    }
    
    return filtered;
  }, [selectedCategory, selectedTags, userProfile]);
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags(userProfile?.dietaryPreferences || []);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    setSelectedTags(profile.dietaryPreferences);
    setShowOnboarding(false);
  };

  const handleEditProfile = () => {
    setShowOnboarding(true);
  };
  
  const getCategoryStats = () => {
    const breakfasts = recipes.filter(r => r.category === 'breakfast').length;
    const lunches = recipes.filter(r => r.category === 'lunch').length;
    const dinners = recipes.filter(r => r.category === 'dinner').length;
    const snacks = recipes.filter(r => r.category === 'snack').length;
    return { breakfasts, lunches, dinners, snacks };
  };
  
  const stats = getCategoryStats();

  // Show onboarding if no user profile
  if (showOnboarding) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }
  
  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-background p-4">
        <RecipeDetail 
          recipe={selectedRecipe} 
          onBack={() => setSelectedRecipe(null)} 
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Utensils className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Lovable Meals
              </h1>
            </div>
            {userProfile && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <User className="h-5 w-5" />
                  <span className="font-medium">Welcome back, {userProfile.name}!</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditProfile}
                  className="text-sm"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
            )}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {userProfile 
                ? `Personalized recipes for your ${userProfile.goal.replace('_', ' ')} goal`
                : 'Discover delicious, healthy recipes with complete nutritional information and simple instructions.'
              }
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl font-bold text-primary">{stats.breakfasts}</div>
              <div className="text-sm text-muted-foreground">Breakfasts</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl font-bold text-primary">{stats.lunches}</div>
              <div className="text-sm text-muted-foreground">Lunches</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl font-bold text-primary">{stats.dinners}</div>
              <div className="text-sm text-muted-foreground">Dinners</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl font-bold text-primary">{stats.snacks}</div>
              <div className="text-sm text-muted-foreground">Snacks</div>
            </div>
          </div>
          
          {/* Hydration Tracker */}
          <HydrationTracker className="max-w-md mx-auto" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-card rounded-lg border border-border/50">
            <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Nutritionally Balanced</h3>
            <p className="text-sm text-muted-foreground">
              Every recipe includes detailed nutritional information to help you make informed choices.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border border-border/50">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Dietary Friendly</h3>
            <p className="text-sm text-muted-foreground">
              Filter by dietary preferences including vegan, gluten-free, and high-protein options.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border border-border/50">
            <Utensils className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Quick & Easy</h3>
            <p className="text-sm text-muted-foreground">
              Most recipes can be prepared in under 30 minutes with simple, accessible ingredients.
            </p>
          </div>
        </div>
        
        {/* Recipe Filter */}
        <RecipeFilter
          categories={categories}
          dietaryTags={dietaryTags}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          onCategoryChange={setSelectedCategory}
          onTagToggle={handleTagToggle}
          onClearFilters={handleClearFilters}
        />
        
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {selectedCategory === 'all' ? 'All Recipes' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recipes`}
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </Badge>
        </div>
        
        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to find more recipes.
            </p>
            <button 
              onClick={handleClearFilters}
              className="text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
