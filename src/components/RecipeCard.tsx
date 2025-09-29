import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Users, Zap, Plus } from 'lucide-react';
import { Recipe } from '@/hooks/useRecipes';
import { getRecipeImageUrl, generateSingleRecipeImage } from '@/utils/recipeImageUtils';
import { AddToMealPlanModal } from '@/components/AddToMealPlanModal';
import { useState, useEffect, useRef } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onAddToMealPlan?: (recipe: Recipe, day: string, mealType: string) => void;
}

export const RecipeCard = ({ recipe, onClick, onAddToMealPlan }: RecipeCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(recipe.image || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Try to get image from storage on mount
  useEffect(() => {
    if (!recipe.image) {
      const storageUrl = getRecipeImageUrl(recipe.id);
      
      // Check if image exists by trying to load it
      const img = new Image();
      img.onload = () => setImageUrl(storageUrl);
      img.onerror = async () => {
        // Image doesn't exist, generate it
        if (!isGenerating) {
          setIsGenerating(true);
          const generatedUrl = await generateSingleRecipeImage(recipe);
          if (generatedUrl) {
            setImageUrl(generatedUrl);
          }
          setIsGenerating(false);
        }
      };
      img.src = storageUrl;
    }
  }, [recipe.id, recipe.image, isGenerating]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger onClick if it's not from the plus button or modal
    if (onClick && !e.defaultPrevented) {
      onClick();
    }
  };

  return (
    <>
      <Card 
        onClick={handleCardClick}
        className="group cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 bg-gradient-to-br from-card to-card/80 border-border/50"
      >
        <CardHeader className="p-0">
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center overflow-hidden relative">{imageUrl ? (
              <img 
                src={imageUrl} 
                alt={recipe.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => {
                  setImageUrl(null);
                }}
              />
            ) : (
              <div className="text-center p-4">
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-xs text-muted-foreground">Generating image...</p>
                  </>
                ) : (
                  <>
                    <Zap className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{recipe.imageDescription}</p>
                  </>
                )}
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="secondary" className="bg-background/90 text-foreground">
                {recipe.category}
              </Badge>
            </div>
            {onAddToMealPlan && (
              <div className="absolute bottom-2 right-2">
                <Popover open={showMealPlanModal} onOpenChange={setShowMealPlanModal}>
                  <PopoverTrigger asChild>
                    <Button
                      ref={buttonRef}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-background/90 hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <AddToMealPlanModal
                    recipe={recipe}
                    isOpen={showMealPlanModal}
                    onClose={() => setShowMealPlanModal(false)}
                    triggerRef={buttonRef}
                    onConfirm={(day, mealType) => {
                      if (onAddToMealPlan) {
                        onAddToMealPlan(recipe, day, mealType);
                      }
                    }}
                  />
                </Popover>
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
            <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded">
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
      </Card>
    </>
  );
};