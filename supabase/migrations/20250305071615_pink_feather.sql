/*
  # Add More Vegetarian Recipes

  This migration adds more vegetarian recipes to ensure we have enough variety for meal planning.
  
  1. New Recipes Added:
    - Spinach and Mushroom Quiche (Vegetarian)
    - Vegetable Stir-Fry with Tofu (Vegetarian)
    - Roasted Vegetable Pasta (Vegetarian)
    - Mediterranean Chickpea Salad (Vegetarian)
    - Vegetable Curry with Rice (Vegetarian)
*/

-- Insert Spinach and Mushroom Quiche
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Spinach and Mushroom Quiche',
    'A delicious vegetarian quiche filled with sautéed mushrooms, spinach, and cheese.',
    'https://images.unsplash.com/photo-1647353337660-8b0c300df1c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    45,
    350,
    6,
    NOW()
  );

DO $$
DECLARE
  recipe_id uuid;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Spinach and Mushroom Quiche';

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe_id, 'pie crust', 1, 'piece'),
    (recipe_id, 'spinach', 300, 'g'),
    (recipe_id, 'mushrooms', 200, 'g'),
    (recipe_id, 'eggs', 4, 'large'),
    (recipe_id, 'milk', 1, 'cup'),
    (recipe_id, 'cheese', 150, 'g'),
    (recipe_id, 'onion', 1, 'medium'),
    (recipe_id, 'garlic', 2, 'cloves');

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Preheat oven to 375°F (190°C)'),
    (recipe_id, 2, 'Sauté mushrooms and onions until golden'),
    (recipe_id, 3, 'Add spinach and cook until wilted'),
    (recipe_id, 4, 'Whisk eggs, milk, and seasonings'),
    (recipe_id, 5, 'Layer vegetables in pie crust'),
    (recipe_id, 6, 'Pour egg mixture and top with cheese'),
    (recipe_id, 7, 'Bake for 35-40 minutes until set');

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe_id, 15, 25, 22, 3);

  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe_id, 'Vegetarian'),
    (recipe_id, 'High Protein'),
    (recipe_id, 'Breakfast');
END $$;

-- Insert Vegetable Stir-Fry with Tofu
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Vegetable Stir-Fry with Tofu',
    'A colorful and protein-rich stir-fry with crispy tofu and fresh vegetables.',
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    30,
    320,
    4,
    NOW()
  );

DO $$
DECLARE
  recipe_id uuid;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Vegetable Stir-Fry with Tofu';

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe_id, 'firm tofu', 400, 'g'),
    (recipe_id, 'broccoli', 2, 'cups'),
    (recipe_id, 'carrots', 2, 'medium'),
    (recipe_id, 'bell peppers', 2, 'medium'),
    (recipe_id, 'snap peas', 1, 'cup'),
    (recipe_id, 'soy sauce', 3, 'tbsp'),
    (recipe_id, 'ginger', 1, 'tbsp'),
    (recipe_id, 'garlic', 3, 'cloves');

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Press and cube tofu'),
    (recipe_id, 2, 'Crisp tofu in pan until golden'),
    (recipe_id, 3, 'Stir-fry vegetables until crisp-tender'),
    (recipe_id, 4, 'Add sauce and simmer'),
    (recipe_id, 5, 'Combine with tofu and serve');

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe_id, 18, 25, 15, 6);

  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe_id, 'Vegetarian'),
    (recipe_id, 'Vegan'),
    (recipe_id, 'High Protein'),
    (recipe_id, 'Gluten-Free');
END $$;

-- Insert Roasted Vegetable Pasta
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Roasted Vegetable Pasta',
    'Whole grain pasta tossed with roasted Mediterranean vegetables and fresh herbs.',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    40,
    380,
    4,
    NOW()
  );

