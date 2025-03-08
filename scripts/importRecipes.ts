import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Configuration
const CHUNK_SIZE = 50; // Reduced chunk size for better reliability
const RATE_LIMIT_DELAY = 2000; // Increased delay between chunks

interface RawRecipe {
  title: string;
  ingredients: string[];
  directions: string[];
  link: string;
  source: string;
  NER: string[];
}

interface RecipeData {
  external_id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  calories: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  cuisine_type?: string;
  diet_type?: string[];
  cooking_method?: string[];
  difficulty_level?: string;
  total_time?: string;
  rating?: number | null;
  review_count?: number;
  equipment?: string[];
  seasonal_availability?: string[];
}

function validateRecipe(recipe: any): recipe is RawRecipe {
  return (
    typeof recipe === 'object' &&
    recipe !== null &&
    typeof recipe.title === 'string' &&
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.directions) &&
    typeof recipe.link === 'string' &&
    typeof recipe.source === 'string' &&
    Array.isArray(recipe.NER)
  );
}

function estimateCalories(ingredients: string[]): number {
  let baseCalories = 200;
  ingredients.forEach(ingredient => {
    const lower = ingredient.toLowerCase();
    if (lower.includes('meat') || lower.includes('chicken') || lower.includes('fish')) {
      baseCalories += 150;
    } else if (lower.includes('oil') || lower.includes('butter')) {
      baseCalories += 100;
    } else if (lower.includes('sugar') || lower.includes('honey')) {
      baseCalories += 50;
    } else if (lower.includes('vegetable') || lower.includes('fruit')) {
      baseCalories += 30;
    } else {
      baseCalories += 40;
    }
  });
  return Math.floor(baseCalories + (Math.random() * 100 - 50));
}

function estimatePrepTime(instructions: string[]): number {
  let baseTime = 10;
  instructions.forEach(step => {
    const lower = step.toLowerCase();
    if (lower.includes('bake') || lower.includes('roast')) {
      baseTime += 30;
    } else if (lower.includes('simmer') || lower.includes('boil')) {
      baseTime += 20;
    } else if (lower.includes('chop') || lower.includes('dice')) {
      baseTime += 5;
    } else if (lower.includes('marinate')) {
      baseTime += 60;
    } else {
      baseTime += 5;
    }
  });
  return Math.max(10, Math.min(120, baseTime));
}

function extractTags(ingredients: string[], ner: string[]): string[] {
  if (!Array.isArray(ingredients) || !Array.isArray(ner)) {
    return ['Other'];
  }
  const tags = new Set<string>();
  const ingredientsText = ingredients.join(' ').toLowerCase();
  const nerText = ner.join(' ').toLowerCase();

  if (ingredientsText.match(/\b(meat|chicken|beef|pork|fish)\b/)) {
    tags.add('Non-Vegetarian');
  } else {
    tags.add('Vegetarian');
    if (!ingredientsText.match(/\b(egg|milk|cheese|cream|butter|honey)\b/)) {
      tags.add('Vegan');
    }
  }
  if (!ingredientsText.match(/\b(wheat|flour|bread|pasta)\b/)) {
    tags.add('Gluten-Free');
  }
  if (!ingredientsText.match(/\b(milk|cheese|cream|yogurt)\b/)) {
    tags.add('Dairy-Free');
  }
  if (ingredientsText.match(/\b(quinoa|brown rice|oats|whole grain)\b/)) {
    tags.add('Whole Grain');
  }
  if (nerText.match(/\b(bake|roast|oven)\b/)) {
    tags.add('Baked');
  }
  if (nerText.match(/\b(grill|barbecue|bbq)\b/)) {
    tags.add('Grilled');
  }
  if (nerText.match(/\b(fry|sauté|pan-fry)\b/)) {
    tags.add('Fried');
  }
  if (nerText.match(/\b(no.?bake|raw)\b/)) {
    tags.add('No-Cook');
  }
  if (nerText.match(/\b(slow.?cook|simmer|braise)\b/)) {
    tags.add('Slow-Cooked');
  }
  if (ingredientsText.match(/\b(breakfast|cereal|pancake|waffle)\b/)) {
    tags.add('Breakfast');
  }
  if (ingredientsText.match(/\b(sandwich|wrap|salad)\b/)) {
    tags.add('Lunch');
  }
  if (ingredientsText.match(/\b(dinner|roast|steak|curry)\b/)) {
    tags.add('Dinner');
  }
  if (ingredientsText.match(/\b(cookie|cake|dessert|sweet)\b/)) {
    tags.add('Dessert');
  }
  if (ingredientsText.match(/\b(snack|popcorn|chips)\b/)) {
    tags.add('Snack');
  }
  if (ingredientsText.match(/\b(protein|chicken breast|fish|tofu|lentils)\b/)) {
    tags.add('High Protein');
  }
  if (ingredientsText.match(/\b(vegetables|salad|greens)\b/)) {
    tags.add('Healthy');
  }
  if (!ingredientsText.match(/\b(sugar|sweet|dessert)\b/)) {
    tags.add('Low Sugar');
  }
  const complexity = ingredients.length + ner.length;
  if (complexity < 8) tags.add('Easy');
  else if (complexity < 15) tags.add('Medium');
  else tags.add('Advanced');
  return Array.from(tags);
}

