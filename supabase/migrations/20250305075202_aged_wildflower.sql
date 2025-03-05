/*
  # Recipe Data Migration

  1. New Data
    - Initial recipe data including:
      - Mediterranean Grilled Chicken Salad
      - Vegetarian Buddha Bowl
      - Salmon with Lemon-Dill Sauce
      - Vegan Lentil Curry
      - Quinoa Buddha Bowl

  2. Structure
    - Each recipe includes:
      - Basic information (title, description, etc.)
      - Ingredients with amounts
      - Step-by-step instructions
      - Nutrition information
      - Tags for categorization

  3. Implementation
    - Uses DO blocks for atomic operations
    - Proper UUID generation
    - Maintains referential integrity
*/

-- Mediterranean Grilled Chicken Salad
DO $$
DECLARE
  recipe_id uuid;
BEGIN
  -- Insert recipe and get its ID
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
  ) RETURNING id INTO recipe_id;

  -- Insert ingredients
  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
  SELECT recipe_id, name, amount, unit
  FROM (VALUES
    ('chicken breasts', 2, 'piece'),
    ('cucumber', 1, 'large'),
    ('cherry tomatoes', 2, 'cups'),
    ('red onion', 1, 'medium'),
    ('Kalamata olives', 1, 'cup'),
    ('feta cheese', 6, 'oz'),
    ('olive oil', 2, 'tbsp'),
    ('lemon', 1, 'piece')
  ) AS i(name, amount, unit);

  -- Insert instructions
  INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
  SELECT recipe_id, step_number, instruction
  FROM (VALUES
    (1, 'Season chicken breasts with salt, pepper, and oregano'),
    (2, 'Grill chicken for 6-7 minutes per side until cooked through'),
    (3, 'Dice cucumber, halve tomatoes, and slice red onion'),
    (4, 'Combine vegetables in a large bowl'),
    (5, 'Slice grilled chicken and add to the bowl'),
    (6, 'Add olives and crumbled feta cheese'),
    (7, 'Drizzle with olive oil and lemon juice')
  ) AS i(step_number, instruction);

  -- Insert nutrition info
  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
  VALUES (recipe_id, 35, 12, 28, 4);

  -- Insert tags
  INSERT INTO recipe_tags (recipe_id, tag)
  SELECT recipe_id, tag
  FROM unnest(ARRAY['Mediterranean', 'High Protein', 'Gluten-Free']) AS t(tag);
END $$;

-- Vegetarian Buddha Bowl
DO $$
DECLARE
  recipe_id uuid;
BEGIN
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
  ) RETURNING id INTO recipe_id;

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
  SELECT recipe_id, name, amount, unit
  FROM (VALUES
    ('quinoa', 1, 'cup'),
    ('sweet potato', 1, 'large'),
    ('broccoli florets', 1, 'cup'),
    ('red bell pepper', 1, 'piece'),
    ('chickpeas', 1, 'can'),
    ('avocado', 1, 'piece'),
    ('tahini', 2, 'tbsp')
  ) AS i(name, amount, unit);

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
  SELECT recipe_id, step_number, instruction
  FROM (VALUES
    (1, 'Cook quinoa according to package instructions'),
    (2, 'Roast sweet potato and broccoli with olive oil'),
    (3, 'Drain and rinse chickpeas'),
    (4, 'Make tahini dressing'),
    (5, 'Assemble bowls with quinoa base'),
    (6, 'Top with roasted vegetables and chickpeas'),
    (7, 'Add sliced avocado and drizzle with dressing')
  ) AS i(step_number, instruction);

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
  VALUES (recipe_id, 15, 52, 18, 12);

  INSERT INTO recipe_tags (recipe_id, tag)
  SELECT recipe_id, tag
  FROM unnest(ARRAY['Vegetarian', 'Vegan', 'High Fiber', 'Gluten-Free']) AS t(tag);
END $$;

-- Salmon with Lemon-Dill Sauce
DO $$
DECLARE
  recipe_id uuid;
