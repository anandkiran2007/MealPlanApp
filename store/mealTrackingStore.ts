import { create } from 'zustand';
import { Recipe } from '../types';

interface PreparedMeal {
  id: string;
  recipeId: string;
  date: string;
  servingsMade: number;
  ingredientsUsed: {
    name: string;
    amount: number;
    unit: string;
    wasSubstituted: boolean;
    substitutedWith?: string;
  }[];
  notes?: string;
}

interface MealTrackingState {
  preparedMeals: PreparedMeal[];
  currentWeekStats: {
    mealsCooked: number;
    ingredientsUsed: number;
    wasteReduced: number;
  };
  
  // Actions
  trackMealPreparation: (recipe: Recipe, servingsMade: number, ingredientsUsed: PreparedMeal['ingredientsUsed'], notes?: string) => void;
  getMealsByDate: (startDate: string, endDate: string) => PreparedMeal[];
  getIngredientUsageStats: () => {
    mostUsed: string[];
    frequentSubstitutions: { original: string; substitute: string; count: number }[];
  };
}

export const useMealTrackingStore = create<MealTrackingState>((set, get) => ({
  preparedMeals: [],
  currentWeekStats: {
    mealsCooked: 0,
    ingredientsUsed: 0,
    wasteReduced: 0,
  },

  trackMealPreparation: (recipe, servingsMade, ingredientsUsed, notes) => {
    set((state) => {
      const newMeal: PreparedMeal = {
        id: Date.now().toString(),
        recipeId: recipe.id,
        date: new Date().toISOString(),
        servingsMade,
        ingredientsUsed,
        notes,
      };

      // Update weekly stats
      const currentWeekStats = {
        mealsCooked: state.currentWeekStats.mealsCooked + 1,
        ingredientsUsed: state.currentWeekStats.ingredientsUsed + ingredientsUsed.length,
        wasteReduced: state.currentWeekStats.wasteReduced + 
          ingredientsUsed.filter(ing => ing.wasSubstituted).length,
      };

      return {
        preparedMeals: [...state.preparedMeals, newMeal],
        currentWeekStats,
      };
    });
  },

  getMealsByDate: (startDate, endDate) => {
    const state = get();
    return state.preparedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate >= new Date(startDate) && mealDate <= new Date(endDate);
    });
  },

  getIngredientUsageStats: () => {
    const state = get();
    const ingredientCounts = new Map<string, number>();
    const substitutions = new Map<string, Map<string, number>>();

    state.preparedMeals.forEach(meal => {
      meal.ingredientsUsed.forEach(ing => {
        // Count ingredient usage
        ingredientCounts.set(ing.name, (ingredientCounts.get(ing.name) || 0) + 1);

        // Track substitutions
        if (ing.wasSubstituted && ing.substitutedWith) {
          if (!substitutions.has(ing.name)) {
            substitutions.set(ing.name, new Map());
          }
          const subMap = substitutions.get(ing.name)!;
          subMap.set(ing.substitutedWith, (subMap.get(ing.substitutedWith) || 0) + 1);
        }
      });
    });

    // Get most used ingredients
    const mostUsed = Array.from(ingredientCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // Get frequent substitutions
    const frequentSubstitutions = Array.from(substitutions.entries())
      .flatMap(([original, subs]) => 
        Array.from(subs.entries()).map(([substitute, count]) => ({
          original,
          substitute,
          count,
        }))
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      mostUsed,
      frequentSubstitutions,
    };
  },
})); 