function generateDescription(title: string, ingredients: string[]): string {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return `A delicious ${title.toLowerCase()} recipe.`;
  }
  const mainIngredients = ingredients
    .slice(0, 3)
    .map(i => i.split(',')[0].split('(')[0].trim().toLowerCase());
  return `A delicious ${title.toLowerCase()} recipe made with ${mainIngredients.join(', ')}${
    ingredients.length > 3 ? ' and more' : ''
  }.`;
}

function detectCuisineType(ingredients: string[], title: string): string {
  const searchText = `${title} ${ingredients.join(' ')}`.toLowerCase();
  const cuisinePatterns = {
    'Italian': /\b(pasta|pizza|risotto|parmesan|mozzarella|italian)\b/,
    'Mexican': /\b(tortilla|taco|enchilada|salsa|guacamole|mexican)\b/,
    'Chinese': /\b(soy sauce|ginger|sesame|wok|stir.?fry|chinese)\b/,
    'Japanese': /\b(sushi|miso|wasabi|teriyaki|japanese)\b/,
    'Indian': /\b(curry|masala|turmeric|cumin|coriander|indian)\b/,
    'Mediterranean': /\b(olive oil|feta|hummus|pita|tahini|mediterranean)\b/,
    'Thai': /\b(coconut milk|thai curry|fish sauce|lemongrass|thai)\b/,
    'French': /\b(baguette|croissant|ratatouille|french)\b/,
    'American': /\b(burger|hot dog|mac and cheese|american)\b/
  };
  for (const [cuisine, pattern] of Object.entries(cuisinePatterns)) {
    if (pattern.test(searchText)) {
      return cuisine;
    }
  }
  return 'International';
}

function detectEquipment(instructions: string[]): string[] {
  if (!Array.isArray(instructions)) return [];
  const instructionsText = instructions.join(' ').toLowerCase();
  const equipment = new Set<string>();
  const equipmentPatterns = {
    'Oven': /\b(oven|bake|roast)\b/,
    'Stovetop': /\b(stove|pan|pot|skillet)\b/,
    'Mixing Bowl': /\b(bowl|mix|whisk|combine)\b/,
    'Blender': /\b(blend|puree|smoothie)\b/,
    'Food Processor': /\b(process|pulse|grind)\b/,
    'Knife': /\b(chop|dice|slice|cut)\b/,
    'Cutting Board': /\b(chop|dice|slice|cut)\b/,
    'Measuring Cups': /\b(cup|tablespoon|teaspoon|measure)\b/,
    'Baking Sheet': /\b(baking sheet|sheet pan|tray)\b/,
    'Grater': /\b(grate|shred)\b/,
    'Colander': /\b(drain|strain|rinse)\b/,
    'Whisk': /\b(whisk|beat|whip)\b/
  };
  for (const [item, pattern] of Object.entries(equipmentPatterns)) {
    if (pattern.test(instructionsText)) {
      equipment.add(item);
    }
  }
  return Array.from(equipment);
}

