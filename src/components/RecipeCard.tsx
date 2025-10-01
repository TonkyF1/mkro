import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Zap, Plus } from 'lucide-react';
import { Recipe } from '@/hooks/useRecipes';
import { getRecipeImageUrl, generateSingleRecipeImage } from '@/utils/recipeImageUtils';
import { AddToMealPlanModal } from '@/components/AddToMealPlanModal';
import { useState, useEffect } from 'react';
import mealPlaceholder from '@/assets/meal-placeholder.png';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onAddToMealPlan?: (recipe: Recipe, day: string, mealType: string) => void;
}

export const RecipeCard = ({ recipe, onClick, onAddToMealPlan }: RecipeCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageChecked, setImageChecked] = useState(false);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrGenerateImage = async () => {
      if (imageChecked) return;

      // Try loading from storage first
      const storageUrl = getRecipeImageUrl(recipe.id);
      
      try {
        // Check if image exists in storage with a fetch request
        const response = await fetch(storageUrl, { method: 'HEAD' });
        
        if (response.ok && !cancelled) {
          // Image exists in storage
          console.log(`[RecipeCard] Image found in storage for: ${recipe.name}`);
          setImageUrl(storageUrl);
          setImageChecked(true);
          return;
        }
      } catch (error) {
        console.log(`[RecipeCard] Storage check failed for: ${recipe.name}, will generate`);
      }

      // Image doesn't exist, generate it
      if (!cancelled && !isGenerating) {
        try {
          console.log(`[RecipeCard] Generating OpenAI image for: ${recipe.name}`);
          setIsGenerating(true);
          const generatedUrl = await generateSingleRecipeImage(recipe);
          
          if (!cancelled && generatedUrl) {
            console.log(`[RecipeCard] Successfully generated image for: ${recipe.name}`);
            setImageUrl(generatedUrl);
          } else {
            console.log(`[RecipeCard] Generation returned null for: ${recipe.name}`);
          }
        } catch (error) {
          console.error(`[RecipeCard] Image generation failed for ${recipe.name}:`, error);
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
    <Card 
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-border/50"
    >
      <CardHeader className="p-0">
        <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center overflow-hidden relative">{imageUrl ? (
            <img 
              src={imageUrl} 
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => {
                console.error(`[RecipeCard] Image failed to load for: ${recipe.name}`);
                setImageUrl(null);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" aria-label="Generating image" />
                  <span className="text-xs text-muted-foreground">Generating...</span>
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
          {/* Removed text overlays and category badge to ensure images contain no text */}
          {onAddToMealPlan && (
            <div className="absolute bottom-2 right-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMealPlanModal(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        {/* Recipe Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.servingSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{recipe.calories} cal</span>
          </div>
        </div>
        
        {/* Nutrition */}
        <div className="flex gap-3 text-xs mb-3">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">
            {recipe.protein}g protein
          </span>
          <span className="px-2 py-1 bg-accent/10 text-foreground rounded">
            {recipe.carbs}g carbs
          </span>
        </div>
        
        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.dietaryTags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs border-primary/30 text-primary"
            >
              {tag}
            </Badge>
          ))}
          {recipe.dietaryTags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.dietaryTags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <AddToMealPlanModal
        recipe={recipe}
        isOpen={showMealPlanModal}
        onClose={() => setShowMealPlanModal(false)}
        onConfirm={(day, mealType) => {
          if (onAddToMealPlan) {
            onAddToMealPlan(recipe, day, mealType);
          }
        }}
      />
    </Card>
  );
};