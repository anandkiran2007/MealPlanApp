/*
  # Update Recipe Schema

  1. Changes
    - Add JSONB columns for ingredients, instructions, and tags to recipes table
    - Add nutrition column to recipes table
    - Update existing recipes to use new columns

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to recipes table
ALTER TABLE recipes 
  ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS nutrition JSONB DEFAULT '{}';

-- Drop old tables that are no longer needed
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipe_instructions CASCADE;
DROP TABLE IF EXISTS recipe_nutrition CASCADE;
DROP TABLE IF EXISTS recipe_tags CASCADE;

-- Update existing recipes with default values
UPDATE recipes SET
  ingredients = '[]'::jsonb WHERE ingredients IS NULL;

UPDATE recipes SET
  instructions = '[]'::jsonb WHERE instructions IS NULL;

UPDATE recipes SET
  tags = '[]'::jsonb WHERE tags IS NULL;

UPDATE recipes SET
  nutrition = '{}'::jsonb WHERE nutrition IS NULL;

-- Add index for tags search
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING gin (tags);

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Recipes are readable by all users" ON recipes;
  DROP POLICY IF EXISTS "Users can create own recipes" ON recipes;
  DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Update RLS policies for the new columns
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Recipes are readable by all authenticated users
CREATE POLICY "Recipes are readable by all users" ON recipes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can create and update their own recipes
CREATE POLICY "Users can create own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = created_by);