function transformRecipe(rawRecipe: RawRecipe): RecipeData {
  if (!validateRecipe(rawRecipe)) {
    throw new Error('Invalid recipe format');
  }
  const externalId = Buffer.from(`${rawRecipe.source}_${rawRecipe.title}`).toString('base64');
  const tags = extractTags(rawRecipe.ingredients, rawRecipe.NER);
  const prepTime = estimatePrepTime(rawRecipe.directions);
  const calories = estimateCalories(rawRecipe.ingredients);
  return {
    external_id: externalId,
    title: rawRecipe.title,
    description: generateDescription(rawRecipe.title, rawRecipe.ingredients),
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    prep_time: prepTime,
    calories: calories,
    servings: 4,
    ingredients: rawRecipe.ingredients,
    instructions: rawRecipe.directions,
    tags: tags,
    nutrition: {
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      fiber: '0g'
    },
    cuisine_type: detectCuisineType(rawRecipe.ingredients, rawRecipe.title),
    diet_type: tags.filter(t => ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].includes(t)),
    cooking_method: tags.filter(t => ['Baked', 'Grilled', 'Fried', 'No-Cook', 'Slow-Cooked'].includes(t)),
    difficulty_level: tags.find(t => ['Easy', 'Medium', 'Advanced'].includes(t)) || 'Medium',
    total_time: `${prepTime} minutes`,
    rating: null,
    review_count: 0,
    equipment: detectEquipment(rawRecipe.directions),
    seasonal_availability: []
  };
}

async function* readRecipesInChunks(filePath: string, chunkSize: number) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let recipesArray: any[];
  
  try {
    // Handle potential BOM character
    const cleanContent = fileContent.replace(/^\uFEFF/, '');
    recipesArray = JSON.parse(cleanContent);
    
    if (!Array.isArray(recipesArray)) {
      throw new Error('Expected a JSON array in the file');
    }
  } catch (error) {
    console.error('Error parsing JSON file:', error);
    throw error;
  }

  let chunk: RecipeData[] = [];
  for (const recipe of recipesArray) {
    try {
      let transformedRecipe: RecipeData | undefined;
      
      if ('external_id' in recipe) {
        // Already in correct format
        transformedRecipe = recipe as RecipeData;
      } else if (validateRecipe(recipe)) {
        transformedRecipe = transformRecipe(recipe);
      } else {
        console.warn('Invalid recipe format, skipping:', recipe.title || 'Unknown recipe');
        continue;
      }

      if (transformedRecipe) {
        chunk.push(transformedRecipe);
        
        if (chunk.length >= chunkSize) {
          yield chunk;
          chunk = [];
          // Add delay between chunks
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error processing recipe:', error);
      continue;
    }
  }

  if (chunk.length > 0) {
    yield chunk;
  }
}

async function importRecipeChunk(chunk: RecipeData[]) {
  try {
    // Add retries for reliability
    let retries = 3;
    while (retries > 0) {
      const { data, error } = await supabase
        .from('recipes')
        .upsert(chunk, { 
          onConflict: 'external_id',
          ignoreDuplicates: true 
        });

      if (!error) {
        return chunk.length;
      }

      console.warn(`Retry ${4 - retries} failed:`, error);
      retries--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Failed to import chunk after retries');
  } catch (error) {
    console.error('Error importing chunk:', error);
    return 0;
  }
}

async function importRecipes(filePath: string) {
  console.log('Starting recipe import...');
  
  let totalImported = 0;
  let totalErrors = 0;
  const startTime = Date.now();
  
  try {
    for await (const chunk of readRecipesInChunks(filePath, CHUNK_SIZE)) {
      try {
        const imported = await importRecipeChunk(chunk);
        totalImported += imported;
        console.log(`Imported ${imported} recipes (Total: ${totalImported})`);
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      } catch (error) {
        console.error('Chunk import failed:', error);
        totalErrors++;
      }
    }
  } catch (error) {
    console.error('Import process failed:', error);
  }
  
  const duration = (Date.now() - startTime) / 1000;
  console.log(`
Import completed:
- Total recipes imported: ${totalImported}
- Total errors: ${totalErrors}
- Duration: ${duration.toFixed(2)} seconds
- Average speed: ${(totalImported / duration).toFixed(2)} recipes/second
  `);
}

// Main execution
if (process.argv.length < 3) {
  console.error('Please provide the path to your recipe dataset file');
  process.exit(1);
}

const datasetPath = process.argv[2];
if (!fs.existsSync(datasetPath)) {
  console.error('Dataset file not found:', datasetPath);
  process.exit(1);
}

importRecipes(datasetPath)
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });