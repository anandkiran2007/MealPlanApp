/*
  # Initial Schema Setup for Meal Planner

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
      - updated_at (timestamp)
      - name (text)
      - family_size (integer)
    
    - recipes
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - image_url (text)
      - prep_time (integer)
      - calories (integer)
      - servings (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
      - created_by (uuid, references users)
    
    - recipe_ingredients
      - id (uuid, primary key)
      - recipe_id (uuid, references recipes)
      - name (text)
      - amount (decimal)
      - unit (text)
      - created_at (timestamp)
    
    - recipe_instructions
      - id (uuid, primary key)
      - recipe_id (uuid, references recipes)
      - step_number (integer)
      - instruction (text)
      - created_at (timestamp)
    
    - recipe_nutrition
      - id (uuid, primary key)
      - recipe_id (uuid, references recipes)
      - protein (decimal)
      - carbs (decimal)
      - fat (decimal)
      - fiber (decimal)
      - created_at (timestamp)
    
    - recipe_tags
      - recipe_id (uuid, references recipes)
      - tag (text)
      - PRIMARY KEY (recipe_id, tag)
    
    - meal_plans
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - title (text)
      - description (text)
      - duration_days (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - meal_plan_days
      - id (uuid, primary key)
      - meal_plan_id (uuid, references meal_plans)
      - day_number (integer)
      - breakfast_recipe_id (uuid, references recipes)
      - lunch_recipe_id (uuid, references recipes)
      - dinner_recipe_id (uuid, references recipes)
      - created_at (timestamp)
    
    - shopping_lists
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - meal_plan_id (uuid, references meal_plans)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - shopping_list_items
      - id (uuid, primary key)
      - shopping_list_id (uuid, references shopping_lists)
      - ingredient_name (text)
      - amount (decimal)
      - unit (text)
      - completed (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  family_size integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  prep_time integer,
  calories integer,
  servings integer DEFAULT 1,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount decimal,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_instructions table
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_nutrition table
CREATE TABLE recipe_nutrition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  protein decimal,
  carbs decimal,
  fat decimal,
  fiber decimal,
  created_at timestamptz DEFAULT now()
);

-- Create recipe_tags table
CREATE TABLE recipe_tags (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);

-- Create meal_plans table
CREATE TABLE meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  duration_days integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meal_plan_days table
CREATE TABLE meal_plan_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  breakfast_recipe_id uuid REFERENCES recipes(id),
  lunch_recipe_id uuid REFERENCES recipes(id),
  dinner_recipe_id uuid REFERENCES recipes(id),
  created_at timestamptz DEFAULT now()
);

-- Create shopping_lists table
CREATE TABLE shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  meal_plan_id uuid REFERENCES meal_plans(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shopping_list_items table
CREATE TABLE shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  amount decimal,
  unit text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read and update their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Recipes are readable by all authenticated users
CREATE POLICY "Recipes are readable by all users" ON recipes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create and update their own recipes
CREATE POLICY "Users can create own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = created_by);

-- Recipe related tables inherit the same policies as recipes
CREATE POLICY "Inherit recipe access for ingredients" ON recipe_ingredients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE id = recipe_ingredients.recipe_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Inherit recipe access for instructions" ON recipe_instructions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE id = recipe_instructions.recipe_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Inherit recipe access for nutrition" ON recipe_nutrition
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE id = recipe_nutrition.recipe_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Inherit recipe access for tags" ON recipe_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE id = recipe_tags.recipe_id
      AND created_by = auth.uid()
    )
  );

-- Meal plans are managed by their owners
CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own meal plan days" ON meal_plan_days
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE id = meal_plan_days.meal_plan_id
      AND user_id = auth.uid()
    )
  );

-- Shopping lists are managed by their owners
CREATE POLICY "Users can manage own shopping lists" ON shopping_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own shopping list items" ON shopping_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE id = shopping_list_items.shopping_list_id
      AND user_id = auth.uid()
    )
  );