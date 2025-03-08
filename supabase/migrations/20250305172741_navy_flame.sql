-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add new columns for recipe dataset integration
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS external_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS cuisine_type text,
  ADD COLUMN IF NOT EXISTS diet_type text[],
  ADD COLUMN IF NOT EXISTS cooking_method text[],
  ADD COLUMN IF NOT EXISTS difficulty_level text,
  ADD COLUMN IF NOT EXISTS total_time interval,
  ADD COLUMN IF NOT EXISTS rating decimal,
  ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS equipment jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seasonal_availability text[];

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes (cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_diet ON recipes USING GIN (diet_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes (difficulty_level);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes (rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_title_trgm ON recipes USING GIN (title gin_trgm_ops);

-- Create a function to search recipes with multiple criteria
CREATE OR REPLACE FUNCTION search_recipes(
  search_query text DEFAULT NULL,
  cuisines text[] DEFAULT NULL,
  diets text[] DEFAULT NULL,
  max_time interval DEFAULT NULL,
  min_rating decimal DEFAULT NULL,
  tags text[] DEFAULT NULL
) RETURNS SETOF recipes AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM recipes
  WHERE
    (search_query IS NULL OR 
     title ILIKE '%' || search_query || '%' OR
     to_tsvector('english', description) @@ to_tsquery('english', search_query))
    AND (cuisines IS NULL OR cuisine_type = ANY(cuisines))
    AND (diets IS NULL OR diet_type && diets)
    AND (max_time IS NULL OR total_time <= max_time)
    AND (min_rating IS NULL OR rating >= min_rating)
    AND (tags IS NULL OR tags::jsonb ?| tags)
  ORDER BY
    CASE WHEN search_query IS NOT NULL 
      THEN word_similarity(search_query, title)
      ELSE 1
    END DESC,
    rating DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Create a function to find similar recipes
CREATE OR REPLACE FUNCTION find_similar_recipes(
  recipe_id uuid,
  limit_count integer DEFAULT 5
) RETURNS TABLE (
  id uuid,
  title text,
  similarity_score float
) AS $$
DECLARE
  source_title text;
  source_tags jsonb;
BEGIN
  -- Get the source recipe's title and tags
  SELECT title, tags INTO source_title, source_tags
  FROM recipes
  WHERE id = recipe_id;

  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    (
      word_similarity(r.title, source_title) * 0.5 +
      COALESCE(array_length(ARRAY(
        SELECT UNNEST(r.tags::text[]) 
        INTERSECT 
        SELECT UNNEST(source_tags::text[])
      ), 1)::float / GREATEST(
        jsonb_array_length(r.tags),
        jsonb_array_length(source_tags)
      ), 0) * 0.5
    )::float as similarity_score
  FROM recipes r
  WHERE r.id != recipe_id
  ORDER BY similarity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Add function to get personalized recommendations
CREATE OR REPLACE FUNCTION get_personalized_recommendations(
  user_id uuid,
  preference_tags text[],
  excluded_ingredients text[] DEFAULT NULL
) RETURNS TABLE (
  id uuid,
  title text,
  match_score decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    (
      -- Calculate match score based on multiple factors
      CASE WHEN r.tags::jsonb ?| preference_tags THEN 0.5 ELSE 0 END +
      CASE WHEN excluded_ingredients IS NULL OR NOT (r.ingredients::jsonb ?| excluded_ingredients) THEN 0.3 ELSE 0 END +
      COALESCE(r.rating, 0) * 0.2
    )::decimal as match_score
  FROM recipes r
  WHERE r.id IN (
    SELECT id FROM recipes
    WHERE tags::jsonb ?| preference_tags
    OR NOT (ingredients::jsonb ?| COALESCE(excluded_ingredients, ARRAY[]::text[]))
  )
  ORDER BY match_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Create a function to bulk import recipes
CREATE OR REPLACE FUNCTION import_recipes(recipes_json jsonb)
RETURNS void AS $$
BEGIN
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
    r->>'external_id',
    r->>'title',
    r->>'description',
    r->>'image_url',
    (r->>'prep_time')::integer,
    (r->>'calories')::integer,
    (r->>'servings')::integer,
    r->'ingredients',
    r->'instructions',
    r->'tags',
    r->'nutrition',
    r->>'cuisine_type',
    ARRAY(SELECT jsonb_array_elements_text(r->'diet_type')),
    ARRAY(SELECT jsonb_array_elements_text(r->'cooking_method')),
    r->>'difficulty_level',
    (r->>'total_time')::interval,
    (r->>'rating')::decimal,
    (r->>'review_count')::integer,
    r->'equipment',
    ARRAY(SELECT jsonb_array_elements_text(r->'seasonal_availability'))
  FROM jsonb_array_elements(recipes_json) AS r
  ON CONFLICT (external_id) DO UPDATE
  SET
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
END;
$$ LANGUAGE plpgsql;