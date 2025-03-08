import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, MealPlan } from '../types';
import { supabase, getTypedRecipes, getTypedMealPlans } from '../lib/supabase';
import { mockMealPlans } from '../data/mockData';

interface MealPlanState {
  currentPlan: MealPlan | null;
  isGenerating: boolean;
  error: string | null;
  generateMealPlan: (params: GenerateMealPlanParams) => Promise<void>;
  saveMealPlan: (plan: MealPlan) => Promise<void>;
  fetchUserMealPlans: () => Promise<MealPlan[]>;
  clearError: () => void;
  mealPlans: MealPlan[];
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
}

interface GenerateMealPlanParams {
  days: number;
  preferences?: string[];
  familySize?: number;
  nutritionGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Create a storage adapter that handles JSON serialization and SSR
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (typeof window === 'undefined') {
        return null;
      }
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  }
};

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      isGenerating: false,
      error: null,
      mealPlans: [],
      loading: false,

      generateMealPlan: async (params) => {
        try {
          set({ isGenerating: true, error: null });

          // Calculate how many recipes we need based on days
          const recipesNeeded = params.days * 3; // 3 meals per day
          const fetchLimit = Math.min(recipesNeeded * 2, 18); // Fetch 2x needed recipes, max 18

          // Optimized query with fewer fields and better indexing
          const { data: recipes, error: recipesError } = await supabase
            .from('recipes')
            .select(`
              id,
              title,
              description,
              image_url,
              total_time,
              prep_time,
              calories,
              servings,
              ingredients,
              instructions,
              nutrition
            `)
            .not('title', 'is', null)  // Only get recipes with titles
            .not('ingredients', 'is', null)  // Only get recipes with ingredients
            .limit(fetchLimit)
            .order('id', { ascending: true });

          if (recipesError) {
            console.error('Recipe fetch error:', recipesError);
            throw recipesError;
          }

          if (!recipes || recipes.length === 0) {
            throw new Error('No recipes found in the database');
          }

          if (recipes.length < recipesNeeded) {
            throw new Error(`Not enough recipes found. Need at least ${recipesNeeded} recipes for a ${params.days}-day meal plan.`);
          }

          console.log(`Fetched ${recipes.length} recipes for ${params.days}-day meal plan`);

          // Transform all recipes first
          const transformedRecipes = recipes.map(recipe => {
            try {
              return transformDatabaseRecipe(recipe);
            } catch (error) {
              console.error('Error transforming recipe:', error);
              // Return a basic recipe if transformation fails
              return {
                id: recipe.id,
                title: recipe.title || 'Untitled Recipe',
                description: recipe.description || '',
                image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                time: '0 min',
                calories: '0 kcal',
                servings: 4,
                ingredients: [],
                instructions: [],
                nutrition: { protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
                tags: [],
                rating: 0,
                dietType: [],
                prepTime: 0
              };
            }
          });

          // Shuffle transformed recipes
          const shuffledRecipes = [...transformedRecipes].sort(() => Math.random() - 0.5);

          // Create meal plan days using transformed recipes
          const days = Array.from({ length: params.days }, (_, i) => {
            const dayRecipes = shuffledRecipes.slice(i * 3, (i * 3) + 3);
            
            return {
              day: `Day ${i + 1}`,
              meals: {
                breakfast: dayRecipes[0],
                lunch: dayRecipes[1],
                dinner: dayRecipes[2],
                snacks: []
              }
            };
          });

          // Calculate total nutrition for the meal plan
          const totalNutrition = days.reduce((acc, day) => {
            const dayNutrition = [day.meals.breakfast, day.meals.lunch, day.meals.dinner].reduce((mealAcc, meal) => {
              if (!meal?.nutrition) return mealAcc;
              return {
                calories: (parseInt(mealAcc.calories) + (meal.calories ? parseInt(meal.calories) : 0)) + '',
                protein: (parseInt(mealAcc.protein) + (meal.nutrition.protein ? parseInt(meal.nutrition.protein) : 0)) + 'g',
                carbs: (parseInt(mealAcc.carbs) + (meal.nutrition.carbs ? parseInt(meal.nutrition.carbs) : 0)) + 'g',
                fat: (parseInt(mealAcc.fat) + (meal.nutrition.fat ? parseInt(meal.nutrition.fat) : 0)) + 'g'
              };
            }, { calories: '0', protein: '0g', carbs: '0g', fat: '0g' });
            return {
              calories: (parseInt(acc.calories) + parseInt(dayNutrition.calories)) + '',
              protein: (parseInt(acc.protein) + parseInt(dayNutrition.protein)) + 'g',
              carbs: (parseInt(acc.carbs) + parseInt(dayNutrition.carbs)) + 'g',
              fat: (parseInt(acc.fat) + parseInt(dayNutrition.fat)) + 'g'
            };
          }, { calories: '0', protein: '0g', carbs: '0g', fat: '0g' });

          const newMealPlan: MealPlan = {
            id: crypto.randomUUID(),
            title: `${params.days}-Day Meal Plan`,
            description: `A balanced meal plan for ${params.days} days`,
            days,
            nutritionGoals: totalNutrition
          };

          // Store the meal plan in local state only
          set({ 
            currentPlan: newMealPlan,
            mealPlans: [...get().mealPlans, newMealPlan],
            isGenerating: false 
          });

        } catch (error) {
          console.error('Error generating meal plan:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate meal plan',
            isGenerating: false 
          });
        }
      },

      fetchUserMealPlans: async () => {
        // Return the locally stored meal plans instead of fetching from Supabase
        return get().mealPlans;
      },

      clearError: () => set({ error: null }),

      fetchMealPlans: async () => {
        // Set loading state and return void to match interface
        set({ loading: true });
        try {
          set({ mealPlans: get().mealPlans, loading: false });
        } catch (error) {
          set({ error: 'Failed to load meal plans', loading: false });
        }
      },

      saveMealPlan: async (plan: MealPlan) => {
        try {
          // Just update the local state
          const mealPlans = get().mealPlans;
          const existingPlanIndex = mealPlans.findIndex(p => p.id === plan.id);
          
          if (existingPlanIndex >= 0) {
            // Update existing plan
            mealPlans[existingPlanIndex] = plan;
            set({ mealPlans: [...mealPlans] });
          } else {
            // Add new plan
            set({ mealPlans: [...mealPlans, plan] });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to save meal plan';
          set({ error: errorMessage });
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

function transformDatabaseRecipe(dbRecipe: any): Recipe {
  if (!dbRecipe || !dbRecipe.id) {
    console.error('Invalid recipe data:', dbRecipe);
    throw new Error('Invalid recipe data received from database');
  }

  // Parse nutrition values, removing 'g' and converting to numbers
  const nutrition = dbRecipe.nutrition || {};
  const parseNutritionValue = (value: string | undefined) => {
    if (!value) return '0g';
    // Remove any 'g' suffix and parse the number
    const numStr = value.toString().replace('g', '').trim();
    const num = parseFloat(numStr);
    return isNaN(num) ? '0g' : `${num}g`;
  };

  // Clean up ingredients array
  const cleanIngredients = (ingredients: any[]): string[] => {
    if (!Array.isArray(ingredients)) return [];
    return ingredients.map(ingredient => {
      if (typeof ingredient === 'string') {
        // Remove quotes and clean up the string
        return ingredient.replace(/^"|"$/g, '').trim();
      }
      return String(ingredient);
    }).filter(Boolean);
  };

  // Clean up instructions array
  const cleanInstructions = (instructions: any[]): string[] => {
    if (!Array.isArray(instructions)) return [];
    return instructions.map(instruction => {
      if (typeof instruction === 'string') {
        // Remove quotes and clean up the string
        return instruction.replace(/^"|"$/g, '').trim();
      }
      return String(instruction);
    }).filter(Boolean);
  };

  // Format time duration
  const formatTime = (time: string | number | null | undefined): string => {
    if (!time) return '0 min';
    if (typeof time === 'number') return `${time} min`;
    // Handle HH:MM:SS format
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      return `${parseInt(hours) * 60 + parseInt(minutes)} min`;
    }
    return time;
  };

  return {
    id: dbRecipe.id,
    title: dbRecipe.title?.trim() || 'Untitled Recipe',
    description: dbRecipe.description?.trim() || '',
    image: dbRecipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    time: formatTime(dbRecipe.total_time || dbRecipe.prep_time),
    calories: typeof dbRecipe.calories === 'number' ? `${dbRecipe.calories} kcal` : '0 kcal',
    servings: dbRecipe.servings || 4,
    ingredients: cleanIngredients(Array.isArray(dbRecipe.ingredients) ? dbRecipe.ingredients : []),
    instructions: cleanInstructions(Array.isArray(dbRecipe.instructions) ? dbRecipe.instructions : []),
    nutrition: {
      protein: parseNutritionValue(nutrition.protein),
      carbs: parseNutritionValue(nutrition.carbs),
      fat: parseNutritionValue(nutrition.fat),
      fiber: parseNutritionValue(nutrition.fiber)
    },
    tags: Array.isArray(dbRecipe.tags) ? dbRecipe.tags : [],
    rating: typeof dbRecipe.rating === 'number' ? dbRecipe.rating : 0,
    dietType: Array.isArray(dbRecipe.diet_type) ? dbRecipe.diet_type : [],
    prepTime: typeof dbRecipe.prep_time === 'number' ? dbRecipe.prep_time : 0
  };
}

function transformDatabaseMealPlan(dbPlan: any): MealPlan {
  return {
    id: dbPlan.id,
    title: dbPlan.title,
    description: dbPlan.description || '',
    days: dbPlan.meal_plan_days
      .sort((a: any, b: any) => a.day_number - b.day_number)
      .map((day: any) => ({
        day: getDayName(day.day_number),
        meals: {
          breakfast: transformDatabaseRecipe(day.breakfast_recipe),
          lunch: transformDatabaseRecipe(day.lunch_recipe),
          dinner: transformDatabaseRecipe(day.dinner_recipe),
          snacks: []
        }
      })),
    nutritionGoals: dbPlan.nutrition_goals
  };
}

function getDayName(dayNumber: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[(dayNumber - 1) % 7];
}

function scaleIngredients(ingredients: any[], targetServings: number, originalServings: number): string[] {
  const ratio = targetServings / originalServings;
  return ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      return scaleIngredientString(ingredient, ratio);
    }
    return ingredient;
  });
}

function scaleIngredientString(ingredient: string, ratio: number): string {
  const quantityRegex = /^(\d*\.?\d+)\s*/;
  return ingredient.replace(quantityRegex, (match, quantity) => {
    const scaledQuantity = parseFloat(quantity) * ratio;
    return `${scaledQuantity.toFixed(1).replace(/\.0$/, '')} `;
  });
}

function scaleNutrition(nutrition: any, targetServings: number, originalServings: number) {
  const ratio = targetServings / originalServings;
  return {
    protein: scaleNutritionValue(nutrition?.protein, ratio),
    carbs: scaleNutritionValue(nutrition?.carbs, ratio),
    fat: scaleNutritionValue(nutrition?.fat, ratio),
    fiber: scaleNutritionValue(nutrition?.fiber, ratio)
  };
}

function scaleNutritionValue(value: string | undefined, ratio: number): string {
  if (!value) return '0g';
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return value;
  return `${Math.round(numericValue * ratio)}g`;
}