import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const storage = {
  getItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  }
};

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL && 
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Type-safe database query helpers
export const getTypedRecipes = () => 
  supabase
    .from('recipes')
    .select(`
      id::text,
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
    `);

export const getTypedMealPlans = () =>
  supabase
    .from('meal_plans')
    .select(`
      id,
      title,
      description,
      duration_days,
      nutrition_goals,
      meal_plan_days (
        id,
        day_number,
        breakfast_recipe:recipes!breakfast_recipe_id(*),
        lunch_recipe:recipes!lunch_recipe_id(*),
        dinner_recipe:recipes!dinner_recipe_id(*)
      )
    `);
