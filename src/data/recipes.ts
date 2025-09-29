import avocadoToastImage from '@/assets/avocado-toast.jpg';
import berrySmoothieBowlImage from '@/assets/berry-smoothie-bowl.jpg';
import buddhaBowlImage from '@/assets/buddha-bowl.jpg';
import energyBallsImage from '@/assets/energy-balls.jpg';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prepTime: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  dietaryTags: string[];
  substitution: string;
  imageDescription: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  estimatedCost: number;
  image?: string;
}

export const recipes: Recipe[] = [
  // BREAKFASTS
  {
    id: 'zesty-avocado-toast',
    name: 'Zesty Avocado Toast',
    description: 'A vibrant and nutritious start to your day with creamy avocado on crispy whole-grain bread.',
    ingredients: [
      '2 slices whole-grain bread',
      '1 ripe avocado',
      '1 poached egg',
      '1/4 tsp chili flakes',
      '1 tbsp lemon juice',
      'Salt and pepper to taste',
      'Microgreens for garnish'
    ],
    instructions: 'Toast bread until golden. Mash avocado with lemon juice, salt, and pepper. Spread on toast, top with poached egg, sprinkle chili flakes and microgreens.',
    prepTime: '10 minutes',
    servingSize: '1 serving',
    calories: 320,
    protein: 12,
    carbs: 28,
    fats: 18,
    dietaryTags: ['vegetarian', 'high-protein'],
    substitution: 'Replace egg with hemp seeds for vegan option',
    imageDescription: 'A bright image of avocado toast on whole-grain bread with a poached egg, garnished with chili flakes and microgreens, on a rustic wooden table with soft natural light',
    category: 'breakfast',
    estimatedCost: 3.25,
    image: avocadoToastImage
  },
  {
    id: 'berry-protein-smoothie',
    name: 'Berry Protein Smoothie Bowl',
    description: 'A thick, creamy smoothie bowl packed with antioxidants and protein for sustained energy.',
    ingredients: [
      '1 cup frozen mixed berries',
      '1/2 banana',
      '1 scoop vanilla protein powder',
      '1/2 cup Greek yogurt',
      '1/4 cup oats',
      '1 tbsp chia seeds',
      '1/2 cup almond milk'
    ],
    instructions: 'Blend all ingredients until thick and creamy. Pour into bowl and top with fresh berries, granola, and chia seeds.',
    prepTime: '5 minutes',
    servingSize: '1 serving',
    calories: 380,
    protein: 28,
    carbs: 42,
    fats: 8,
    dietaryTags: ['high-protein', 'gluten-free'],
    substitution: 'Use coconut yogurt for dairy-free version',
    imageDescription: 'A colorful smoothie bowl with purple-pink smoothie base topped with fresh berries, granola, and chia seeds, photographed from above on a marble surface',
    category: 'breakfast',
    estimatedCost: 4.15,
    image: berrySmoothieBowlImage
  },
  {
    id: 'golden-turmeric-oats',
    name: 'Golden Turmeric Overnight Oats',
    description: 'Anti-inflammatory overnight oats with warming spices and tropical flavors.',
    ingredients: [
      '1/2 cup rolled oats',
      '1/2 cup coconut milk',
      '1 tbsp chia seeds',
      '1/2 tsp turmeric',
      '1/4 tsp cinnamon',
      '1 tbsp maple syrup',
      '1/4 cup diced mango',
      '2 tbsp coconut flakes'
    ],
    instructions: 'Mix oats, coconut milk, chia seeds, spices, and maple syrup. Refrigerate overnight. Top with mango and coconut before serving.',
    prepTime: '5 minutes (overnight prep)',
    servingSize: '1 serving',
    calories: 310,
    protein: 8,
    carbs: 45,
    fats: 12,
    dietaryTags: ['vegan', 'gluten-free', 'anti-inflammatory'],
    substitution: 'Replace mango with banana for lower sugar',
    imageDescription: 'Golden-yellow overnight oats in a glass jar topped with fresh mango cubes and toasted coconut flakes, with a wooden spoon beside it',
    category: 'breakfast',
    estimatedCost: 2.85
  },
  {
    id: 'mediterranean-egg-scramble',
    name: 'Mediterranean Veggie Scramble',
    description: 'Fluffy eggs with Mediterranean vegetables and herbs for a protein-rich start.',
    ingredients: [
      '3 large eggs',
      '1/4 cup cherry tomatoes, halved',
      '1/4 cup spinach',
      '2 tbsp feta cheese',
      '1 tbsp olive oil',
      '1/4 red onion, diced',
      '2 tbsp fresh herbs (basil, oregano)',
      'Salt and pepper to taste'
    ],
    instructions: 'Heat oil in pan, sauté onion until soft. Add tomatoes and spinach, cook until wilted. Scramble eggs, fold in vegetables and feta. Garnish with herbs.',
    prepTime: '12 minutes',
    servingSize: '1 serving',
    calories: 285,
    protein: 20,
    carbs: 8,
    fats: 18,
    dietaryTags: ['vegetarian', 'high-protein', 'low-carb'],
    substitution: 'Use nutritional yeast instead of feta for vegan option',
    imageDescription: 'A rustic pan filled with colorful scrambled eggs mixed with cherry tomatoes, spinach, and crumbled feta, garnished with fresh herbs',
    category: 'breakfast',
    estimatedCost: 3.50
  },
  {
    id: 'banana-walnut-pancakes',
    name: 'Fluffy Banana Walnut Pancakes',
    description: 'Light, fluffy pancakes with natural sweetness from bananas and crunch from walnuts.',
    ingredients: [
      '1 cup whole wheat flour',
      '1 ripe banana, mashed',
      '1 egg',
      '1 cup milk',
      '1/4 cup chopped walnuts',
      '1 tbsp maple syrup',
      '1 tsp baking powder',
      '1/2 tsp vanilla extract'
    ],
    instructions: 'Mix dry ingredients. Whisk wet ingredients separately, then combine. Fold in banana and walnuts. Cook pancakes in batches until golden.',
    prepTime: '15 minutes',
    servingSize: '2 servings',
    calories: 340,
    protein: 12,
    carbs: 52,
    fats: 14,
    dietaryTags: ['vegetarian'],
    substitution: 'Use almond milk and flax egg for vegan version',
    imageDescription: 'A stack of golden-brown pancakes with sliced bananas and chopped walnuts on top, drizzled with maple syrup, on a white plate with morning light',
    category: 'breakfast',
    estimatedCost: 2.95
  },

  // LUNCHES
  {
    id: 'asian-buddha-bowl',
    name: 'Asian-Inspired Buddha Bowl',
    description: 'A colorful, nutrient-dense bowl with Asian flavors and plant-based proteins.',
    ingredients: [
      '1/2 cup quinoa, cooked',
      '1/2 cup edamame',
      '1/2 cup shredded purple cabbage',
      '1/2 cucumber, sliced',
      '1/2 avocado, sliced',
      '2 tbsp tahini',
      '1 tbsp rice vinegar',
      '1 tsp sesame oil',
      '1 tbsp sesame seeds'
    ],
    instructions: 'Arrange quinoa as base, top with vegetables. Whisk tahini, vinegar, and sesame oil for dressing. Drizzle over bowl and sprinkle with sesame seeds.',
    prepTime: '15 minutes',
    servingSize: '1 serving',
    calories: 420,
    protein: 16,
    carbs: 38,
    fats: 22,
    dietaryTags: ['vegan', 'gluten-free', 'high-fiber'],
    substitution: 'Replace quinoa with brown rice for different texture',
    imageDescription: 'A vibrant Buddha bowl with colorful vegetables arranged over quinoa, with creamy tahini dressing drizzled on top and sesame seeds scattered around',
    category: 'lunch',
    estimatedCost: 4.75,
    image: buddhaBowlImage
  },
  {
    id: 'tuscan-white-bean-salad',
    name: 'Tuscan White Bean Salad',
    description: 'A hearty Mediterranean salad with white beans, fresh herbs, and tangy vinaigrette.',
    ingredients: [
      '1 can cannellini beans, drained',
      '2 cups arugula',
      '1/2 cup cherry tomatoes, halved',
      '1/4 red onion, thinly sliced',
      '2 tbsp olive oil',
      '1 tbsp balsamic vinegar',
      '1/4 cup fresh basil',
      '2 tbsp pine nuts'
    ],
    instructions: 'Combine beans, arugula, tomatoes, and onion. Whisk olive oil and vinegar. Toss salad with dressing, top with basil and pine nuts.',
    prepTime: '10 minutes',
    servingSize: '1 serving',
    calories: 360,
    protein: 15,
    carbs: 32,
    fats: 18,
    dietaryTags: ['vegan', 'high-protein', 'mediterranean'],
    substitution: 'Use chickpeas instead of white beans for variety',
    imageDescription: 'A rustic bowl of white beans mixed with fresh arugula, cherry tomatoes, and herbs, with golden olive oil glistening in natural sunlight',
    category: 'lunch',
    estimatedCost: 3.90
  },
  {
    id: 'thai-chicken-lettuce-wraps',
    name: 'Thai-Style Chicken Lettuce Wraps',
    description: 'Light and fresh lettuce wraps with seasoned chicken and vibrant Thai flavors.',
    ingredients: [
      '4 oz ground chicken',
      '1 head butter lettuce',
      '1/4 cup diced bell pepper',
      '2 tbsp soy sauce',
      '1 tbsp lime juice',
      '1 tsp sriracha',
      '1/4 cup cilantro',
      '2 tbsp crushed peanuts'
    ],
    instructions: 'Cook chicken with bell pepper until done. Mix soy sauce, lime juice, and sriracha. Toss chicken with sauce, serve in lettuce cups with cilantro and peanuts.',
    prepTime: '12 minutes',
    servingSize: '1 serving',
    calories: 290,
    protein: 24,
    carbs: 12,
    fats: 15,
    dietaryTags: ['high-protein', 'low-carb', 'dairy-free'],
    substitution: 'Use crumbled tofu for vegetarian version',
    imageDescription: 'Fresh butter lettuce cups filled with seasoned ground chicken, topped with cilantro and crushed peanuts, arranged on a bamboo plate',
    category: 'lunch',
    estimatedCost: 4.25
  },
  {
    id: 'quinoa-stuffed-peppers',
    name: 'Mediterranean Quinoa Stuffed Peppers',
    description: 'Colorful bell peppers stuffed with protein-rich quinoa and Mediterranean vegetables.',
    ingredients: [
      '2 bell peppers, tops removed',
      '1/2 cup quinoa, cooked',
      '1/4 cup diced zucchini',
      '1/4 cup sun-dried tomatoes',
      '2 tbsp feta cheese',
      '1 tbsp olive oil',
      '1/4 cup fresh herbs',
      'Salt and pepper to taste'
    ],
    instructions: 'Sauté zucchini until tender. Mix quinoa with vegetables, herbs, and feta. Stuff peppers, bake at 375°F for 25 minutes until peppers are tender.',
    prepTime: '30 minutes',
    servingSize: '2 servings',
    calories: 280,
    protein: 10,
    carbs: 42,
    fats: 8,
    dietaryTags: ['vegetarian', 'gluten-free'],
    substitution: 'Use nutritional yeast instead of feta for vegan option',
    imageDescription: 'Two colorful bell peppers stuffed with quinoa mixture, baked until tender, garnished with fresh herbs on a ceramic baking dish',
    category: 'lunch',
    estimatedCost: 3.60
  },
  {
    id: 'moroccan-lentil-soup',
    name: 'Moroccan-Spiced Lentil Soup',
    description: 'A warming, aromatic soup with red lentils and traditional Moroccan spices.',
    ingredients: [
      '1/2 cup red lentils',
      '1 1/2 cups vegetable broth',
      '1/4 onion, diced',
      '1 carrot, diced',
      '1/2 tsp cumin',
      '1/2 tsp cinnamon',
      '1/4 tsp ginger',
      '1 tbsp olive oil'
    ],
    instructions: 'Sauté onion and carrot in oil. Add spices, cook 1 minute. Add lentils and broth, simmer 20 minutes until lentils are tender. Season to taste.',
    prepTime: '25 minutes',
    servingSize: '1 serving',
    calories: 250,
    protein: 12,
    carbs: 35,
    fats: 7,
    dietaryTags: ['vegan', 'high-protein', 'gluten-free'],
    substitution: 'Add diced sweet potato for extra sweetness',
    imageDescription: 'A warming bowl of orange-red lentil soup with aromatic spices, garnished with fresh herbs, served with rustic bread on the side',
    category: 'lunch',
    estimatedCost: 2.40
  },

  // DINNERS
  {
    id: 'herb-crusted-salmon',
    name: 'Herb-Crusted Salmon with Roasted Vegetables',
    description: 'Flaky salmon with a fresh herb crust served alongside colorful roasted vegetables.',
    ingredients: [
      '4 oz salmon fillet',
      '1 cup mixed vegetables (broccoli, carrots, zucchini)',
      '2 tbsp fresh herbs (dill, parsley)',
      '1 tbsp olive oil',
      '1 lemon, juiced',
      '1 clove garlic, minced',
      'Salt and pepper to taste'
    ],
    instructions: 'Mix herbs with garlic and half the olive oil. Coat salmon, bake at 400°F for 12-15 minutes. Toss vegetables with remaining oil, roast alongside salmon.',
    prepTime: '20 minutes',
    servingSize: '1 serving',
    calories: 380,
    protein: 28,
    carbs: 18,
    fats: 20,
    dietaryTags: ['high-protein', 'omega-3-rich', 'gluten-free'],
    substitution: 'Use cod or halibut for different fish option',
    imageDescription: 'A perfectly cooked salmon fillet with golden herb crust alongside colorful roasted vegetables, plated elegantly with lemon wedges',
    category: 'dinner',
    estimatedCost: 6.75
  },
  {
    id: 'chickpea-curry',
    name: 'Creamy Coconut Chickpea Curry',
    description: 'A rich and flavorful curry with tender chickpeas in aromatic coconut sauce.',
    ingredients: [
      '1 can chickpeas, drained',
      '1/2 can coconut milk',
      '1/4 onion, diced',
      '2 cloves garlic, minced',
      '1 tsp curry powder',
      '1/2 tsp turmeric',
      '1/2 cup spinach',
      '1 tbsp coconut oil'
    ],
    instructions: 'Sauté onion and garlic in oil. Add spices, cook 1 minute. Add chickpeas and coconut milk, simmer 15 minutes. Stir in spinach until wilted.',
    prepTime: '20 minutes',
    servingSize: '1 serving',
    calories: 420,
    protein: 16,
    carbs: 45,
    fats: 22,
    dietaryTags: ['vegan', 'high-protein', 'gluten-free'],
    substitution: 'Add diced sweet potato for extra vegetables',
    imageDescription: 'A creamy golden curry with chickpeas and spinach in a rustic bowl, garnished with fresh cilantro and served with basmati rice',
    category: 'dinner',
    estimatedCost: 3.25
  },
  {
    id: 'zucchini-noodle-carbonara',
    name: 'Zucchini Noodle Carbonara',
    description: 'A lighter take on classic carbonara using spiralized zucchini noodles.',
    ingredients: [
      '2 medium zucchini, spiralized',
      '2 eggs',
      '1/4 cup parmesan cheese',
      '2 strips turkey bacon, diced',
      '2 cloves garlic, minced',
      '1 tbsp olive oil',
      'Black pepper to taste'
    ],
    instructions: 'Cook bacon until crispy. Sauté garlic, add zucchini noodles. Whisk eggs with cheese, toss with hot noodles off heat. Add bacon, season with pepper.',
    prepTime: '15 minutes',
    servingSize: '1 serving',
    calories: 320,
    protein: 22,
    carbs: 12,
    fats: 22,
    dietaryTags: ['low-carb', 'high-protein', 'keto-friendly'],
    substitution: 'Use mushrooms instead of bacon for vegetarian version',
    imageDescription: 'Spiralized zucchini noodles tossed with creamy egg sauce and crispy bacon bits, topped with grated parmesan and black pepper',
    category: 'dinner',
    estimatedCost: 4.90
  },
  {
    id: 'stuffed-portobello-mushrooms',
    name: 'Stuffed Portobello Mushrooms',
    description: 'Meaty portobello caps stuffed with quinoa, vegetables, and melted cheese.',
    ingredients: [
      '2 large portobello mushroom caps',
      '1/2 cup cooked quinoa',
      '1/4 cup diced bell pepper',
      '1/4 cup cherry tomatoes, halved',
      '1/4 cup mozzarella cheese',
      '2 tbsp balsamic vinegar',
      '1 tbsp olive oil',
      'Fresh basil for garnish'
    ],
    instructions: 'Remove mushroom stems, brush with oil and vinegar. Mix quinoa with vegetables, stuff mushrooms. Top with cheese, bake at 375°F for 20 minutes.',
    prepTime: '25 minutes',
    servingSize: '1 serving',
    calories: 280,
    protein: 14,
    carbs: 28,
    fats: 14,
    dietaryTags: ['vegetarian', 'gluten-free'],
    substitution: 'Use vegan cheese for dairy-free option',
    imageDescription: 'Two large portobello mushroom caps stuffed with colorful quinoa mixture and melted cheese, garnished with fresh basil leaves',
    category: 'dinner',
    estimatedCost: 4.15
  },
  {
    id: 'teriyaki-tofu-stir-fry',
    name: 'Teriyaki Tofu Vegetable Stir-Fry',
    description: 'Crispy tofu and fresh vegetables in a sweet and savory teriyaki glaze.',
    ingredients: [
      '4 oz firm tofu, cubed',
      '1 cup mixed stir-fry vegetables',
      '2 tbsp teriyaki sauce',
      '1 tbsp sesame oil',
      '1 clove garlic, minced',
      '1 tsp fresh ginger, grated',
      '1 tbsp sesame seeds',
      '2 green onions, sliced'
    ],
    instructions: 'Press and cube tofu, pan-fry until golden. Set aside. Stir-fry vegetables with garlic and ginger. Add tofu back, toss with teriyaki sauce. Garnish with sesame seeds and green onions.',
    prepTime: '18 minutes',
    servingSize: '1 serving',
    calories: 310,
    protein: 18,
    carbs: 22,
    fats: 18,
    dietaryTags: ['vegan', 'high-protein'],
    substitution: 'Use chicken instead of tofu for non-vegetarian option',
    imageDescription: 'Colorful stir-fried vegetables and golden crispy tofu cubes glazed with teriyaki sauce, garnished with sesame seeds and green onions',
    category: 'dinner',
    estimatedCost: 3.85
  },

  // SNACKS
  {
    id: 'energy-balls',
    name: 'Chocolate Peanut Butter Energy Balls',
    description: 'No-bake energy balls packed with protein and natural sweetness.',
    ingredients: [
      '1/2 cup rolled oats',
      '2 tbsp peanut butter',
      '1 tbsp chia seeds',
      '1 tbsp cocoa powder',
      '1 tbsp honey',
      '1/4 cup dark chocolate chips',
      '1 tbsp coconut flakes'
    ],
    instructions: 'Mix all ingredients in a bowl. Chill for 30 minutes. Roll into 8-10 balls. Store in refrigerator for up to one week.',
    prepTime: '10 minutes (plus chilling)',
    servingSize: '4-5 balls',
    calories: 180,
    protein: 6,
    carbs: 22,
    fats: 9,
    dietaryTags: ['vegetarian', 'no-bake'],
    substitution: 'Use almond butter for different nutty flavor',
    imageDescription: 'Round chocolate-colored energy balls covered in coconut flakes and chia seeds, arranged on a marble surface with scattered oats',
    category: 'snack',
    estimatedCost: 2.20,
    image: energyBallsImage
  },
  {
    id: 'greek-yogurt-parfait',
    name: 'Tropical Greek Yogurt Parfait',
    description: 'Layers of creamy yogurt with tropical fruits and crunchy granola.',
    ingredients: [
      '1/2 cup Greek yogurt',
      '1/4 cup granola',
      '1/4 cup diced mango',
      '1/4 cup diced pineapple',
      '1 tbsp shredded coconut',
      '1 tbsp honey',
      '1 tbsp chopped macadamia nuts'
    ],
    instructions: 'Layer yogurt, fruits, and granola in a glass or bowl. Drizzle with honey, top with coconut and nuts.',
    prepTime: '5 minutes',
    servingSize: '1 serving',
    calories: 260,
    protein: 12,
    carbs: 32,
    fats: 10,
    dietaryTags: ['vegetarian', 'high-protein'],
    substitution: 'Use coconut yogurt for dairy-free version',
    imageDescription: 'A clear glass filled with layers of white yogurt, colorful tropical fruits, and golden granola, topped with coconut flakes',
    category: 'snack',
    estimatedCost: 3.45
  },
  {
    id: 'hummus-veggie-wrap',
    name: 'Mediterranean Hummus Veggie Wrap',
    description: 'A fresh wrap filled with creamy hummus and crisp Mediterranean vegetables.',
    ingredients: [
      '1 whole wheat tortilla',
      '3 tbsp hummus',
      '1/4 cucumber, sliced',
      '1/4 cup shredded carrots',
      '2 tbsp red bell pepper strips',
      '2 tbsp sprouts',
      '1 tbsp olives, sliced',
      '1 tbsp feta cheese'
    ],
    instructions: 'Spread hummus on tortilla. Layer vegetables and feta. Roll tightly, slice in half to serve.',
    prepTime: '5 minutes',
    servingSize: '1 wrap',
    calories: 220,
    protein: 8,
    carbs: 32,
    fats: 8,
    dietaryTags: ['vegetarian', 'high-fiber'],
    substitution: 'Omit feta for vegan option',
    imageDescription: 'A colorful wrap cut in half showing layers of hummus, fresh vegetables, and cheese, with vegetables scattered around',
    category: 'snack',
    estimatedCost: 2.75
  },
  {
    id: 'apple-cinnamon-chips',
    name: 'Baked Apple Cinnamon Chips',
    description: 'Crispy, naturally sweet apple chips with warming cinnamon spice.',
    ingredients: [
      '2 apples, thinly sliced',
      '1 tsp cinnamon',
      '1 tbsp lemon juice',
      'Pinch of sea salt'
    ],
    instructions: 'Toss apple slices with lemon juice and cinnamon. Arrange on baking sheet, bake at 200°F for 2-3 hours until crispy.',
    prepTime: '10 minutes (plus baking)',
    servingSize: '1 serving',
    calories: 95,
    protein: 0,
    carbs: 25,
    fats: 0,
    dietaryTags: ['vegan', 'gluten-free', 'fat-free'],
    substitution: 'Try with pears for different flavor',
    imageDescription: 'Golden-brown apple chips arranged on parchment paper, dusted with cinnamon, with fresh apple slices in the background',
    category: 'snack',
    estimatedCost: 1.50
  },
  {
    id: 'spiced-chickpea-crunch',
    name: 'Spiced Roasted Chickpea Crunch',
    description: 'Crunchy roasted chickpeas with bold spices for a satisfying protein snack.',
    ingredients: [
      '1 can chickpeas, drained and dried',
      '1 tbsp olive oil',
      '1/2 tsp paprika',
      '1/2 tsp cumin',
      '1/4 tsp garlic powder',
      '1/4 tsp cayenne pepper',
      'Salt to taste'
    ],
    instructions: 'Pat chickpeas dry. Toss with oil and spices. Roast at 400°F for 20-25 minutes until crispy, shaking pan halfway through.',
    prepTime: '5 minutes (plus roasting)',
    servingSize: '1/2 cup',
    calories: 140,
    protein: 6,
    carbs: 18,
    fats: 4,
    dietaryTags: ['vegan', 'high-protein', 'gluten-free'],
    substitution: 'Try different spice blends like curry or Italian herbs',
    imageDescription: 'Golden-brown roasted chickpeas scattered on a baking sheet, with colorful spices visible on their crispy surfaces',
    category: 'snack',
    estimatedCost: 1.85
  },

  // ADDITIONAL CHICKEN DISHES
  {
    id: 'honey-garlic-chicken-bowl',
    name: 'Honey Garlic Chicken Power Bowl',
    description: 'Tender chicken breast with honey garlic glaze over quinoa and roasted vegetables.',
    ingredients: [
      '5 oz chicken breast, cubed',
      '1/2 cup cooked quinoa',
      '1/2 cup broccoli florets',
      '1/4 cup bell peppers, diced',
      '2 tbsp honey',
      '2 cloves garlic, minced',
      '2 tbsp soy sauce',
      '1 tbsp olive oil',
      '1 tbsp sesame seeds'
    ],
    instructions: 'Season and cook chicken until golden. Mix honey, garlic, and soy sauce. Roast vegetables until tender. Serve chicken over quinoa and vegetables, drizzle with honey garlic sauce and sprinkle with sesame seeds.',
    prepTime: '22 minutes',
    servingSize: '1 serving',
    calories: 420,
    protein: 32,
    carbs: 38,
    fats: 14,
    dietaryTags: ['high-protein', 'gluten-free'],
    substitution: 'Use maple syrup instead of honey for vegan option with tofu',
    imageDescription: 'Golden glazed chicken cubes served over fluffy quinoa with colorful roasted vegetables, drizzled with honey garlic sauce and garnished with sesame seeds',
    category: 'lunch',
    estimatedCost: 5.25
  },
  {
    id: 'mediterranean-chicken-salad',
    name: 'Mediterranean Grilled Chicken Salad',
    description: 'Herb-marinated grilled chicken over fresh greens with Mediterranean flavors.',
    ingredients: [
      '4 oz chicken breast',
      '2 cups mixed greens',
      '1/4 cup cherry tomatoes, halved',
      '1/4 cucumber, diced',
      '2 tbsp kalamata olives',
      '2 tbsp feta cheese',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      '1 tsp oregano',
      '1 tsp garlic powder'
    ],
    instructions: 'Marinate chicken in half the olive oil, lemon juice, oregano, and garlic for 15 minutes. Grill until cooked through. Slice and serve over mixed greens with tomatoes, cucumber, olives, and feta. Drizzle with remaining olive oil and lemon.',
    prepTime: '25 minutes',
    servingSize: '1 serving',
    calories: 350,
    protein: 28,
    carbs: 12,
    fats: 22,
    dietaryTags: ['high-protein', 'low-carb', 'mediterranean'],
    substitution: 'Use grilled halloumi instead of chicken for vegetarian version',
    imageDescription: 'Perfectly grilled chicken slices over fresh mixed greens with cherry tomatoes, cucumber, olives, and crumbled feta cheese',
    category: 'lunch',
    estimatedCost: 4.85
  },
  {
    id: 'chicken-sweet-potato-curry',
    name: 'Coconut Chicken & Sweet Potato Curry',
    description: 'Creamy coconut curry with tender chicken and sweet potato chunks.',
    ingredients: [
      '5 oz chicken thigh, cubed',
      '1 medium sweet potato, cubed',
      '1/2 can coconut milk',
      '1/4 onion, diced',
      '2 cloves garlic, minced',
      '1 tbsp curry paste',
      '1 tbsp coconut oil',
      '1/2 cup spinach',
      '1 tbsp lime juice',
      'Fresh cilantro for garnish'
    ],
    instructions: 'Heat oil, cook chicken until browned. Remove chicken, sauté onion and garlic. Add curry paste, cook 1 minute. Add sweet potato and coconut milk, simmer until tender. Return chicken, add spinach until wilted. Finish with lime juice and cilantro.',
    prepTime: '28 minutes',
    servingSize: '1 serving',
    calories: 480,
    protein: 30,
    carbs: 32,
    fats: 26,
    dietaryTags: ['high-protein', 'dairy-free', 'gluten-free'],
    substitution: 'Use chickpeas instead of chicken for vegan version',
    imageDescription: 'Rich golden curry with tender chicken pieces and sweet potato cubes in creamy coconut sauce, garnished with fresh cilantro',
    category: 'dinner',
    estimatedCost: 5.75
  },
  {
    id: 'buffalo-chicken-cauliflower-rice',
    name: 'Buffalo Chicken Cauliflower Rice Bowl',
    description: 'Spicy buffalo chicken served over low-carb cauliflower rice with cooling ranch.',
    ingredients: [
      '4 oz chicken breast, diced',
      '2 cups cauliflower rice',
      '2 tbsp buffalo sauce',
      '1 tbsp olive oil',
      '2 tbsp Greek yogurt',
      '1 tsp ranch seasoning',
      '1/4 cup celery, diced',
      '2 tbsp blue cheese crumbles',
      'Green onions for garnish'
    ],
    instructions: 'Cook chicken in oil until done, toss with buffalo sauce. Sauté cauliflower rice until tender. Mix yogurt with ranch seasoning. Serve buffalo chicken over cauliflower rice, top with celery, blue cheese, and ranch. Garnish with green onions.',
    prepTime: '15 minutes',
    servingSize: '1 serving',
    calories: 290,
    protein: 26,
    carbs: 14,
    fats: 16,
    dietaryTags: ['high-protein', 'low-carb', 'keto-friendly'],
    substitution: 'Use vegan ranch and omit blue cheese for dairy-free',
    imageDescription: 'Spicy buffalo chicken pieces over fluffy cauliflower rice, topped with diced celery, blue cheese crumbles, and creamy ranch drizzle',
    category: 'dinner',
    estimatedCost: 4.50
  },

  // STEAK DISHES
  {
    id: 'steak-fajita-bowl',
    name: 'Sizzling Steak Fajita Bowl',
    description: 'Seasoned strips of steak with colorful peppers and onions over cilantro lime rice.',
    ingredients: [
      '4 oz sirloin steak, sliced',
      '1/2 cup cooked brown rice',
      '1/2 bell pepper, sliced',
      '1/4 red onion, sliced',
      '1/4 avocado, sliced',
      '2 tbsp lime juice',
      '1 tsp cumin',
      '1 tsp chili powder',
      '1 tbsp olive oil',
      'Fresh cilantro',
      '2 tbsp salsa'
    ],
    instructions: 'Season steak with cumin and chili powder. Heat oil, cook steak 3-4 minutes until medium. Remove, cook peppers and onions until tender. Mix rice with lime juice and cilantro. Serve steak and vegetables over rice, top with avocado and salsa.',
    prepTime: '18 minutes',
    servingSize: '1 serving',
    calories: 450,
    protein: 28,
    carbs: 36,
    fats: 22,
    dietaryTags: ['high-protein', 'dairy-free', 'gluten-free'],
    substitution: 'Use portobello mushrooms instead of steak for vegetarian',
    imageDescription: 'Perfectly seared steak strips with colorful bell peppers and onions over cilantro lime rice, topped with fresh avocado and salsa',
    category: 'lunch',
    estimatedCost: 6.25
  },
  {
    id: 'garlic-herb-steak-vegetables',
    name: 'Garlic Herb Steak with Roasted Vegetables',
    description: 'Juicy steak with aromatic herbs alongside perfectly roasted seasonal vegetables.',
    ingredients: [
      '5 oz ribeye steak',
      '1 cup mixed vegetables (asparagus, Brussels sprouts, carrots)',
      '3 cloves garlic, minced',
      '2 tbsp fresh herbs (rosemary, thyme)',
      '2 tbsp olive oil',
      '1 tbsp butter',
      'Salt and black pepper',
      '1 tbsp balsamic vinegar'
    ],
    instructions: 'Season steak with salt, pepper, and half the herbs. Toss vegetables with oil, garlic, and remaining herbs. Roast vegetables at 425°F for 20 minutes. Pan-sear steak 4-5 minutes per side, finish with butter. Rest steak 5 minutes, drizzle vegetables with balsamic.',
    prepTime: '30 minutes',
    servingSize: '1 serving',
    calories: 520,
    protein: 34,
    carbs: 18,
    fats: 32,
    dietaryTags: ['high-protein', 'low-carb', 'gluten-free'],
    substitution: 'Use flank steak for leaner option',
    imageDescription: 'A perfectly cooked ribeye steak with herb crust alongside colorful roasted vegetables, drizzled with balsamic reduction',
    category: 'dinner',
    estimatedCost: 8.50
  },
  {
    id: 'korean-beef-lettuce-wraps',
    name: 'Korean-Style Beef Lettuce Wraps',
    description: 'Marinated beef with Korean flavors wrapped in crisp lettuce cups.',
    ingredients: [
      '4 oz ground beef (85% lean)',
      '1 head butter lettuce',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '1 tbsp brown sugar',
      '2 cloves garlic, minced',
      '1 tsp fresh ginger, grated',
      '1/4 cucumber, julienned',
      '1 carrot, julienned',
      '2 tbsp sesame seeds',
      '2 green onions, sliced'
    ],
    instructions: 'Cook beef, breaking up as it cooks. Mix soy sauce, sesame oil, brown sugar, garlic, and ginger. Add sauce to beef, cook until glazed. Serve in lettuce cups with cucumber, carrot, sesame seeds, and green onions.',
    prepTime: '15 minutes',
    servingSize: '1 serving',
    calories: 320,
    protein: 24,
    carbs: 16,
    fats: 18,
    dietaryTags: ['high-protein', 'low-carb', 'dairy-free'],
    substitution: 'Use ground turkey for lighter option',
    imageDescription: 'Fresh lettuce cups filled with Korean-glazed ground beef, topped with julienned vegetables, sesame seeds, and green onions',
    category: 'lunch',
    estimatedCost: 5.15
  },

  // ADDITIONAL VARIETY MEALS
  {
    id: 'shrimp-avocado-salad',
    name: 'Cilantro Lime Shrimp & Avocado Salad',
    description: 'Fresh shrimp with creamy avocado in a zesty cilantro lime dressing.',
    ingredients: [
      '5 oz shrimp, peeled',
      '2 cups mixed greens',
      '1 avocado, diced',
      '1/4 cup cherry tomatoes',
      '1/4 red onion, thinly sliced',
      '3 tbsp lime juice',
      '2 tbsp olive oil',
      '1/4 cup cilantro, chopped',
      '1 tsp cumin',
      'Salt and pepper to taste'
    ],
    instructions: 'Season shrimp with cumin, salt, and pepper. Cook shrimp 2-3 minutes per side until pink. Whisk lime juice, oil, and cilantro for dressing. Toss greens with dressing, top with shrimp, avocado, tomatoes, and onion.',
    prepTime: '12 minutes',
    servingSize: '1 serving',
    calories: 380,
    protein: 30,
    carbs: 14,
    fats: 24,
    dietaryTags: ['high-protein', 'low-carb', 'dairy-free', 'gluten-free'],
    substitution: 'Use grilled chicken for different protein',
    imageDescription: 'Succulent pink shrimp over fresh greens with diced avocado and cherry tomatoes, drizzled with cilantro lime dressing',
    category: 'lunch',
    estimatedCost: 6.75
  },
  {
    id: 'turkey-meatball-zoodles',
    name: 'Turkey Meatballs with Zucchini Noodles',
    description: 'Lean turkey meatballs in marinara sauce served over spiralized zucchini.',
    ingredients: [
      '4 oz ground turkey',
      '2 medium zucchini, spiralized',
      '1/2 cup marinara sauce',
      '1 egg, beaten',
      '2 tbsp breadcrumbs',
      '2 cloves garlic, minced',
      '1 tbsp olive oil',
      '2 tbsp parmesan cheese',
      'Fresh basil for garnish',
      'Italian seasoning'
    ],
    instructions: 'Mix turkey, egg, breadcrumbs, half the garlic, and Italian seasoning. Form into meatballs. Cook in oil until browned and cooked through. Heat marinara with remaining garlic. Quickly sauté zucchini noodles. Serve meatballs over zoodles with sauce, top with parmesan and basil.',
    prepTime: '20 minutes',
    servingSize: '1 serving',
    calories: 340,
    protein: 28,
    carbs: 18,
    fats: 18,
    dietaryTags: ['high-protein', 'low-carb'],
    substitution: 'Use lentils for vegetarian meatballs',
    imageDescription: 'Golden turkey meatballs over spiralized zucchini noodles with rich marinara sauce, topped with grated parmesan and fresh basil',
    category: 'dinner',
    estimatedCost: 4.95
  },
  {
    id: 'breakfast-quinoa-bowl',
    name: 'Tropical Breakfast Quinoa Bowl',
    description: 'Warm quinoa breakfast bowl with tropical fruits and coconut.',
    ingredients: [
      '1/2 cup cooked quinoa',
      '1/2 cup coconut milk',
      '1/4 cup diced pineapple',
      '1/4 cup diced mango',
      '2 tbsp shredded coconut',
      '1 tbsp chia seeds',
      '1 tbsp maple syrup',
      '1/4 tsp vanilla extract',
      '2 tbsp chopped macadamia nuts'
    ],
    instructions: 'Warm quinoa with coconut milk, maple syrup, and vanilla. Top with diced fruits, coconut, chia seeds, and macadamia nuts. Serve warm.',
    prepTime: '8 minutes',
    servingSize: '1 serving',
    calories: 350,
    protein: 8,
    carbs: 48,
    fats: 16,
    dietaryTags: ['vegan', 'gluten-free'],
    substitution: 'Use steel-cut oats instead of quinoa',
    imageDescription: 'Warm quinoa in a bowl topped with colorful tropical fruits, toasted coconut, and macadamia nuts with a drizzle of coconut milk',
    category: 'breakfast',
    estimatedCost: 3.85
  },
  {
    id: 'loaded-sweet-potato',
    name: 'Loaded Southwest Sweet Potato',
    description: 'Baked sweet potato topped with black beans, avocado, and southwest flavors.',
    ingredients: [
      '1 large sweet potato',
      '1/2 cup black beans',
      '1/4 avocado, diced',
      '2 tbsp corn kernels',
      '2 tbsp salsa',
      '1 tbsp Greek yogurt',
      '1 tbsp lime juice',
      '1/4 tsp cumin',
      'Fresh cilantro',
      'Hot sauce (optional)'
    ],
    instructions: 'Bake sweet potato at 400°F for 45 minutes until tender. Heat black beans with cumin. Cut open potato, fluff flesh. Top with beans, corn, avocado, salsa, and Greek yogurt. Garnish with cilantro and lime juice.',
    prepTime: '50 minutes',
    servingSize: '1 serving',
    calories: 320,
    protein: 12,
    carbs: 58,
    fats: 8,
    dietaryTags: ['vegetarian', 'high-fiber', 'gluten-free'],
    substitution: 'Use cashew cream instead of Greek yogurt for vegan',
    imageDescription: 'A fluffy baked sweet potato loaded with colorful toppings including black beans, avocado, corn, and fresh cilantro',
    category: 'dinner',
    estimatedCost: 3.25
  }
];

export const getRecipesByCategory = (category: Recipe['category']) => {
  return recipes.filter(recipe => recipe.category === category);
};

export const getRecipeById = (id: string) => {
  return recipes.find(recipe => recipe.id === id);
};

export const getAllDietaryTags = () => {
  const tags = new Set<string>();
  recipes.forEach(recipe => {
    recipe.dietaryTags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};