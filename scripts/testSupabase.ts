import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

// Create Supabase client with timeout settings
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: { 'x-custom-timeout': '10' }
  }
});

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  try {
    // Test 1: Simple connection test with a small table scan
    console.log('\nTest 1 - Basic connection test:');
    const { data: recipeCount, error: countError } = await supabase
      .from('recipes')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Connection test failed:', countError);
    } else {
      console.log('✅ Connection successful');
      console.log('Recipe count:', recipeCount);
    }

    // Test 2: Fetch a single recipe
    console.log('\nTest 2 - Fetch single recipe:');
    const { data: singleRecipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id, title, description')
      .limit(1)
      .single();

    if (recipeError) {
      console.error('❌ Single recipe fetch failed:', recipeError);
    } else {
      console.log('✅ Successfully fetched a recipe');
      console.log('Recipe:', singleRecipe);
    }

    // Test 3: Test a simple filter
    console.log('\nTest 3 - Test filtering:');
    const { data: vegetarianRecipes, error: filterError } = await supabase
      .from('recipes')
      .select('id, title')
      .contains('diet_type', ['Vegetarian'])
      .limit(1);

    if (filterError) {
      console.error('❌ Filter test failed:', filterError);
    } else {
      console.log('✅ Successfully tested filters');
      console.log('Filtered recipes:', vegetarianRecipes);
    }

    // Test 4: Check table structure
    console.log('\nTest 4 - Table information:');
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('test_connection');

    if (tableError) {
      console.error('❌ Table info check failed:', tableError);
    } else {
      console.log('✅ Successfully retrieved table info');
      console.log('Table info:', tableInfo);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the tests
console.log('Starting Supabase tests...\n');
testSupabaseConnection()
  .then(() => console.log('\nTests completed'))
  .catch(error => {
    console.error('\nTest suite failed:', error);
    process.exit(1);
  }); 