DO $$
DECLARE
  recipe_id uuid;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Roasted Vegetable Pasta';

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe_id, 'whole grain pasta', 400, 'g'),
    (recipe_id, 'cherry tomatoes', 2, 'cups'),
    (recipe_id, 'zucchini', 2, 'medium'),
    (recipe_id, 'eggplant', 1, 'medium'),
    (recipe_id, 'bell peppers', 2, 'medium'),
    (recipe_id, 'olive oil', 3, 'tbsp'),
    (recipe_id, 'garlic', 4, 'cloves'),
    (recipe_id, 'fresh basil', 1, 'cup');

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Preheat oven to 400°F (200°C)'),
    (recipe_id, 2, 'Chop vegetables and toss with oil'),
    (recipe_id, 3, 'Roast vegetables for 25 minutes'),
    (recipe_id, 4, 'Cook pasta according to package'),
    (recipe_id, 5, 'Combine pasta with roasted vegetables'),
    (recipe_id, 6, 'Add fresh herbs and serve');

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe_id, 12, 65, 10, 8);

  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe_id, 'Vegetarian'),
    (recipe_id, 'Vegan'),
    (recipe_id, 'High Fiber');
END $$;

-- Insert Mediterranean Chickpea Salad
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Mediterranean Chickpea Salad',
    'A protein-rich salad with chickpeas, fresh vegetables, and Mediterranean flavors.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    20,
    300,
    4,
    NOW()
  );

DO $$
DECLARE
  recipe_id uuid;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Mediterranean Chickpea Salad';

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe_id, 'chickpeas', 2, 'cans'),
    (recipe_id, 'cucumber', 1, 'large'),
    (recipe_id, 'cherry tomatoes', 2, 'cups'),
    (recipe_id, 'red onion', 1, 'medium'),
    (recipe_id, 'feta cheese', 100, 'g'),
    (recipe_id, 'olive oil', 3, 'tbsp'),
    (recipe_id, 'lemon juice', 2, 'tbsp'),
    (recipe_id, 'fresh parsley', 1, 'cup');

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Drain and rinse chickpeas'),
    (recipe_id, 2, 'Chop vegetables'),
    (recipe_id, 3, 'Combine all ingredients'),
    (recipe_id, 4, 'Make dressing'),
    (recipe_id, 5, 'Toss and serve');

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe_id, 12, 35, 15, 8);

  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe_id, 'Vegetarian'),
    (recipe_id, 'Mediterranean'),
    (recipe_id, 'High Fiber'),
    (recipe_id, 'Gluten-Free');
END $$;

-- Insert Vegetable Curry with Rice
INSERT INTO recipes (id, title, description, image_url, prep_time, calories, servings, created_at) VALUES
  (
    gen_random_uuid(),
    'Vegetable Curry with Rice',
    'A fragrant curry packed with vegetables and served with fluffy basmati rice.',
    'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    35,
    340,
    4,
    NOW()
  );

DO $$
DECLARE
  recipe_id uuid;
BEGIN
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Vegetable Curry with Rice';

  INSERT INTO recipe_ingredients (recipe_id, name, amount, unit) VALUES
    (recipe_id, 'basmati rice', 2, 'cups'),
    (recipe_id, 'cauliflower', 1, 'head'),
    (recipe_id, 'potatoes', 2, 'medium'),
    (recipe_id, 'carrots', 2, 'medium'),
    (recipe_id, 'coconut milk', 1, 'can'),
    (recipe_id, 'curry powder', 2, 'tbsp'),
    (recipe_id, 'onion', 1, 'large'),
    (recipe_id, 'garlic', 3, 'cloves');

  INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Cook rice according to package'),
    (recipe_id, 2, 'Sauté onions and garlic'),
    (recipe_id, 3, 'Add vegetables and spices'),
    (recipe_id, 4, 'Pour in coconut milk and simmer'),
    (recipe_id, 5, 'Cook until vegetables are tender'),
    (recipe_id, 6, 'Serve over rice');

  INSERT INTO recipe_nutrition (recipe_id, protein, carbs, fat, fiber) VALUES
    (recipe_id, 8, 45, 12, 6);

  INSERT INTO recipe_tags (recipe_id, tag) VALUES
    (recipe_id, 'Vegetarian'),
    (recipe_id, 'Vegan'),
    (recipe_id, 'Gluten-Free'),
    (recipe_id, 'High Fiber');
END $$;