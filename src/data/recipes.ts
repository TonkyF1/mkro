import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userProfile = { name: 'tony' }; // Replace with Supabase auth logic

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      const updatedRecipes = await Promise.all(
        data.map(async (recipe) => {
          if (!recipe.image_url) {
            const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-recipe-image', {
              body: {
                recipe_name: recipe.name,
                image_description: recipe.image_description || recipe.description,
                ingredients: recipe.ingredients || [],
              },
            });
            if (imageError) {
              console.error('Error generating image for', recipe.name, imageError);
              return recipe;
            }
            await supabase
              .from('recipes')
              .update({ image_url: imageData.image_url })
              .eq('id', recipe.id);
            return { ...recipe, image_url: imageData.image_url };
          }
          return recipe;
        })
      );

      setRecipes(updatedRecipes);
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {userProfile.name ? userProfile.name.charAt(0).toUpperCase() + userProfile.name.slice(1).toLowerCase() : 'Guest'}!
        </h1>
        <p className="text-muted-foreground">Ready to plan your nutritious meals?</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Recipes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt={recipe.name} className="w-full h-48 object-cover mb-4" />
                ) : (
                  <p>Generating image...</p>
                )}
                <p>{recipe.description}</p>
                <p><strong>Ingredients:</strong> {recipe.ingredients?.join(', ')}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
                <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
                <p><strong>Serving Size:</strong> {recipe.serving_size}</p>
                <p><strong>Calories:</strong> {recipe.calories} kcal</p>
                <p><strong>Protein:</strong> {recipe.protein}g</p>
                <p><strong>Carbs:</strong> {recipe.carbs}g</p>
                <p><strong>Fats:</strong> {recipe.fats}g</p>
                <p><strong>Dietary Tags:</strong> {recipe.dietary_tags?.join(', ')}</p>
                <p><strong>Substitution:</strong> {recipe.substitution}</p>
                <p><strong>Estimated Cost:</strong> £{recipe.estimated_cost.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;