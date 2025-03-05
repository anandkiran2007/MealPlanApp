/*
  # Recipe Data Seed

  This script populates the database with initial recipe data including:
  1. Basic recipes with full details
  2. Recipe ingredients with amounts and units
  3. Recipe instructions with step numbers
  4. Recipe nutrition information
  5. Recipe tags for dietary preferences
*/

-- Insert recipes
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    'rec_001',
    'Mediterranean Grilled Chicken Salad',
    'A refreshing Mediterranean salad with grilled chicken, fresh vegetables, and a zesty lemon dressing.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    30,
    420,
    4,
    NOW()
  ),
  (
    'rec_002',
    'Vegetarian Buddha Bowl',
    'A nourishing bowl packed with roasted vegetables, quinoa, and a creamy tahini dressing.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    25,
    380,
    2,
    NOW()
  ),
  (
    'rec_003',
    'Salmon with Lemon-Dill Sauce',
    'Perfectly seared salmon fillets topped with a creamy lemon-dill sauce.',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    20,
    350,
    4,
    NOW()
  ),
  (
    'rec_004',
    'Vegan Lentil Curry',
    'A hearty and flavorful vegan curry made with red lentils, coconut milk, and aromatic spices.',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    35,
    310,
    6,
    NOW()
  ),
  (
    'rec_005',
    'Quinoa Buddha Bowl',
    'A nourishing vegetarian bowl with quinoa, roasted vegetables, and tahini dressing.',
    'https://images.unsplash.com/photo-1543339318-b43dc53e19b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    25,
    350,
    4,
    NOW()
  );

-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
  -- Mediterranean Grilled Chicken Salad
  ('rec_001', 'chicken breasts', 2, 'piece'),
  ('rec_001', 'cucumber', 1, 'large'),
  ('rec_001', 'cherry tomatoes', 2, 'cups'),
  ('rec_001', 'red onion', 1, 'medium'),
  ('rec_001', 'Kalamata olives', 1, 'cup'),
  ('rec_001', 'feta cheese', 6, 'oz'),
  ('rec_001', 'olive oil', 2, 'tbsp'),
  ('rec_001', 'lemon', 1, 'piece'),

  -- Vegetarian Buddha Bowl
  ('rec_002', 'quinoa', 1, 'cup'),
  ('rec_002', 'sweet potato', 1, 'large'),
  ('rec_002', 'broccoli florets', 1, 'cup'),
  ('rec_002', 'red bell pepper', 1, 'piece'),
  ('rec_002', 'chickpeas', 1, 'can'),
  ('rec_002', 'avocado', 1, 'piece'),
  ('rec_002', 'tahini', 2, 'tbsp'),

  -- Salmon with Lemon-Dill Sauce
  ('rec_003', 'salmon fillets', 4, 'piece'),
  ('rec_003', 'Greek yogurt', 0.25, 'cup'),
  ('rec_003', 'fresh dill', 2, 'tbsp'),
  ('rec_003', 'lemon', 1, 'piece'),
  ('rec_003', 'garlic', 1, 'clove'),
  ('rec_003', 'capers', 1, 'tbsp'),

  -- Vegan Lentil Curry
  ('rec_004', 'red lentils', 2, 'cups'),
  ('rec_004', 'coconut milk', 1, 'can'),
  ('rec_004', 'onion', 1, 'large'),
  ('rec_004', 'garlic', 3, 'cloves'),
  ('rec_004', 'ginger', 1, 'tbsp'),
  ('rec_004', 'curry powder', 2, 'tbsp'),
  ('rec_004', 'vegetable broth', 2, 'cups'),

  -- Quinoa Buddha Bowl
  ('rec_005', 'quinoa', 1, 'cup'),
  ('rec_005', 'sweet potatoes', 2, 'medium'),
  ('rec_005', 'broccoli florets', 2, 'cups'),
  ('rec_005', 'chickpeas', 1, 'can'),
  ('rec_005', 'olive oil', 2, 'tbsp'),
  ('rec_005', 'avocado', 1, 'piece'),
  ('rec_005', 'tahini', 2, 'tbsp');

