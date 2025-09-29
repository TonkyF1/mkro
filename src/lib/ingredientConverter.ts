// Ingredient to gram conversion and UK product mapping
export interface ProductMapping {
  productName: string;
  retailerSuggestions: string[];
  gramsPerUnit: number;
  isLiquid?: boolean;
}

// List of liquid ingredients
export const liquidIngredients = [
  'milk', 'skim milk', 'whole milk', 'almond milk', 'coconut milk', 'soy milk', 'oat milk',
  'water', 'oil', 'olive oil', 'vegetable oil', 'coconut oil', 'sesame oil',
  'broth', 'stock', 'chicken broth', 'vegetable broth', 'beef broth',
  'juice', 'lemon juice', 'lime juice', 'orange juice',
  'sauce', 'soy sauce', 'worcestershire sauce', 'fish sauce', 'hot sauce',
  'vinegar', 'balsamic vinegar', 'apple cider vinegar', 'white vinegar',
  'wine', 'red wine', 'white wine', 'cooking wine',
  'cream', 'heavy cream', 'light cream', 'half and half'
];

export function isLiquid(ingredient: string): boolean {
  const lowerIngredient = ingredient.toLowerCase();
  return liquidIngredients.some(liquid => lowerIngredient.includes(liquid));
}

export const ingredientToGramMapping: Record<string, number> = {
  // Grains & Cereals
  'oats': 20, // 1/4 cup
  'rice': 200, // 1 cup
  'quinoa': 170, // 1 cup
  'pasta': 100, // 100g serving
  'flour': 125, // 1 cup
  'bread': 25, // 1 slice
  
  // Liquids
  'milk': 240, // 1 cup
  'almond milk': 240, // 1 cup
  'coconut milk': 240, // 1 cup
  'water': 240, // 1 cup
  'olive oil': 15, // 1 tbsp
  'oil': 15, // 1 tbsp
  
  // Vegetables (common portions)
  'avocado': 150, // 1 medium
  'tomato': 120, // 1 medium
  'onion': 110, // 1 medium
  'carrot': 60, // 1 medium
  'bell pepper': 150, // 1 medium
  'cucumber': 120, // 1 medium
  'spinach': 30, // 1 cup fresh
  'lettuce': 20, // 1 cup
  
  // Fruits
  'banana': 120, // 1 medium
  'apple': 150, // 1 medium
  'berries': 150, // 1 cup
  'strawberries': 150, // 1 cup
  'blueberries': 150, // 1 cup
  'lemon': 60, // 1 medium
  
  // Proteins
  'chicken breast': 150, // typical serving
  'salmon': 150, // typical serving
  'eggs': 50, // 1 large egg
  'tofu': 100, // 100g serving
  'beans': 180, // 1 cup cooked
  'chickpeas': 180, // 1 cup cooked
  
  // Nuts & Seeds
  'almonds': 30, // 1 oz
  'walnuts': 30, // 1 oz
  'chia seeds': 15, // 1 tbsp
  'flax seeds': 10, // 1 tbsp
  
  // Seasonings (small amounts)
  'salt': 5, // 1 tsp
  'pepper': 2, // 1 tsp
  'herbs': 2, // 1 tsp dried
  'garlic': 3, // 1 clove
  'ginger': 5, // 1 tsp fresh
};