BEGIN
  INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at)
  VALUES (
    gen_random_uuid(),
    'Salmon with Lemon-Dill Sauce',
    'Perfectly seared salmon fillets topped with a creamy lemon-dill sauce.',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    20,
    350,
    4,
    NOW()
  ) RETURNING id INTO recipe_id;

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
  SELECT recipe_id, name, amount, unit
  FROM (VALUES
    ('salmon fillets', 4, 'piece'),
    ('Greek yogurt', 0.25, 'cup'),
    ('fresh dill', 2, 'tbsp'),
    ('lemon', 1, 'piece'),
    ('garlic', 1, 'clove'),
    ('capers', 1, 'tbsp')
  ) AS i(name, amount, unit);

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
  SELECT recipe_id, step_number, instruction
  FROM (VALUES
    (1, 'Season salmon fillets with salt and pepper'),
    (2, 'Sear salmon skin-side down for 4 minutes'),
    (3, 'Flip and cook for another 3-4 minutes'),
    (4, 'Mix yogurt, dill, lemon juice, and garlic for sauce'),
    (5, 'Add capers to the sauce and mix well'),
    (6, 'Serve salmon topped with the sauce')
  ) AS i(step_number, instruction);

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
  VALUES (recipe_id, 29, 3, 22, 0);

  INSERT INTO recipe_tags (recipe_id, tag)
  SELECT recipe_id, tag
  FROM unnest(ARRAY['High Protein', 'Low Carb', 'Gluten-Free', 'Quick Meal']) AS t(tag);
END $$;

-- Vegan Lentil Curry
DO $$
DECLARE
  recipe_id uuid;
BEGIN
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
  ) RETURNING id INTO recipe_id;

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
  SELECT recipe_id, name, amount, unit
  FROM (VALUES
    ('red lentils', 2, 'cups'),
    ('coconut milk', 1, 'can'),
    ('onion', 1, 'large'),
    ('garlic', 3, 'cloves'),
    ('ginger', 1, 'tbsp'),
    ('curry powder', 2, 'tbsp'),
    ('vegetable broth', 2, 'cups')
  ) AS i(name, amount, unit);

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
  SELECT recipe_id, step_number, instruction
  FROM (VALUES
    (1, 'Sauté onion, garlic, and ginger'),
    (2, 'Add curry powder and cook until fragrant'),
    (3, 'Add lentils, coconut milk, and broth'),
    (4, 'Simmer for 20-25 minutes until lentils are tender'),
    (5, 'Season with salt and pepper to taste')
  ) AS i(step_number, instruction);

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
  VALUES (recipe_id, 14, 42, 10, 8);

  INSERT INTO recipe_tags (recipe_id, tag)
  SELECT recipe_id, tag
  FROM unnest(ARRAY['Vegan', 'Vegetarian', 'High Fiber', 'Gluten-Free']) AS t(tag);
END $$;

-- Quinoa Buddha Bowl
DO $$
DECLARE
  recipe_id uuid;
BEGIN
  INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at)
  VALUES (
    gen_random_uuid(),
    'Quinoa Buddha Bowl',
    'A nourishing vegetarian bowl with quinoa, roasted vegetables, and tahini dressing.',
    'https://images.unsplash.com/photo-1543339318-b43dc53e19b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    25,
    350,
    4,
    NOW()
  ) RETURNING id INTO recipe_id;

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit)
  SELECT recipe_id, name, amount, unit
  FROM (VALUES
    ('quinoa', 1, 'cup'),
    ('sweet potatoes', 2, 'medium'),
    ('broccoli florets', 2, 'cups'),
    ('chickpeas', 1, 'can'),
    ('olive oil', 2, 'tbsp'),
    ('avocado', 1, 'piece'),
    ('tahini', 2, 'tbsp')
  ) AS i(name, amount, unit);

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction)
  SELECT recipe_id, step_number, instruction
  FROM (VALUES
    (1, 'Cook quinoa according to package instructions'),
    (2, 'Roast sweet potatoes and broccoli'),
    (3, 'Season chickpeas and warm them'),
    (4, 'Make tahini dressing with lemon juice'),
    (5, 'Assemble bowls with all ingredients'),
    (6, 'Top with sliced avocado and dressing')
  ) AS i(step_number, instruction);

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber)
  VALUES (recipe_id, 15, 45, 18, 12);

  INSERT INTO recipe_tags (recipe_id, tag)
  SELECT recipe_id, tag
  FROM unnest(ARRAY['Vegetarian', 'Vegan', 'High Fiber']) AS t(tag);
END $$;