-- Create a temporary table for recipe import
CREATE TEMP TABLE temp_recipes (
  external_id text,
  title text,
  description text,
  image_url text,
  prep_time integer,
  calories integer,
  servings integer,
  ingredients jsonb,
  instructions jsonb,
  tags jsonb,
  nutrition jsonb,
  cuisine_type text,
  diet_type text[],
  cooking_method text[],
  difficulty_level text,
  total_time interval,
  rating decimal,
  review_count integer,
  equipment jsonb,
  seasonal_availability text[]
);

-- Insert recipe data
INSERT INTO temp_recipes (
  external_id,
  title,
  description,
  image_url,
  prep_time,
  calories,
  servings,
  ingredients,
  instructions,
  tags,
  nutrition,
  cuisine_type,
  diet_type,
  cooking_method,
  difficulty_level,
  total_time,
  rating,
  review_count,
  equipment,
  seasonal_availability
) VALUES
-- No-Bake Nut Cookies
(
  'Gathered_Tm8tQmFrZSBOdXQgQ29va2llcw',
  'No-Bake Nut Cookies',
  'A delicious no-bake cookie recipe with nuts, brown sugar, and cereal',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
  32,
  691,
  4,
  jsonb_build_array(
    '1 c. firmly packed brown sugar',
    '1/2 c. evaporated milk',
    '1/2 tsp. vanilla',
    '1/2 c. broken nuts (pecans)',
    '2 Tbsp. butter or margarine',
    '3 1/2 c. bite size shredded rice biscuits'
  ),
  jsonb_build_array(
    'In a heavy 2-quart saucepan, mix brown sugar, nuts, evaporated milk and butter or margarine',
    'Stir over medium heat until mixture bubbles all over top',
    'Boil and stir 5 minutes more',
    'Take off heat',
    'Stir in vanilla and cereal; mix well',
    'Using 2 teaspoons, drop and shape into 30 clusters on wax paper',
    'Let stand until firm, about 30 minutes'
  ),
  jsonb_build_array('No-Bake', 'Dessert', 'Quick', 'Kid-Friendly'),
  jsonb_build_object(
    'protein', '5g',
    'carbs', '45g',
    'fat', '12g',
    'fiber', '2g'
  ),
  'American',
  ARRAY['Vegetarian'],
  ARRAY['No-Cook'],
  'Easy',
  interval '45 minutes',
  4.5,
  12,
  jsonb_build_array('Saucepan', 'Measuring Cups', 'Wax Paper'),
  ARRAY['All-Season']
),

-- Mediterranean Grilled Chicken Salad
(
  'Gathered_TWVkaXRlcnJhbmVhbiBHcmlsbGVkQ2hpY2tlblNhbGFk',
  'Mediterranean Grilled Chicken Salad',
  'A fresh and healthy Mediterranean salad with grilled chicken, vegetables, and feta cheese',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  30,
  420,
  4,
  jsonb_build_array(
    '2 boneless chicken breasts',
    '1 large cucumber',
    '2 cups cherry tomatoes',
    '1 red onion',
    '1 cup Kalamata olives',
    '6 oz feta cheese',
    '2 tbsp olive oil',
    '1 lemon'
  ),
  jsonb_build_array(
    'Season chicken breasts with salt, pepper, and oregano',
    'Grill chicken for 6-7 minutes per side until cooked through',
    'Let rest for 5 minutes, then slice',
    'In a large bowl, combine cucumber, tomatoes, red onion, and olives',
    'Add sliced chicken to the salad, drizzle with dressing, and toss to combine',
    'Top with crumbled feta cheese and serve immediately'
  ),
  jsonb_build_array('Mediterranean', 'High Protein', 'Salad', 'Gluten-Free'),
  jsonb_build_object(
    'protein', '35g',
    'carbs', '12g',
    'fat', '28g',
    'fiber', '4g'
  ),
  'Mediterranean',
  ARRAY['High Protein', 'Gluten-Free'],
  ARRAY['Grilled'],
  'Medium',
  interval '40 minutes',
  4.8,
  24,
  jsonb_build_array('Grill', 'Mixing Bowl', 'Cutting Board'),
  ARRAY['Summer', 'Spring']
);

-- Import data from temporary table to recipes table
INSERT INTO recipes (
  external_id,
  title,
  description,
  image_url,
  prep_time,
  calories,
  servings,
  ingredients,
  instructions,
  tags,
  nutrition,
  cuisine_type,
  diet_type,
  cooking_method,
  difficulty_level,
  total_time,
  rating,
  review_count,
  equipment,
  seasonal_availability
)
SELECT
  external_id,
  title,
  description,
  image_url,
  prep_time,
  calories,
  servings,
  ingredients,
  instructions,
  tags,
  nutrition,
  cuisine_type,
  diet_type,
  cooking_method,
  difficulty_level,
  total_time,
  rating,
  review_count,
  equipment,
  seasonal_availability
FROM temp_recipes
ON CONFLICT (external_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  prep_time = EXCLUDED.prep_time,
  calories = EXCLUDED.calories,
  servings = EXCLUDED.servings,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions,
  tags = EXCLUDED.tags,
  nutrition = EXCLUDED.nutrition,
  cuisine_type = EXCLUDED.cuisine_type,
  diet_type = EXCLUDED.diet_type,
  cooking_method = EXCLUDED.cooking_method,
  difficulty_level = EXCLUDED.difficulty_level,
  total_time = EXCLUDED.total_time,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  equipment = EXCLUDED.equipment,
  seasonal_availability = EXCLUDED.seasonal_availability;

-- Drop temporary table
DROP TABLE temp_recipes;