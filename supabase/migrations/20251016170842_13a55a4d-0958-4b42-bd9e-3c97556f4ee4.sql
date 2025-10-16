-- Insert UK Healthy Recipes

-- BREAKFAST (Weight Loss Focused)
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Protein Overnight Oats', 'Creamy overnight oats packed with protein and topped with fresh berries', 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800', 320, 25, 42, 6, 5, 1, 'breakfast', 'weight_loss', ARRAY['high-protein', 'weight-loss', 'quick'], false, 
'1. Mix oats, protein powder, and milk in a jar
2. Refrigerate overnight
3. Top with berries in the morning
4. Enjoy cold', 
'[{"item": "Oats", "amount": "50g"}, {"item": "Protein powder", "amount": "30g"}, {"item": "Almond milk", "amount": "200ml"}, {"item": "Mixed berries", "amount": "50g"}]'::jsonb),

('Scrambled Eggs with Smoked Salmon', 'Fluffy scrambled eggs with premium Scottish smoked salmon', 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800', 280, 28, 4, 16, 10, 1, 'breakfast', 'high_protein', ARRAY['high-protein', 'weight-loss', 'keto'], false,
'1. Whisk eggs with a splash of milk
2. Cook in butter over low heat, stirring constantly
3. Add smoked salmon pieces
4. Season with black pepper and chives',
'[{"item": "Eggs", "amount": "3 large"}, {"item": "Smoked salmon", "amount": "50g"}, {"item": "Butter", "amount": "10g"}, {"item": "Milk", "amount": "30ml"}, {"item": "Chives", "amount": "5g"}]'::jsonb),

('Greek Yogurt Protein Bowl', 'Thick Greek yogurt with protein granola and fresh berries', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', 250, 30, 28, 4, 5, 1, 'breakfast', 'high_protein', ARRAY['high-protein', 'weight-loss', 'quick'], false,
'1. Spoon Greek yogurt into bowl
2. Top with protein granola
3. Add fresh berries
4. Drizzle with honey (optional)',
'[{"item": "Greek yogurt", "amount": "200g"}, {"item": "Protein granola", "amount": "40g"}, {"item": "Mixed berries", "amount": "50g"}, {"item": "Honey", "amount": "10g"}]'::jsonb),

('Healthy Full English', 'Traditional British breakfast made healthy with poached eggs and turkey bacon', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800', 380, 32, 28, 14, 15, 1, 'breakfast', 'balanced', ARRAY['balanced', 'high-protein'], false,
'1. Grill turkey bacon and tomatoes
2. Poach eggs in simmering water
3. Toast wholemeal bread
4. Grill mushrooms
5. Serve together',
'[{"item": "Turkey bacon", "amount": "2 rashers"}, {"item": "Eggs", "amount": "2"}, {"item": "Tomatoes", "amount": "2 small"}, {"item": "Mushrooms", "amount": "100g"}, {"item": "Wholemeal toast", "amount": "1 slice"}]'::jsonb);

-- LUNCH (Balanced & High Protein)
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Chicken & Avocado Salad', 'Grilled chicken breast with creamy avocado and mixed leaves', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 420, 38, 18, 22, 15, 1, 'lunch', 'high_protein', ARRAY['high-protein', 'balanced', 'gluten-free'], false,
'1. Grill chicken breast with seasoning
2. Slice chicken and avocado
3. Mix with salad leaves, cherry tomatoes, cucumber
4. Dress with olive oil and lemon',
'[{"item": "Chicken breast", "amount": "150g"}, {"item": "Avocado", "amount": "1/2"}, {"item": "Mixed leaves", "amount": "100g"}, {"item": "Cherry tomatoes", "amount": "100g"}, {"item": "Cucumber", "amount": "50g"}]'::jsonb),

('Tuna Jacket Potato', 'Baked potato filled with protein-rich tuna mayo and side salad', 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=800', 380, 28, 52, 8, 60, 1, 'lunch', 'balanced', ARRAY['balanced', 'high-protein'], false,
'1. Bake potato at 200°C for 45-60 minutes
2. Mix tuna with light mayo and sweetcorn
3. Cut potato and fill with tuna mix
4. Serve with side salad',
'[{"item": "Baking potato", "amount": "1 large"}, {"item": "Tuna", "amount": "1 can"}, {"item": "Light mayo", "amount": "30g"}, {"item": "Sweetcorn", "amount": "50g"}, {"item": "Side salad", "amount": "100g"}]'::jsonb),