-- Insert recipe instructions
INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
  -- Mediterranean Grilled Chicken Salad
  ('rec_001', 1, 'Season chicken breasts with salt, pepper, and oregano'),
  ('rec_001', 2, 'Grill chicken for 6-7 minutes per side until cooked through'),
  ('rec_001', 3, 'Dice cucumber, halve tomatoes, and slice red onion'),
  ('rec_001', 4, 'Combine vegetables in a large bowl'),
  ('rec_001', 5, 'Slice grilled chicken and add to the bowl'),
  ('rec_001', 6, 'Add olives and crumbled feta cheese'),
  ('rec_001', 7, 'Drizzle with olive oil and lemon juice'),

  -- Vegetarian Buddha Bowl
  ('rec_002', 1, 'Cook quinoa according to package instructions'),
  ('rec_002', 2, 'Roast sweet potato and broccoli with olive oil'),
  ('rec_002', 3, 'Drain and rinse chickpeas'),
  ('rec_002', 4, 'Make tahini dressing'),
  ('rec_002', 5, 'Assemble bowls with quinoa base'),
  ('rec_002', 6, 'Top with roasted vegetables and chickpeas'),
  ('rec_002', 7, 'Add sliced avocado and drizzle with dressing'),

  -- Salmon with Lemon-Dill Sauce
  ('rec_003', 1, 'Season salmon fillets with salt and pepper'),
  ('rec_003', 2, 'Sear salmon skin-side down for 4 minutes'),
  ('rec_003', 3, 'Flip and cook for another 3-4 minutes'),
  ('rec_003', 4, 'Mix yogurt, dill, lemon juice, and garlic for sauce'),
  ('rec_003', 5, 'Add capers to the sauce and mix well'),
  ('rec_003', 6, 'Serve salmon topped with the sauce'),

  -- Vegan Lentil Curry
  ('rec_004', 1, 'Sauté onion, garlic, and ginger'),
  ('rec_004', 2, 'Add curry powder and cook until fragrant'),
  ('rec_004', 3, 'Add lentils, coconut milk, and broth'),
  ('rec_004', 4, 'Simmer for 20-25 minutes until lentils are tender'),
  ('rec_004', 5, 'Season with salt and pepper to taste'),

  -- Quinoa Buddha Bowl
  ('rec_005', 1, 'Cook quinoa according to package instructions'),
  ('rec_005', 2, 'Roast sweet potatoes and broccoli'),
  ('rec_005', 3, 'Season chickpeas and warm them'),
  ('rec_005', 4, 'Make tahini dressing with lemon juice'),
  ('rec_005', 5, 'Assemble bowls with all ingredients'),
  ('rec_005', 6, 'Top with sliced avocado and dressing');

-- Insert recipe nutrition
INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
  ('rec_001', 35, 12, 28, 4),
  ('rec_002', 15, 52, 18, 12),
  ('rec_003', 29, 3, 22, 0),
  ('rec_004', 14, 42, 10, 8),
  ('rec_005', 15, 45, 18, 12);

-- Insert recipe tags
INSERT INTO recipe_tags (recipe_id, tag) VALUES
  -- Mediterranean Grilled Chicken Salad
  ('rec_001', 'Mediterranean'),
  ('rec_001', 'High Protein'),
  ('rec_001', 'Gluten-Free'),

  -- Vegetarian Buddha Bowl
  ('rec_002', 'Vegetarian'),
  ('rec_002', 'Vegan'),
  ('rec_002', 'High Fiber'),
  ('rec_002', 'Gluten-Free'),

  -- Salmon with Lemon-Dill Sauce
  ('rec_003', 'High Protein'),
  ('rec_003', 'Low Carb'),
  ('rec_003', 'Gluten-Free'),
  ('rec_003', 'Quick Meal'),

  -- Vegan Lentil Curry
  ('rec_004', 'Vegan'),
  ('rec_004', 'Vegetarian'),
  ('rec_004', 'High Fiber'),
  ('rec_004', 'Gluten-Free'),

  -- Quinoa Buddha Bowl
  ('rec_005', 'Vegetarian'),
  ('rec_005', 'Vegan'),
  ('rec_005', 'High Fiber');