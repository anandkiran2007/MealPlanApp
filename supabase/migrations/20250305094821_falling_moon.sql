/*
  # Fix Recipe Tags and RLS Policies

  1. Changes
    - Fix JSONB column default values
    - Update RLS policies to allow recipe creation
    - Add proper indexes for performance
    - Add helper functions for tag operations

  2. Security
    - Enable RLS on recipes table
    - Add policies for authenticated users
    - Allow recipe creation without requiring created_by
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Recipes are readable by all users" ON recipes;
  DROP POLICY IF EXISTS "Users can create own recipes" ON recipes;
  DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Update JSONB columns with proper defaults and constraints
ALTER TABLE recipes
  ALTER COLUMN ingredients SET DEFAULT '[]'::jsonb,
  ALTER COLUMN instructions SET DEFAULT '[]'::jsonb,
  ALTER COLUMN tags SET DEFAULT '[]'::jsonb,
  ALTER COLUMN nutrition SET DEFAULT '{}'::jsonb,
  ALTER COLUMN created_by DROP NOT NULL; -- Allow null for system-generated recipes

-- Add check constraints to ensure valid JSONB arrays
ALTER TABLE recipes
  ADD CONSTRAINT ingredients_is_array CHECK (jsonb_typeof(ingredients) = 'array'),
  ADD CONSTRAINT instructions_is_array CHECK (jsonb_typeof(instructions) = 'array'),
  ADD CONSTRAINT tags_is_array CHECK (jsonb_typeof(tags) = 'array'),
  ADD CONSTRAINT nutrition_is_object CHECK (jsonb_typeof(nutrition) = 'object');

-- Create GIN indexes for efficient searching
DROP INDEX IF EXISTS idx_recipes_tags;
CREATE INDEX idx_recipes_tags ON recipes USING GIN (tags);
CREATE INDEX idx_recipes_title_search ON recipes USING GIN (to_tsvector('english', title));

-- Create helper function for tag operations
CREATE OR REPLACE FUNCTION contains_any_tag(recipe_tags jsonb, search_tags text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM jsonb_array_elements_text(recipe_tags) AS tag
    WHERE tag = ANY(search_tags)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Recipes are readable by authenticated users"
  ON recipes
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can create recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Creator can update recipes"
  ON recipes
  FOR UPDATE
  USING (
    auth.uid() = created_by
    OR created_by IS NULL -- Allow updating system-generated recipes
  );

-- Create indexes for efficient recipe querying
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_recipes_diet_type ON recipes USING GIN (diet_type);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes (rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_prep_time ON recipes (prep_time);
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes (calories);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_recipes_diet_rating ON recipes USING btree (rating DESC) INCLUDE (diet_type);
CREATE INDEX IF NOT EXISTS idx_recipes_tags_rating ON recipes USING btree (rating DESC) INCLUDE (tags);

-- Update existing recipes with proper JSONB format
UPDATE recipes SET
  ingredients = COALESCE(ingredients, '[]'::jsonb),
  instructions = COALESCE(instructions, '[]'::jsonb),
  tags = COALESCE(tags, '[]'::jsonb),
  nutrition = COALESCE(nutrition, '{}'::jsonb);