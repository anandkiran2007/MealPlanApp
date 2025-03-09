import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, MealPlan } from '../types';
import { supabase, getTypedRecipes, getTypedMealPlans } from '../lib/supabase';
import { mockMealPlans } from '../data/mockData';

export const MAX_MEAL_PLANS = 3;

interface MealPlanState {
  currentPlan: MealPlan | null;
  isGenerating: boolean;
  error: string | null;
  generateMealPlan: (params: GenerateMealPlanParams) => Promise<void>;
  saveMealPlan: (plan: MealPlan) => Promise<void>;
  deleteMealPlan: (id: string) => void;
  fetchUserMealPlans: () => Promise<MealPlan[]>;
  clearError: () => void;
  mealPlans: MealPlan[];
  loading: boolean;
  fetchMealPlans: () => Promise<void>;
  addMealPlan: (mealPlan: MealPlan) => void;
  updateMealPlan: (mealPlan: MealPlan) => void;
  mealHistory: {
    date: Date;
    recipe: Recipe;
    mealType: string;
  }[];
  addToHistory: (meal: { date: Date; recipe: Recipe; mealType: string }) => void;
  checkAndContinuePlan: () => void;
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
      mealHistory: [],
      loading: false,

      generateMealPlan: async (params) => {
        try {
          // Check if we've reached the meal plan limit
          if (get().mealPlans.length >= MAX_MEAL_PLANS) {
            throw new Error(`You can only have ${MAX_MEAL_PLANS} meal plans at a time. Please delete an existing plan to create a new one.`);
          }

          set({ isGenerating: true, error: null });

          // Calculate how many recipes we need based on days
          const recipesNeeded = params.days * 3; // 3 meals per day
          const fetchLimit = Math.min(recipesNeeded * 2, 21); // Reduced to 21 to prevent timeout

          // Optimized query with minimal fields and better filtering
          const { data: recipes, error: recipesError } = await supabase
            .from('recipes')
            .select('id, title, description, image_url, total_time, calories, servings, ingredients, instructions, nutrition')
            .not('title', 'is', null)
            .not('ingredients', 'is', null)
            .gt('calories', 0) // Only get recipes with calories
            .limit(fetchLimit)
            .order('id', { ascending: false }); // Simple ordering by id

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
                calories: recipe.calories?.toString() || '0',
                servings: recipe.servings || 4,
                ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
                instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
                nutrition: recipe.nutrition || { protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
                tags: [],
                rating: 0,
                dietType: [],
                prepTime: 0
              };
            }
          });

          // Shuffle transformed recipes more efficiently
          for (let i = transformedRecipes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [transformedRecipes[i], transformedRecipes[j]] = [transformedRecipes[j], transformedRecipes[i]];
          }

          // Create meal plan days using transformed recipes
          const days = Array.from({ length: params.days }, (_, i) => {
            const dayRecipes = transformedRecipes.slice(i * 3, (i * 3) + 3);
            
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

              // Calculate nutrition per serving
              const servings = meal.servings || 1;
              const calories = meal.calories ? parseInt(meal.calories) / servings : 0;
              const protein = meal.nutrition.protein ? parseInt(meal.nutrition.protein) / servings : 0;
              const carbs = meal.nutrition.carbs ? parseInt(meal.nutrition.carbs) / servings : 0;
              const fat = meal.nutrition.fat ? parseInt(meal.nutrition.fat) / servings : 0;

              return {
                calories: (parseInt(mealAcc.calories) + calories) + '',
                protein: (parseInt(mealAcc.protein) + protein) + 'g',
                carbs: (parseInt(mealAcc.carbs) + carbs) + 'g',
                fat: (parseInt(mealAcc.fat) + fat) + 'g'
              };
            }, { calories: '0', protein: '0g', carbs: '0g', fat: '0g' });

            // Calculate daily averages
            return {
              calories: (parseInt(acc.calories) + parseInt(dayNutrition.calories)) + '',
              protein: (parseInt(acc.protein) + parseInt(dayNutrition.protein)) + 'g',
              carbs: (parseInt(acc.carbs) + parseInt(dayNutrition.carbs)) + 'g',
              fat: (parseInt(acc.fat) + parseInt(dayNutrition.fat)) + 'g'
            };
          }, { calories: '0', protein: '0g', carbs: '0g', fat: '0g' });

          // Calculate average per day
          const daysCount = days.length;
          const averageNutrition = {
            calories: Math.round(parseInt(totalNutrition.calories) / daysCount) + '',
            protein: Math.round(parseInt(totalNutrition.protein) / daysCount) + 'g',
            carbs: Math.round(parseInt(totalNutrition.carbs) / daysCount) + 'g',
            fat: Math.round(parseInt(totalNutrition.fat) / daysCount) + 'g'
          };

          const newMealPlan: MealPlan = {
            id: crypto.randomUUID(),
            title: `${params.days}-Day Meal Plan`,
            description: `A balanced meal plan for ${params.days} days`,
            days,
            nutritionGoals: averageNutrition, // Using average daily nutrition instead of total
            totalNutrition: totalNutrition // Adding total nutrition for reference
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

      deleteMealPlan: (id: string) => {
        const mealPlans = get().mealPlans.filter(plan => plan.id !== id);
        set({ mealPlans });
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
      },

      addMealPlan: (mealPlan) => set((state) => ({ 
        mealPlans: [...state.mealPlans, mealPlan] 
      })),

      updateMealPlan: (mealPlan) => {
        const { mealPlans } = get();
        const updatedPlans = mealPlans.map((plan) => 
          plan.id === mealPlan.id ? mealPlan : plan
        );
        set({ mealPlans: updatedPlans });

        // Check if all meals in the plan are completed
        const allMealsCompleted = mealPlan.days.every(day =>
          Object.values(day.meals)
            .filter((meal): meal is Recipe => !Array.isArray(meal))
            .every(meal => meal.status === 'completed')
        );

        if (allMealsCompleted) {
          get().checkAndContinuePlan();
        }
      },

      addToHistory: (meal) => {
        const { mealHistory } = get();
        set({ mealHistory: [...mealHistory, meal] });
      },

      checkAndContinuePlan: () => {
        const { mealPlans } = get();
        const currentPlan = mealPlans[0]; // Assume the first plan is the current one

        if (currentPlan) {
          // Create a new plan starting from the next day
          const newPlan: MealPlan = {
            ...currentPlan,
            id: Date.now().toString(),
            startDate: new Date(),
            days: currentPlan.days.map(day => ({
              ...day,
              meals: {
                breakfast: { ...day.meals.breakfast, status: 'pending' },
                lunch: { ...day.meals.lunch, status: 'pending' },
                dinner: { ...day.meals.dinner, status: 'pending' },
                ...(day.meals.snacks && {
                  snacks: day.meals.snacks.map(snack => ({ ...snack, status: 'pending' }))
                })
              }
            })),
            feedback: {
              rating: 0,
              comments: '',
              completedMeals: 0,
              totalMeals: currentPlan.days.length * 3
            }
          };

          set({ mealPlans: [newPlan, ...mealPlans] });
        }
      },
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