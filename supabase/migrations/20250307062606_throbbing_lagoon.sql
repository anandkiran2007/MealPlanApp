/*
  # Add RLS policies for recipes table

  1. Security Changes
    - Enable RLS on recipes table
    - Add policies for:
      - Anyone can read recipes
      - Authenticated users can create recipes
      - Recipe creators can update their own recipes
      - Admins can manage all recipes
*/

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read recipes
CREATE POLICY "Anyone can read recipes"
ON recipes
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to create recipes
CREATE POLICY "Authenticated users can create recipes"
ON recipes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own recipes
CREATE POLICY "Users can update own recipes"
ON recipes
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own recipes
CREATE POLICY "Users can delete own recipes"
ON recipes
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- For the import script, we'll create a special policy
CREATE POLICY "Service role can manage all recipes"
ON recipes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);