export const productMappings: Record<string, ProductMapping> = {
  'oats': {
    productName: 'Porridge Oats',
    retailerSuggestions: [
      'Tesco Wholegrain Porridge Oats 1kg',
      'Sainsbury\'s Scottish Porridge Oats 1kg',
      'Quaker Oats So Simple Original 12x27g'
    ],
    gramsPerUnit: 1000
  },
  'almond milk': {
    productName: 'Unsweetened Almond Milk',
    retailerSuggestions: [
      'Alpro Almond Original 1L',
      'Sainsbury\'s Unsweetened Almond Drink 1L',
      'Tesco Plant Chef Almond Drink 1L'
    ],
    gramsPerUnit: 1000
  },
  'pasta': {
    productName: 'Pasta',
    retailerSuggestions: [
      'Barilla Penne Rigate 500g',
      'Tesco Fusilli Pasta 500g',
      'Sainsbury\'s Spaghetti 500g'
    ],
    gramsPerUnit: 500
  },
  'rice': {
    productName: 'Basmati Rice',
    retailerSuggestions: [
      'Tilda Pure Basmati Rice 1kg',
      'Sainsbury\'s Basmati Rice 1kg',
      'ASDA Extra Long Grain Basmati Rice 1kg'
    ],
    gramsPerUnit: 1000
  },
  'chicken breast': {
    productName: 'Chicken Breast Fillets',
    retailerSuggestions: [
      'Tesco British Chicken Breast Fillets 650g',
      'Sainsbury\'s British Chicken Breast Fillets 500g',
      'ASDA Butcher\'s Selection Chicken Breast 600g'
    ],
    gramsPerUnit: 600
  },
  'salmon': {
    productName: 'Fresh Salmon Fillets',
    retailerSuggestions: [
      'Tesco Finest Scottish Salmon Fillets 240g',
      'Sainsbury\'s Taste the Difference Scottish Salmon 300g',
      'ASDA Extra Special Scottish Salmon Fillet 250g'
    ],
    gramsPerUnit: 250
  },
  'avocado': {
    productName: 'Ripe Avocados',
    retailerSuggestions: [
      'Tesco Perfectly Ripe Avocados 2 pack',
      'Sainsbury\'s Ready to Eat Avocados 2 pack',
      'ASDA Grower\'s Selection Avocados 4 pack'
    ],
    gramsPerUnit: 300 // 2 pack
  },
  'berries': {
    productName: 'Mixed Berries',
    retailerSuggestions: [
      'Tesco Mixed Berries 400g',
      'Sainsbury\'s Frozen Berry Mix 500g',
      'ASDA Frozen Summer Fruits 500g'
    ],
    gramsPerUnit: 400
  },
  'spinach': {
    productName: 'Fresh Spinach',
    retailerSuggestions: [
      'Tesco Baby Spinach 200g',
      'Sainsbury\'s Baby Leaf Spinach 120g',
      'ASDA Baby Spinach 100g'
    ],
    gramsPerUnit: 150
  },
  'eggs': {
    productName: 'Free Range Eggs',
    retailerSuggestions: [
      'Tesco Free Range Large Eggs 12 pack',
      'Sainsbury\'s Woodland Free Range Eggs 12 pack',
      'ASDA Free Range Large Eggs 15 pack'
    ],
    gramsPerUnit: 600 // 12 eggs
  }
};

// Parse quantity multiplier from ingredient string
function parseQuantity(ingredient: string): number {
  // Match patterns like: "1/4 cup", "2 tbsp", "1.5 oz", etc.
  const fractionMatch = ingredient.match(/^(\d+)\/(\d+)/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  }
  
  const decimalMatch = ingredient.match(/^(\d+\.?\d*)/);
  if (decimalMatch) {
    return parseFloat(decimalMatch[1]);
  }
  
  return 1; // Default to 1 if no quantity found
}

export function convertIngredientToGrams(ingredient: string): number {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Extract quantity multiplier
  const multiplier = parseQuantity(lowerIngredient);
  
  // Clean ingredient name
  const cleanIngredient = lowerIngredient
    .replace(/^\d+\.?\d*\s*/g, '') // Remove leading numbers
    .replace(/^\d+\/\d+\s*/g, '') // Remove fractions
    .replace(/\s*(cups?|tbsp|tsp|oz|lbs?|g|kg|slices?|can|bunch|medium|large|small)\s*/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
  
  // Base amount per unit for common measurements
  const measurementUnits: Record<string, number> = {
    'cup': 240,
    'cups': 240,
    'tbsp': 15,
    'tsp': 5,
    'oz': 28,
    'lb': 454,
    'lbs': 454,
    'slice': 25,
    'slices': 25,
    'clove': 3,
    'medium': 100,
    'large': 150,
    'small': 50,
  };
  
  // Check if ingredient specifies a measurement unit
  for (const [unit, grams] of Object.entries(measurementUnits)) {
    if (lowerIngredient.includes(unit)) {
      return Math.round(multiplier * grams);
    }
  }
  
  // Try exact match in base mapping
  if (ingredientToGramMapping[cleanIngredient]) {
    return Math.round(multiplier * ingredientToGramMapping[cleanIngredient]);
  }
  
  // Try partial matches for compound ingredients
  for (const [key, grams] of Object.entries(ingredientToGramMapping)) {
    if (cleanIngredient.includes(key) || key.includes(cleanIngredient)) {
      return Math.round(multiplier * grams);
    }
  }
  
  // Default fallback
  return Math.round(multiplier * 100);
}

export function getProductMapping(ingredient: string): ProductMapping | null {
  const cleanIngredient = ingredient.toLowerCase()
    .replace(/^\d+\s*(cups?|tbsp|tsp|oz|lbs?|g|kg|slices?|can|bunch|medium|large|small)\s*/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
  
  // Try exact match first
  if (productMappings[cleanIngredient]) {
    return productMappings[cleanIngredient];
  }
  
  // Try partial matches
  for (const [key, mapping] of Object.entries(productMappings)) {
    if (cleanIngredient.includes(key) || key.includes(cleanIngredient)) {
      return mapping;
    }
  }
  
  return null;
}