('Prawn & Quinoa Bowl', 'Protein-packed prawns with superfood quinoa and vegetables', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800', 360, 32, 38, 8, 20, 1, 'lunch', 'high_protein', ARRAY['high-protein', 'balanced', 'gluten-free'], false,
'1. Cook quinoa according to package
2. Stir-fry prawns with garlic
3. Steam broccoli and edamame
4. Mix together and season',
'[{"item": "Quinoa", "amount": "60g dry"}, {"item": "King prawns", "amount": "150g"}, {"item": "Broccoli", "amount": "100g"}, {"item": "Edamame", "amount": "50g"}, {"item": "Garlic", "amount": "2 cloves"}]'::jsonb),

('Chicken Caesar Wrap', 'Light version of the classic with grilled chicken and crisp lettuce', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800', 390, 35, 42, 10, 15, 1, 'lunch', 'high_protein', ARRAY['high-protein', 'balanced'], false,
'1. Grill chicken breast strips
2. Mix light Caesar dressing with lettuce
3. Add chicken and parmesan
4. Wrap in whole wheat tortilla',
'[{"item": "Chicken breast", "amount": "120g"}, {"item": "Whole wheat wrap", "amount": "1"}, {"item": "Romaine lettuce", "amount": "80g"}, {"item": "Light Caesar dressing", "amount": "30g"}, {"item": "Parmesan", "amount": "20g"}]'::jsonb);

-- DINNER (Weight Loss)
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Grilled Chicken with Roasted Veg', 'Tender grilled chicken with Mediterranean roasted vegetables', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800', 340, 42, 28, 8, 35, 1, 'dinner', 'weight_loss', ARRAY['high-protein', 'weight-loss', 'gluten-free'], false,
'1. Season chicken breast with herbs
2. Grill chicken for 6-7 minutes each side
3. Roast peppers, courgette, onions at 200°C
4. Serve together with fresh basil',
'[{"item": "Chicken breast", "amount": "180g"}, {"item": "Bell peppers", "amount": "150g"}, {"item": "Courgette", "amount": "100g"}, {"item": "Red onion", "amount": "80g"}, {"item": "Olive oil", "amount": "10ml"}]'::jsonb),

('Baked Salmon with Asparagus', 'Omega-3 rich salmon with tender asparagus spears', 'https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=800', 380, 38, 12, 18, 25, 1, 'dinner', 'weight_loss', ARRAY['high-protein', 'weight-loss', 'gluten-free'], false,
'1. Season salmon fillet with lemon and dill
2. Bake at 180°C for 15-18 minutes
3. Steam asparagus for 5 minutes
4. Serve with lemon wedge',
'[{"item": "Salmon fillet", "amount": "160g"}, {"item": "Asparagus", "amount": "150g"}, {"item": "Lemon", "amount": "1/2"}, {"item": "Fresh dill", "amount": "10g"}, {"item": "Olive oil", "amount": "5ml"}]'::jsonb),

('Turkey Meatballs with Courgetti', 'Lean turkey meatballs with spiralized courgette noodles', 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800', 320, 36, 24, 10, 30, 1, 'dinner', 'weight_loss', ARRAY['high-protein', 'weight-loss', 'low-carb'], false,
'1. Mix turkey mince with herbs and egg
2. Form into meatballs and bake at 200°C for 20 mins
3. Spiralize courgette
4. Serve with tomato sauce',
'[{"item": "Turkey mince", "amount": "150g"}, {"item": "Courgette", "amount": "200g"}, {"item": "Egg", "amount": "1"}, {"item": "Tomato passata", "amount": "100ml"}, {"item": "Italian herbs", "amount": "5g"}]'::jsonb),

