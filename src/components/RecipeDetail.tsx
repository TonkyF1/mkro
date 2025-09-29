import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Zap, ArrowLeft, Lightbulb, ShoppingCart } from 'lucide-react';
import { Recipe } from '@/data/recipes';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onAddToShoppingList: (recipe: Recipe) => void;
}

export const RecipeDetail = ({ recipe, onBack, onAddToShoppingList }: RecipeDetailProps) => {
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
          
          <Button 
            onClick={() => onAddToShoppingList(recipe)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Shopping List
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recipe Image */}
          <div className="lg:w-1/2">
            <div className="h-64 lg:h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center overflow-hidden">
              {recipe.image ? (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">{recipe.imageDescription}</p>
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
            <p className="text-foreground leading-relaxed">
              {recipe.instructions}
            </p>
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