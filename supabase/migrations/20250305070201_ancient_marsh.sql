/*
  # Recipe Data Seed

  This migration populates the database with initial recipe data including:
  1. Basic recipes with full details
  2. Recipe ingredients with amounts and units
  3. Recipe instructions with step numbers
  4. Recipe nutrition information
  5. Recipe tags for dietary preferences

  Changes:
  - Use proper UUID format for IDs
  - Ensure referential integrity
  - Add proper data types
*/

-- Insert recipes
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Mediterranean Grilled Chicken Salad',
    'A refreshing Mediterranean salad with grilled chicken, fresh vegetables, and a zesty lemon dressing.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    30,
    420,
    4,
    NOW()
  );

DO $$
DECLARE
  recipe1_id uuid;
BEGIN
  -- Get the ID of the first recipe we just inserted
  SELECT id INTO recipe1_id FROM recipes WHERE title = 'Mediterranean Grilled Chicken Salad';

  -- Insert ingredients for Mediterranean Grilled Chicken Salad
  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe1_id, 'chicken breasts', 2, 'piece'),
    (recipe1_id, 'cucumber', 1, 'large'),
    (recipe1_id, 'cherry tomatoes', 2, 'cups'),
    (recipe1_id, 'red onion', 1, 'medium'),
    (recipe1_id, 'Kalamata olives', 1, 'cup'),
    (recipe1_id, 'feta cheese', 6, 'oz'),
    (recipe1_id, 'olive oil', 2, 'tbsp'),
    (recipe1_id, 'lemon', 1, 'piece');

  -- Insert instructions for Mediterranean Grilled Chicken Salad
  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe1_id, 1, 'Season chicken breasts with salt, pepper, and oregano'),
    (recipe1_id, 2, 'Grill chicken for 6-7 minutes per side until cooked through'),
    (recipe1_id, 3, 'Dice cucumber, halve tomatoes, and slice red onion'),
    (recipe1_id, 4, 'Combine vegetables in a large bowl'),
    (recipe1_id, 5, 'Slice grilled chicken and add to the bowl'),
    (recipe1_id, 6, 'Add olives and crumbled feta cheese'),
    (recipe1_id, 7, 'Drizzle with olive oil and lemon juice');

  -- Insert nutrition info for Mediterranean Grilled Chicken Salad
  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe1_id, 35, 12, 28, 4);

  -- Insert tags for Mediterranean Grilled Chicken Salad
  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe1_id, 'Mediterranean'),
    (recipe1_id, 'High Protein'),
    (recipe1_id, 'Gluten-Free');
END $$;

-- Insert Vegetarian Buddha Bowl
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Vegetarian Buddha Bowl',
    'A nourishing bowl packed with roasted vegetables, quinoa, and a creamy tahini dressing.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    25,
    380,
    2,
    NOW()
  );

DO $$
DECLARE
  recipe2_id uuid;
BEGIN
  -- Get the ID of the second recipe
  SELECT id INTO recipe2_id FROM recipes WHERE title = 'Vegetarian Buddha Bowl';

  -- Insert ingredients for Vegetarian Buddha Bowl
  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe2_id, 'quinoa', 1, 'cup'),
    (recipe2_id, 'sweet potato', 1, 'large'),
    (recipe2_id, 'broccoli florets', 1, 'cup'),
    (recipe2_id, 'red bell pepper', 1, 'piece'),
    (recipe2_id, 'chickpeas', 1, 'can'),
    (recipe2_id, 'avocado', 1, 'piece'),
    (recipe2_id, 'tahini', 2, 'tbsp');

  -- Insert instructions for Vegetarian Buddha Bowl
  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe2_id, 1, 'Cook quinoa according to package instructions'),
    (recipe2_id, 2, 'Roast sweet potato and broccoli with olive oil'),
    (recipe2_id, 3, 'Drain and rinse chickpeas'),
    (recipe2_id, 4, 'Make tahini dressing'),
    (recipe2_id, 5, 'Assemble bowls with quinoa base'),
    (recipe2_id, 6, 'Top with roasted vegetables and chickpeas'),
    (recipe2_id, 7, 'Add sliced avocado and drizzle with dressing');

  -- Insert nutrition info for Vegetarian Buddha Bowl
  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe2_id, 15, 52, 18, 12);

  -- Insert tags for Vegetarian Buddha Bowl
  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe2_id, 'Vegetarian'),
    (recipe2_id, 'Vegan'),
    (recipe2_id, 'High Fiber'),
    (recipe2_id, 'Gluten-Free');
END $$;

-- Insert Vegan Lentil Curry
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Vegan Lentil Curry',
    'A hearty and flavorful vegan curry made with red lentils, coconut milk, and aromatic spices.',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    35,
    310,
    6,
    NOW()
  );

DO $$
DECLARE
  recipe3_id uuid;
BEGIN
  -- Get the ID of the third recipe
  SELECT id INTO recipe3_id FROM recipes WHERE title = 'Vegan Lentil Curry';

  -- Insert ingredients for Vegan Lentil Curry
  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe3_id, 'red lentils', 2, 'cups'),
    (recipe3_id, 'coconut milk', 1, 'can'),
    (recipe3_id, 'onion', 1, 'large'),
    (recipe3_id, 'garlic', 3, 'cloves'),
    (recipe3_id, 'ginger', 1, 'tbsp'),
    (recipe3_id, 'curry powder', 2, 'tbsp'),
    (recipe3_id, 'vegetable broth', 2, 'cups');

  -- Insert instructions for Vegan Lentil Curry
  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe3_id, 1, 'Sauté onion, garlic, and ginger'),
    (recipe3_id, 2, 'Add curry powder and cook until fragrant'),
    (recipe3_id, 3, 'Add lentils, coconut milk, and broth'),
    (recipe3_id, 4, 'Simmer for 20-25 minutes until lentils are tender'),
    (recipe3_id, 5, 'Season with salt and pepper to taste');

  -- Insert nutrition info for Vegan Lentil Curry
  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe3_id, 14, 42, 10, 8);

  -- Insert tags for Vegan Lentil Curry
  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe3_id, 'Vegan'),
    (recipe3_id, 'Vegetarian'),
    (recipe3_id, 'High Fiber'),
    (recipe3_id, 'Gluten-Free');
END $$;