('Cod with Sweet Potato Mash', 'Flaky cod fillet with creamy mashed sweet potato', 'https://images.unsplash.com/photo-1580959375944-1ab5b8e8a66f?w=800', 360, 35, 38, 6, 30, 1, 'dinner', 'weight_loss', ARRAY['high-protein', 'balanced', 'gluten-free'], false,
'1. Bake cod fillet at 180°C for 15 minutes
2. Boil and mash sweet potato with butter
3. Steam green beans
4. Serve together',
'[{"item": "Cod fillet", "amount": "170g"}, {"item": "Sweet potato", "amount": "200g"}, {"item": "Green beans", "amount": "100g"}, {"item": "Butter", "amount": "10g"}, {"item": "Black pepper", "amount": "2g"}]'::jsonb);

-- DINNER (Weight Gain/Muscle)
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Lean Beef Chilli with Rice', 'Hearty beef chilli packed with protein served with fluffy rice', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 620, 48, 68, 16, 45, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'weight-gain', 'muscle'], false,
'1. Brown lean beef mince
2. Add kidney beans, tomatoes, and spices
3. Simmer for 30 minutes
4. Serve over cooked rice',
'[{"item": "Lean beef mince", "amount": "180g"}, {"item": "Kidney beans", "amount": "100g"}, {"item": "Tomatoes", "amount": "200g"}, {"item": "Basmati rice", "amount": "80g dry"}, {"item": "Spices", "amount": "10g"}]'::jsonb),

('Chicken Tikka Masala with Rice', 'Lean chicken in creamy tikka sauce with basmati rice', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', 520, 42, 55, 14, 40, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'balanced'], false,
'1. Marinate chicken in tikka paste
2. Grill chicken pieces
3. Make sauce with tomatoes and cream
4. Serve with basmati rice',
'[{"item": "Chicken breast", "amount": "160g"}, {"item": "Tikka paste", "amount": "30g"}, {"item": "Light cream", "amount": "50ml"}, {"item": "Tomatoes", "amount": "200g"}, {"item": "Basmati rice", "amount": "70g dry"}]'::jsonb),

('Steak & Sweet Potato Chips', 'Lean sirloin steak with oven-baked sweet potato chips', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800', 680, 52, 62, 22, 35, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'weight-gain', 'muscle'], false,
'1. Season and grill steak to preference
2. Cut sweet potato into chips
3. Bake at 200°C for 30 minutes
4. Serve with vegetables',
'[{"item": "Sirloin steak", "amount": "200g"}, {"item": "Sweet potato", "amount": "300g"}, {"item": "Olive oil", "amount": "15ml"}, {"item": "Mixed vegetables", "amount": "150g"}]'::jsonb),

('Lamb Rogan Josh with Naan', 'Tender lamb in aromatic curry sauce with warm naan bread', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800', 720, 46, 72, 24, 60, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'weight-gain'], true,
'1. Marinate lamb in yogurt and spices
2. Slow cook with tomatoes and onions
3. Warm naan in oven
4. Garnish with coriander',
'[{"item": "Lamb shoulder", "amount": "180g"}, {"item": "Greek yogurt", "amount": "50g"}, {"item": "Curry spices", "amount": "20g"}, {"item": "Tomatoes", "amount": "200g"}, {"item": "Naan bread", "amount": "1"}]'::jsonb);

-- FAKEAWAYS
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Cheeky Nandos Style Chicken', 'Peri-peri marinated chicken with spicy rice', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800', 480, 42, 52, 12, 35, 1, 'dinner', 'fakeaway', ARRAY['fakeaway', 'high-protein'], false,
'1. Marinate chicken in peri-peri sauce
2. Grill chicken until cooked through
3. Cook rice with tomatoes and peppers
4. Serve with corn on the cob',
'[{"item": "Chicken breast", "amount": "180g"}, {"item": "Peri-peri sauce", "amount": "40g"}, {"item": "Rice", "amount": "70g dry"}, {"item": "Peppers", "amount": "100g"}, {"item": "Sweetcorn", "amount": "80g"}]'::jsonb),

('KFC Style Oven Baked Chicken', 'Crispy coated chicken baked not fried with coleslaw', 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800', 520, 38, 48, 16, 45, 1, 'dinner', 'fakeaway', ARRAY['fakeaway', 'high-protein', 'cheat-meal'], true,
'1. Coat chicken in herb-spiced breadcrumbs
2. Bake at 200°C for 35 minutes
3. Make healthy coleslaw with light mayo
4. Serve together',
'[{"item": "Chicken pieces", "amount": "200g"}, {"item": "Breadcrumbs", "amount": "50g"}, {"item": "Spices", "amount": "15g"}, {"item": "Cabbage", "amount": "100g"}, {"item": "Light mayo", "amount": "30g"}]'::jsonb),

('Healthy Fish & Chips', 'Oven-baked cod with chunky chips and mushy peas', 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800', 480, 36, 58, 12, 40, 1, 'dinner', 'fakeaway', ARRAY['fakeaway', 'high-protein'], false,
'1. Coat fish in breadcrumbs and bake
2. Cut potatoes into chips and bake
3. Prepare mushy peas
4. Serve with lemon wedge',
'[{"item": "Cod fillet", "amount": "180g"}, {"item": "Potatoes", "amount": "250g"}, {"item": "Breadcrumbs", "amount": "40g"}, {"item": "Peas", "amount": "100g"}, {"item": "Lemon", "amount": "1/2"}]'::jsonb),

('Grilled Chicken Legend', 'Healthier version of the famous burger with grilled chicken', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', 450, 40, 44, 12, 20, 1, 'lunch', 'fakeaway', ARRAY['fakeaway', 'high-protein'], true,
'1. Grill chicken breast
2. Toast wholemeal bun
3. Add lettuce, tomato, light mayo
4. Serve with side salad',
'[{"item": "Chicken breast", "amount": "140g"}, {"item": "Wholemeal bun", "amount": "1"}, {"item": "Lettuce", "amount": "30g"}, {"item": "Tomato", "amount": "50g"}, {"item": "Light mayo", "amount": "20g"}]'::jsonb),

('Protein Pizza Cauliflower Base', 'High-protein pizza with cauliflower base and lean toppings', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 520, 42, 38, 20, 35, 1, 'dinner', 'fakeaway', ARRAY['fakeaway', 'high-protein', 'low-carb'], true,
'1. Make cauliflower pizza base
2. Add tomato sauce and mozzarella
3. Top with chicken and vegetables
4. Bake until crispy',
'[{"item": "Cauliflower", "amount": "200g"}, {"item": "Mozzarella", "amount": "80g"}, {"item": "Chicken", "amount": "100g"}, {"item": "Tomato sauce", "amount": "50g"}, {"item": "Vegetables", "amount": "100g"}]'::jsonb),

('Protein Sub Sandwich', 'Loaded sub with lean turkey, chicken and fresh vegetables', 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800', 420, 38, 46, 10, 10, 1, 'lunch', 'fakeaway', ARRAY['fakeaway', 'high-protein'], false,
'1. Toast sub roll
2. Layer turkey and chicken
3. Add salad vegetables
4. Dress with mustard and light mayo',
'[{"item": "Sub roll", "amount": "1"}, {"item": "Turkey", "amount": "60g"}, {"item": "Chicken", "amount": "60g"}, {"item": "Salad", "amount": "80g"}, {"item": "Light mayo", "amount": "15g"}]'::jsonb),

('Teriyaki Chicken Bowl', 'Japanese-style chicken with vegetables and sticky rice', 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=800', 540, 40, 62, 12, 25, 1, 'dinner', 'fakeaway', ARRAY['fakeaway', 'high-protein', 'balanced'], false,
'1. Cook chicken in teriyaki sauce
2. Stir-fry vegetables
3. Cook sticky rice
4. Assemble in bowl',
'[{"item": "Chicken breast", "amount": "160g"}, {"item": "Teriyaki sauce", "amount": "40g"}, {"item": "Mixed vegetables", "amount": "150g"}, {"item": "Sticky rice", "amount": "70g dry"}]'::jsonb);

-- BRITISH CLASSICS
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Cottage Pie', 'Classic British comfort food with lean beef and sweet potato topping', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800', 450, 38, 48, 13, 60, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'british-classic'], true,
'1. Brown lean beef mince with onions
2. Add gravy and vegetables
3. Top with mashed sweet potato
4. Bake until golden',
'[{"item": "Lean beef mince", "amount": "160g"}, {"item": "Sweet potato", "amount": "200g"}, {"item": "Onion", "amount": "80g"}, {"item": "Carrots", "amount": "100g"}, {"item": "Gravy", "amount": "100ml"}]'::jsonb),

('Shepherds Pie', 'Traditional lamb shepherds pie with fluffy mash', 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800', 480, 36, 52, 14, 60, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'british-classic'], true,
'1. Cook lean lamb mince with vegetables
2. Add lamb gravy
3. Top with mashed potato
4. Bake until crispy on top',
'[{"item": "Lean lamb mince", "amount": "160g"}, {"item": "Potatoes", "amount": "250g"}, {"item": "Peas", "amount": "80g"}, {"item": "Carrots", "amount": "80g"}, {"item": "Gravy", "amount": "100ml"}]'::jsonb),

('Bangers & Mash', 'Chicken sausages with creamy mash and onion gravy', 'https://images.unsplash.com/photo-1635427908170-e040563cd93d?w=800', 520, 32, 58, 16, 35, 1, 'dinner', 'balanced', ARRAY['british-classic', 'comfort-food'], false,
'1. Grill chicken sausages
2. Make creamy mashed potato
3. Caramelize onions for gravy
4. Serve with peas',
'[{"item": "Chicken sausages", "amount": "2"}, {"item": "Potatoes", "amount": "250g"}, {"item": "Onions", "amount": "100g"}, {"item": "Gravy", "amount": "100ml"}, {"item": "Peas", "amount": "80g"}]'::jsonb),

('Sunday Roast Chicken', 'Traditional British Sunday roast with all the trimmings', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800', 580, 48, 52, 18, 90, 1, 'dinner', 'weight_gain', ARRAY['high-protein', 'british-classic'], true,
'1. Roast chicken breast with herbs
2. Roast potatoes and vegetables
3. Make lean gravy
4. Serve with Yorkshire pudding',
'[{"item": "Chicken breast", "amount": "180g"}, {"item": "Roast potatoes", "amount": "200g"}, {"item": "Vegetables", "amount": "150g"}, {"item": "Yorkshire pudding", "amount": "1"}, {"item": "Gravy", "amount": "100ml"}]'::jsonb);

-- SNACKS
INSERT INTO recipes (name, description, image_url, calories, protein, carbs, fats, cook_time, servings, meal_type, category, tags, is_premium, instructions, ingredients) VALUES
('Protein Flapjacks', 'Oaty flapjacks packed with protein powder', 'https://images.unsplash.com/photo-1590080876170-2e99e83fb18f?w=800', 240, 20, 28, 6, 25, 1, 'snack', 'high_protein', ARRAY['high-protein', 'quick', 'snack'], false,
'1. Mix oats, protein powder, honey
2. Press into baking tin
3. Bake at 180°C for 20 minutes
4. Cut into bars when cool',
'[{"item": "Oats", "amount": "60g"}, {"item": "Protein powder", "amount": "30g"}, {"item": "Honey", "amount": "20g"}, {"item": "Almond butter", "amount": "15g"}]'::jsonb),

('Greek Yogurt with Protein Granola', 'Thick Greek yogurt topped with crunchy protein granola', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', 280, 25, 32, 6, 5, 1, 'snack', 'high_protein', ARRAY['high-protein', 'quick', 'snack'], false,
'1. Spoon Greek yogurt into bowl
2. Add protein granola
3. Top with berries
4. Enjoy immediately',
'[{"item": "Greek yogurt", "amount": "150g"}, {"item": "Protein granola", "amount": "40g"}, {"item": "Berries", "amount": "50g"}]'::jsonb),

('Protein Shake Smoothie', 'Creamy protein shake with banana and berries', 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800', 220, 30, 22, 4, 5, 1, 'snack', 'high_protein', ARRAY['high-protein', 'quick', 'snack'], false,
'1. Blend protein powder with milk
2. Add banana and berries
3. Blend until smooth
4. Serve chilled',
'[{"item": "Protein powder", "amount": "40g"}, {"item": "Almond milk", "amount": "300ml"}, {"item": "Banana", "amount": "1"}, {"item": "Berries", "amount": "50g"}]'::jsonb),

('Beef Jerky', 'High-protein lean beef jerky snack', 'https://images.unsplash.com/photo-1588167923192-95e37d52b4f9?w=800', 120, 22, 4, 2, 0, 1, 'snack', 'high_protein', ARRAY['high-protein', 'keto', 'snack'], false,
'Pre-packaged beef jerky - high protein snack',
'[{"item": "Beef jerky", "amount": "40g"}]'::jsonb);