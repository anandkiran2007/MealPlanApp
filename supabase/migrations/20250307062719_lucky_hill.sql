/*
  # Update Recipe Policies

  1. Security Changes
    - Enable RLS on recipes table (if not already enabled)
    - Add or update policies for:
      - Public read access
      - Service role full access
      - Anonymous user insert access
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'recipes' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies to ensure clean state
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Anyone can read recipes') THEN
    DROP POLICY "Anyone can read recipes" ON recipes;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Service role has full access') THEN
    DROP POLICY "Service role has full access" ON recipes;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'System can import recipes') THEN
    DROP POLICY "System can import recipes" ON recipes;
  END IF;
END $$;

-- Recreate policies
CREATE POLICY "Anyone can read recipes"
ON recipes
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role has full access"
ON recipes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "System can import recipes"
ON recipes
FOR INSERT
TO anon
WITH CHECK (true);