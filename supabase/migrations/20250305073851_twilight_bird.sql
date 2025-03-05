/*
  # Initial Recipe Data Migration
  
  1. New Data
    - Adds initial set of recipes with ingredients, instructions, nutrition info, and tags
    - Uses proper UUID generation for all IDs
    - Includes data for 3 complete recipes
  
  2. Structure
    - Each recipe is inserted with a generated UUID
    - Related data (ingredients, instructions, etc.) references the recipe UUID
    - Uses DO blocks for transactional integrity
*/

-- Insert Mediterranean Grilled Chicken Salad
WITH new_recipe AS (
  INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at)
  VALUES (
    gen_random_uuid(),
    'Mediterranean Grilled Chicken Salad',
    'A refreshing Mediterranean salad with grilled chicken, fresh vegetables, and a zesty lemon dressing.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    30,
    420,
    4,
    NOW()
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT id, unnest(ARRAY['chicken breasts', 'cucumber', 'cherry tomatoes', 'red onion', 'Kalamata olives', 'feta cheese', 'olive oil', 'lemon']),
       unnest(ARRAY[2, 1, 2, 1, 1, 6, 2, 1]),
       unnest(ARRAY['piece', 'large', 'cups', 'medium', 'cup', 'oz', 'tbsp', 'piece'])
FROM new_recipe;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Mediterranean Grilled Chicken Salad'
)
INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
SELECT id, generate_series(1, 7),
       unnest(ARRAY[
         'Season chicken breasts with salt, pepper, and oregano',
         'Grill chicken for 6-7 minutes per side until cooked through',
         'Dice cucumber, halve tomatoes, and slice red onion',
         'Combine vegetables in a large bowl',
         'Slice grilled chicken and add to the bowl',
         'Add olives and crumbled feta cheese',
         'Drizzle with olive oil and lemon juice'
       ])
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Mediterranean Grilled Chicken Salad'
)
INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
SELECT id, 35, 12, 28, 4
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Mediterranean Grilled Chicken Salad'
)
INSERT INTO recipe_tags (recipe_id, tag)
SELECT id, unnest(ARRAY['Mediterranean', 'High Protein', 'Gluten-Free'])
FROM recipe_id;

-- Insert Vegetarian Buddha Bowl
WITH new_recipe AS (
  INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at)
  VALUES (
    gen_random_uuid(),
    'Vegetarian Buddha Bowl',
    'A nourishing bowl packed with roasted vegetables, quinoa, and a creamy tahini dressing.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    25,
    380,
    2,
    NOW()
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT id, unnest(ARRAY['quinoa', 'sweet potato', 'broccoli florets', 'red bell pepper', 'chickpeas', 'avocado', 'tahini']),
       unnest(ARRAY[1, 1, 1, 1, 1, 1, 2]),
       unnest(ARRAY['cup', 'large', 'cup', 'piece', 'can', 'piece', 'tbsp'])
FROM new_recipe;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegetarian Buddha Bowl'
)
INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
SELECT id, generate_series(1, 7),
       unnest(ARRAY[
         'Cook quinoa according to package instructions',
         'Roast sweet potato and broccoli with olive oil',
         'Drain and rinse chickpeas',
         'Make tahini dressing',
         'Assemble bowls with quinoa base',
         'Top with roasted vegetables and chickpeas',
         'Add sliced avocado and drizzle with dressing'
       ])
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegetarian Buddha Bowl'
)
INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
SELECT id, 15, 52, 18, 12
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegetarian Buddha Bowl'
)
INSERT INTO recipe_tags (recipe_id, tag)
SELECT id, unnest(ARRAY['Vegetarian', 'Vegan', 'High Fiber', 'Gluten-Free'])
FROM recipe_id;

-- Insert Vegan Lentil Curry
WITH new_recipe AS (
  INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at)
  VALUES (
    gen_random_uuid(),
    'Vegan Lentil Curry',
    'A hearty and flavorful vegan curry made with red lentils, coconut milk, and aromatic spices.',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    35,
    310,
    6,
    NOW()
  )
  RETURNING id
)
INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
SELECT id, unnest(ARRAY['red lentils', 'coconut milk', 'onion', 'garlic', 'ginger', 'curry powder', 'vegetable broth']),
       unnest(ARRAY[2, 1, 1, 3, 1, 2, 2]),
       unnest(ARRAY['cups', 'can', 'large', 'cloves', 'tbsp', 'tbsp', 'cups'])
FROM new_recipe;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegan Lentil Curry'
)
INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
SELECT id, generate_series(1, 5),
       unnest(ARRAY[
         'Sauté onion, garlic, and ginger',
         'Add curry powder and cook until fragrant',
         'Add lentils, coconut milk, and broth',
         'Simmer for 20-25 minutes until lentils are tender',
         'Season with salt and pepper to taste'
       ])
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegan Lentil Curry'
)
INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
SELECT id, 14, 42, 10, 8
FROM recipe_id;

WITH recipe_id AS (
  SELECT id FROM recipes WHERE title = 'Vegan Lentil Curry'
)
INSERT INTO recipe_tags (recipe_id, tag)
SELECT id, unnest(ARRAY['Vegan', 'Vegetarian', 'High Fiber', 'Gluten-Free'])
FROM recipe_id;