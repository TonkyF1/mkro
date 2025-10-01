import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Zap, Plus } from 'lucide-react';
import { Recipe } from '@/hooks/useRecipes';
import { getRecipeImageUrl, generateSingleRecipeImage } from '@/utils/recipeImageUtils';
import { AddToMealPlanModal } from '@/components/AddToMealPlanModal';
import { useState, useEffect } from 'react';
import placeholder from '@/assets/meal-placeholder.png';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onAddToMealPlan?: (recipe: Recipe, day: string, mealType: string) => void;
}

export const RecipeCard = ({ recipe, onClick, onAddToMealPlan }: RecipeCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);

  // Try to load from storage first; if missing, generate (rate-limited)
  useEffect(() => {
    let cancelled = false;

    const attemptLoadOrGenerate = async () => {
      const storageUrl = getRecipeImageUrl(recipe.id);
      const probe = new Image();
      probe.onload = () => {
        if (!cancelled) setImageUrl(storageUrl);
      };
      probe.onerror = async () => {
        if (!cancelled && !isGenerating) {
          try {
            console.log('[RecipeCard] Generating OpenAI image for:', recipe.name);
            setIsGenerating(true);
            const generatedUrl = await generateSingleRecipeImage(recipe);
            if (!cancelled && generatedUrl) {
              setImageUrl(generatedUrl);
            }
          } catch (e) {
            console.error('[RecipeCard] Image generation failed:', e);
          } finally {
            if (!cancelled) setIsGenerating(false);
          }
        }
      };
      probe.src = storageUrl;
    };

    attemptLoadOrGenerate();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.id]);

  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-border/50"
    >
      <CardHeader className="p-0">
        <div className="h-40 md:h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center overflow-hidden relative">{imageUrl ? (
            <img 
              src={imageUrl} 
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => {
                setImageUrl(null);
              }}
            />
          ) : (
            <div className="w-full h-full relative">
              <img src={placeholder} alt={`${recipe.name} placeholder`} className="w-full h-full object-cover" />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          )}
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
      
      <CardContent className="p-3 md:p-4">
        <h3 className="font-bold text-sm md:text-lg text-foreground mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {recipe.name}
        </h3>
        
        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-1 md:line-clamp-2">
          {recipe.description}
        </p>
        
        {/* Recipe Stats */}
        <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="hidden md:inline">{recipe.prepTime}</span>
            <span className="md:hidden">{recipe.prepTime.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{recipe.calories}</span>
          </div>
        </div>
        
        {/* Nutrition - Mobile compact */}
        <div className="flex gap-1 md:gap-3 text-[10px] md:text-xs mb-2 md:mb-3">
          <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-primary/10 text-primary rounded">
            {recipe.protein}g
          </span>
          <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-accent/10 text-accent-foreground rounded">
            {recipe.carbs}g
          </span>
        </div>
        
        {/* Dietary Tags - Show less on mobile */}
        <div className="flex flex-wrap gap-1">
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-[10px] md:text-xs border-primary/30 text-primary px-1.5 md:px-2 py-0 md:py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {recipe.dietaryTags.length > 2 && (
            <Badge variant="outline" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0 md:py-0.5">
              +{recipe.dietaryTags.length - 2}
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