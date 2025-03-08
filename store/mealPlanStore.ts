import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, MealPlan } from '../types';
import { supabase } from '../lib/supabase';
import { generateMealPlan as generateAIMealPlan } from '../lib/openai';
import { mockMealPlans } from '../data/mockData';

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
  saveMealPlan: (plan: MealPlan) => Promise<void>;
  fetchUserMealPlans: () => Promise<MealPlan[]>;
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

export const useMealPlanStore = create<MealPlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      isGenerating: false,
      error: null,

      generateMealPlan: async (params) => {
        set({ isGenerating: true, error: null });

        try {
          // Check if Supabase is properly configured
          if (!isSupabaseConfigured() && __DEV__) {
            console.warn('Supabase not configured, using mock data');
            const mockPlan = mockMealPlans[0];
            set({ currentPlan: mockPlan, isGenerating: false });
            return mockPlan;
          }

          // First, try to fetch recipes from Supabase that match preferences
          const { data: recipes, error } = await supabase
            .from('recipes')
            .select('*')
            .contains('diet_type', params.preferences)
            .order('rating', { ascending: false })
            .limit(100);

          if (error) throw error;

          if (!recipes || recipes.length < 10) {
            // Not enough recipes in database, fall back to OpenAI
            console.log('Insufficient recipes in database, using OpenAI');
            const aiPlan = await generateAIMealPlan(params);
            set({ isGenerating: false });
            return aiPlan;
          }

          // Group recipes by meal type based on tags
          const breakfast = recipes.filter(r => r.tags.includes('Breakfast'));
          const lunch = recipes.filter(r => r.tags.includes('Lunch'));
          const dinner = recipes.filter(r => r.tags.includes('Dinner'));
          const snacks = recipes.filter(r => r.tags.includes('Snack'));

          // If we don't have enough recipes for each meal type, fall back to OpenAI
          if (breakfast.length < 3 || lunch.length < 3 || dinner.length < 3) {
            console.log('Insufficient meal type variety, using OpenAI');
            const aiPlan = await generateAIMealPlan(params);
            set({ isGenerating: false });
            return aiPlan;
          }

          // Create meal plan structure
          const days = Array.from({ length: parseInt(params.duration) }, (_, i) => {
            const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const dayIndex = i % 7;

            // Select random recipes for each meal, ensuring variety
            const getRandomRecipe = (array: any[]) => {
              if (array.length === 0) return recipes[Math.floor(Math.random() * recipes.length)];
              return array[Math.floor(Math.random() * array.length)];
            };

            return {
              day: dayNames[dayIndex],
              meals: {
                breakfast: transformDatabaseRecipe(getRandomRecipe(breakfast), params.familySize),
                lunch: transformDatabaseRecipe(getRandomRecipe(lunch), params.familySize),
                dinner: transformDatabaseRecipe(getRandomRecipe(dinner), params.familySize),
                snacks: [transformDatabaseRecipe(getRandomRecipe(snacks), params.familySize)]
              }
            };
          });

          const mealPlan: MealPlan = {
            id: Date.now().toString(),
            title: `${params.duration}-Day ${params.preferences.join(' & ')} Meal Plan`,
            description: `A custom ${params.duration}-day meal plan for a family of ${params.familySize}, following ${params.preferences.join(' and ')} dietary preferences.`,
            days,
            nutritionGoals: {
              calories: `${params.nutritionGoals.calories} kcal`,
              protein: `${params.nutritionGoals.protein}g`,
              carbs: `${params.nutritionGoals.carbs}g`,
              fat: `${params.nutritionGoals.fat}g`
            }
          };

          // Save to database if user is authenticated
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await get().saveMealPlan(mealPlan);
          }

          set({ currentPlan: mealPlan, isGenerating: false });
          return mealPlan;
        } catch (error) {
          console.error('Error generating meal plan:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate meal plan',
            isGenerating: false 
          });
          
          // In development, fall back to mock data
          if (__DEV__) {
            console.warn('Falling back to mock data');
            return mockMealPlans[0];
          }
          throw error;
        }
      },

      saveMealPlan: async (plan: MealPlan) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('meal_plans')
            .insert({
              user_id: user.id,
              title: plan.title,
              description: plan.description,
              duration_days: plan.days.length,
              nutrition_goals: plan.nutritionGoals
            })
            .select()
            .single();

          if (error) throw error;

          // Save meal plan days
          const daysPromises = plan.days.map((day, index) => 
            supabase
              .from('meal_plan_days')
              .insert({
                meal_plan_id: data.id,
                day_number: index + 1,
                breakfast_recipe_id: day.meals.breakfast.id,
                lunch_recipe_id: day.meals.lunch.id,
                dinner_recipe_id: day.meals.dinner.id
              })
          );

          await Promise.all(daysPromises);
        } catch (error) {
          console.error('Error saving meal plan:', error);
          throw error;
        }
      },

      fetchUserMealPlans: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data: mealPlans, error } = await supabase
            .from('meal_plans')
            .select(`
              *,
              meal_plan_days (
                *,
                breakfast_recipe:recipes!breakfast_recipe_id(*),
                lunch_recipe:recipes!lunch_recipe_id(*),
                dinner_recipe:recipes!dinner_recipe_id(*)
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return mealPlans.map(transformDatabaseMealPlan);
        } catch (error) {
          console.error('Error fetching meal plans:', error);
          throw error;
        }
      }
    }),
    {
      name: 'meal-plan-storage',
      storage: createJSONStorage(() => storage)
    }
  )
);

function transformDatabaseRecipe(dbRecipe: any, familySize: number = 4): Recipe {
  return {
    id: dbRecipe.id,
    title: dbRecipe.title,
    description: dbRecipe.description || '',
    image: dbRecipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    time: dbRecipe.total_time || `${dbRecipe.prep_time} min`,
    calories: `${Math.round(dbRecipe.calories * (familySize / dbRecipe.servings))} kcal`,
    servings: familySize,
    ingredients: dbRecipe.ingredients.map((ingredient: string) => {
      // Scale ingredient quantities for family size
      return scaleIngredientForServings(ingredient, familySize, dbRecipe.servings);
    }),
    instructions: dbRecipe.instructions || [],
    nutrition: {
      protein: dbRecipe.nutrition?.protein || '0g',
      carbs: dbRecipe.nutrition?.carbs || '0g',
      fat: dbRecipe.nutrition?.fat || '0g',
      fiber: dbRecipe.nutrition?.fiber || '0g'
    },
    tags: dbRecipe.tags || []
  };
}

function transformDatabaseMealPlan(dbPlan: any): MealPlan {
  return {
    id: dbPlan.id,
    title: dbPlan.title,
    description: dbPlan.description,
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

function scaleIngredientForServings(ingredient: string, targetServings: number, originalServings: number): string {
  const ratio = targetServings / originalServings;
  
  // Regular expression to match numbers (including decimals) at the start of the ingredient
  const quantityRegex = /^(\d*\.?\d+)\s*/;
  
  return ingredient.replace(quantityRegex, (match, quantity) => {
    const scaledQuantity = parseFloat(quantity) * ratio;
    return `${scaledQuantity.toFixed(1).replace(/\.0$/, '')} `;
  });
}