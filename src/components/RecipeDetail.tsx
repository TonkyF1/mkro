import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Zap, ArrowLeft, Lightbulb } from 'lucide-react';
import { Recipe } from '@/data/recipes';
import { getRecipeImageUrl, generateSingleRecipeImage } from '@/utils/recipeImageUtils';
import { useState, useEffect } from 'react';
import mealPlaceholder from '@/assets/meal-placeholder.png';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onAddToMealPlan?: (recipe: Recipe, day: string, mealType: string) => void;
}

export const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageChecked, setImageChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrGenerateImage = async () => {
      if (imageChecked) return;

      // Try loading from storage first
      const storageUrl = getRecipeImageUrl(recipe.id);
      
      try {
        // Check if image exists in storage
        const response = await fetch(storageUrl, { method: 'HEAD' });
        
        if (response.ok && !cancelled) {
          console.log(`[RecipeDetail] Image found in storage for: ${recipe.name}`);
          setImageUrl(storageUrl);
          setImageChecked(true);
          return;
        }
      } catch (error) {
        console.log(`[RecipeDetail] Storage check failed for: ${recipe.name}, will generate`);
      }

      // Image doesn't exist, generate it
      if (!cancelled && !isGenerating) {
        try {
          console.log(`[RecipeDetail] Generating image for: ${recipe.name}`);
          setIsGenerating(true);
          const generatedUrl = await generateSingleRecipeImage(recipe);
          
          if (!cancelled && generatedUrl) {
            console.log(`[RecipeDetail] Successfully generated image for: ${recipe.name}`);
            setImageUrl(generatedUrl);
          }
        } catch (error) {
          console.error(`[RecipeDetail] Image generation failed for ${recipe.name}:`, error);
        } finally {
          if (!cancelled) {
            setIsGenerating(false);
            setImageChecked(true);
          }
        }
      }
    };

    loadOrGenerateImage();

    return () => {
      cancelled = true;
    };
  }, [recipe.id, recipe.name, imageChecked, isGenerating]);
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="-ml-4 text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recipe Image */}
          <div className="lg:w-1/2">
            <div className="h-64 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.error(`[RecipeDetail] Image failed to load for: ${recipe.name}`);
                    setImageUrl(null);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" aria-label="Generating image" />
                      <span className="text-xs text-muted-foreground">Generating image...</span>
                    </div>
                  ) : (
                    <img 
                      src={mealPlaceholder} 
                      alt={`${recipe.name} placeholder`} 
                      className="w-full h-full object-cover opacity-70" 
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Recipe Info */}
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{recipe.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {recipe.name}
            </h1>
            
            <p className="text-muted-foreground text-lg mb-4">
              {recipe.description}
            </p>
            
            {/* Recipe Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-medium">{recipe.prepTime}</div>
                <div className="text-xs text-muted-foreground">Prep Time</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-medium">{recipe.servingSize}</div>
                <div className="text-xs text-muted-foreground">Serves</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-medium">{recipe.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
            </div>
            
            {/* Dietary Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-primary/30 text-primary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.instructions.split('\n').map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">{instruction.trim().charAt(0)}</span>
                  <span className="text-foreground leading-relaxed">{instruction.trim().substring(1).trim()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Nutrition Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Nutrition Facts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-secondary rounded">
                <span className="font-medium">Calories</span>
                <span className="font-bold text-primary">{recipe.calories}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded">
                <span className="font-medium">Protein</span>
                <span className="font-bold text-primary">{recipe.protein}g</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded">
                <span className="font-medium">Carbohydrates</span>
                <span className="font-bold text-primary">{recipe.carbs}g</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary rounded">
                <span className="font-medium">Fats</span>
                <span className="font-bold text-primary">{recipe.fats}g</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Substitution Tip */}
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              Substitution Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{recipe.substitution}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};