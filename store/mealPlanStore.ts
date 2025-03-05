import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, MealPlan } from '../types';
import { supabase } from '../lib/supabase';
import { mockRecipes } from '../data/mockData';

// Create a storage adapter that works across platforms
const storage = Platform.select({
  web: {
    getItem: (name: string) => {
      const value = localStorage.getItem(name);
      return Promise.resolve(value);
    },
    setItem: (name: string, value: string) => {
      localStorage.setItem(name, value);
      return Promise.resolve();
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
      return Promise.resolve();
    }
  },
  default: AsyncStorage
});

interface MealPlanState {
  currentPlan: MealPlan | null;
  isGenerating: boolean;
  error: string | null;
  generateMealPlan: (params: GenerateMealPlanParams) => Promise<MealPlan>;
}

interface GenerateMealPlanParams {
  duration: '3' | '5' | '7';
  preferences: string[];
  familySize: number;
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const filterRecipesByPreferences = (recipes: Recipe[], preferences: string[]) => {
  if (preferences.length === 0) return recipes;
  return recipes.filter(recipe => 
    preferences.some(pref => recipe.tags.includes(pref))
  );
};

const generateDailyMeals = (recipes: Recipe[], preferences: string[]) => {
  const filteredRecipes = filterRecipesByPreferences(recipes, preferences);
  
  // Ensure we have enough recipes
  if (filteredRecipes.length < 3) {
    throw new Error('Not enough recipes matching preferences');
  }

  // Get unique recipes for each meal
  const breakfast = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
  let lunch;
  let dinner;

  do {
    lunch = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
  } while (lunch.id === breakfast.id);

  do {
    dinner = filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
  } while (dinner.id === breakfast.id || dinner.id === lunch.id);

  return {
    breakfast,
    lunch,
    dinner,
    snacks: []
  };
};

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set) => ({
      currentPlan: null,
      isGenerating: false,
      error: null,

      generateMealPlan: async (params) => {
        set({ isGenerating: true, error: null });

        try {
          const daysCount = parseInt(params.duration);
          const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          
          const days = Array.from({ length: daysCount }, (_, i) => ({
            day: dayNames[i % 7],
            meals: generateDailyMeals(mockRecipes, params.preferences)
          }));

          const mealPlan: MealPlan = {
            id: Date.now().toString(),
            title: `${daysCount}-Day ${params.preferences.join(', ')} Meal Plan`,
            description: `A customized ${daysCount}-day meal plan for a family of ${params.familySize}, focusing on ${params.preferences.join(', ')} meals.`,
            days,
            nutritionGoals: {
              calories: `${params.nutritionGoals.calories} kcal`,
              protein: `${params.nutritionGoals.protein}g`,
              carbs: `${params.nutritionGoals.carbs}g`,
              fat: `${params.nutritionGoals.fat}g`
            }
          };

          set({ currentPlan: mealPlan, isGenerating: false });
          return mealPlan;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate meal plan';
          set({ error: errorMessage, isGenerating: false });
          throw new Error(errorMessage);
        }
      }
    }),
    {
      name: 'meal-plan-storage',
      storage: createJSONStorage(() => storage)
    }
  )
);