import { create } from 'zustand';
import { Recipe, MealPlan } from '../types';

interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  completed: boolean;
  recipeId?: string;
  mealPlanId?: string;
  inStock?: number;
  expiryDate?: string;
}

interface ShoppingListState {
  items: ShoppingListItem[];
  pantryItems: {
    name: string;
    amount: number;
    unit: string;
    expiryDate?: string;
    lowStockThreshold?: number;
  }[];
  
  // Shopping List Actions
  addRecipeIngredients: (recipe: Recipe, servings?: number) => void;
  addMealPlanIngredients: (mealPlan: MealPlan) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  addItem: (item: Omit<ShoppingListItem, 'id' | 'completed'>) => void;
  clearCompleted: () => void;
  
  // Pantry Management
  updatePantryItem: (name: string, amount: number, unit: string, expiryDate?: string) => void;
  removePantryItem: (name: string) => void;
  getLowStockItems: () => { name: string; currentAmount: number; threshold: number }[];
  getExpiringItems: () => { name: string; expiryDate: string; daysUntilExpiry: number }[];
  
  // Smart List Generation
  generateSmartList: (mealPlan: MealPlan) => ShoppingListItem[];
  optimizeQuantities: (items: ShoppingListItem[]) => ShoppingListItem[];
}

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  items: [],
  pantryItems: [],

  addRecipeIngredients: (recipe: Recipe, servings = 1) => {
    set((state) => {
      const newItems = [...state.items];
      const servingRatio = servings / recipe.servings;

      recipe.ingredients.forEach((ingredient) => {
        // Parse ingredient string to extract amount, unit, and name
        const match = ingredient.match(/^([\d.]+)?\s*([a-zA-Z]+)?\s+(.+)$/);
        if (match) {
          const [_, amount, unit, name] = match;
          const parsedAmount = amount ? parseFloat(amount) * servingRatio : 1;

          // Check if ingredient exists
          const existingItem = newItems.find(item => 
            item.name.toLowerCase() === name.toLowerCase() && item.unit === unit
          );

          if (existingItem) {
            existingItem.amount += parsedAmount;
          } else {
            newItems.push({
              id: Date.now().toString() + Math.random(),
              name: name.trim(),
              amount: parsedAmount,
              unit: unit || 'unit',
              category: categorizeIngredient(name),
              completed: false,
              recipeId: recipe.id
            });
          }
        }
      });
      return { items: newItems };
    });
  },

  addMealPlanIngredients: (mealPlan: MealPlan) => {
    const state = get();
    mealPlan.days.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        if (Array.isArray(meal)) {
          meal.forEach(recipe => state.addRecipeIngredients(recipe));
        } else {
          state.addRecipeIngredients(meal);
        }
      });
    });
  },

  toggleItem: (id: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  },

  deleteItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  addItem: (item) => {
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: Date.now().toString(),
          completed: false,
        },
      ],
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      items: state.items.filter((item) => !item.completed),
    }));
  },

  updatePantryItem: (name, amount, unit, expiryDate) => {
    set((state) => {
      const pantryItems = [...state.pantryItems];
      const existingItem = pantryItems.find(item => item.name === name);

      if (existingItem) {
        existingItem.amount = amount;
        existingItem.expiryDate = expiryDate;
      } else {
        pantryItems.push({ name, amount, unit, expiryDate });
      }

      return { pantryItems };
    });
  },

  removePantryItem: (name) => {
    set((state) => ({
      pantryItems: state.pantryItems.filter(item => item.name !== name),
    }));
  },

  getLowStockItems: () => {
    const state = get();
    return state.pantryItems
      .filter(item => item.lowStockThreshold && item.amount <= item.lowStockThreshold)
      .map(item => ({
        name: item.name,
        currentAmount: item.amount,
        threshold: item.lowStockThreshold!,
      }));
  },

  getExpiringItems: () => {
    const state = get();
    const today = new Date();
    
    return state.pantryItems
      .filter(item => item.expiryDate)
      .map(item => {
        const expiryDate = new Date(item.expiryDate!);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          name: item.name,
          expiryDate: item.expiryDate!,
          daysUntilExpiry,
        };
      })
      .filter(item => item.daysUntilExpiry <= 7)
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  },

  generateSmartList: (mealPlan: MealPlan) => {
    const state = get();
    const newItems: ShoppingListItem[] = [];
    
    // Add all ingredients from meal plan
    mealPlan.days.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        if (Array.isArray(meal)) {
          meal.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
              // Parse and add ingredient
              const parsedIngredient = parseIngredient(ingredient);
              if (parsedIngredient) {
                newItems.push({
                  ...parsedIngredient,
                  id: Date.now().toString() + Math.random(),
                  completed: false,
                  mealPlanId: mealPlan.id,
                });
              }
            });
          });
        }
      });
    });

    // Check pantry and adjust quantities
    return newItems.map(item => {
      const pantryItem = state.pantryItems.find(p => p.name === item.name && p.unit === item.unit);
      if (pantryItem) {
        const neededAmount = Math.max(0, item.amount - pantryItem.amount);
        return { ...item, amount: neededAmount };
      }
      return item;
    }).filter(item => item.amount > 0);
  },

  optimizeQuantities: (items: ShoppingListItem[]) => {
    // Group similar items and sum their quantities
    const groupedItems = new Map<string, ShoppingListItem>();
    
    items.forEach(item => {
      const key = `${item.name}-${item.unit}`;
      if (groupedItems.has(key)) {
        const existing = groupedItems.get(key)!;
        existing.amount += item.amount;
      } else {
        groupedItems.set(key, { ...item });
      }
    });

    return Array.from(groupedItems.values());
  },
}));

// Helper function to categorize ingredients
function categorizeIngredient(name: string): string {
  const categories = {
    Produce: ['vegetable', 'fruit', 'lettuce', 'tomato', 'onion', 'potato'],
    Meat: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'turkey'],
    Dairy: ['milk', 'cheese', 'yogurt', 'cream', 'butter'],
    Pantry: ['flour', 'sugar', 'rice', 'pasta', 'oil', 'spice'],
    'Canned Goods': ['can', 'soup', 'beans', 'tomato sauce'],
  };

  const lowercaseName = name.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowercaseName.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
}

// Helper function to parse ingredient strings
function parseIngredient(ingredient: string): Omit<ShoppingListItem, 'id' | 'completed'> | null {
  const match = ingredient.match(/^([\d.]+)?\s*([a-zA-Z]+)?\s+(.+)$/);
  if (match) {
    const [_, amount, unit, name] = match;
    return {
      name: name.trim(),
      amount: amount ? parseFloat(amount) : 1,
      unit: unit || 'unit',
      category: categorizeIngredient(name),
    };
  }
  return null;
}