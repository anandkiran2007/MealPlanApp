import { create } from 'zustand';
import { Recipe } from '../types';

interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
}

interface ShoppingListState {
  items: ShoppingListItem[];
  addRecipeIngredients: (recipe: Recipe) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  addItem: (name: string) => void;
  clearCompleted: () => void;
}

export const useShoppingListStore = create<ShoppingListState>((set) => ({
  items: [
    { id: '1', name: '2 boneless chicken breasts', completed: false, category: 'Meat' },
    { id: '2', name: '1 large cucumber', completed: false, category: 'Produce' },
    { id: '3', name: '2 cups cherry tomatoes', completed: false, category: 'Produce' },
    { id: '4', name: '1 red onion', completed: false, category: 'Produce' },
    { id: '5', name: '1 cup Kalamata olives', completed: false, category: 'Canned Goods' },
    { id: '6', name: '6 oz feta cheese', completed: false, category: 'Dairy' },
    { id: '7', name: '2 tbsp olive oil', completed: true, category: 'Oils' },
    { id: '8', name: '1 lemon', completed: true, category: 'Produce' },
  ],

  addRecipeIngredients: (recipe: Recipe) => {
    set((state) => {
      const newItems = [...state.items];
      recipe.ingredients.forEach((ingredient) => {
        if (!state.items.some((item) => item.name === ingredient)) {
          newItems.push({
            id: Date.now().toString() + Math.random(),
            name: ingredient,
            completed: false,
            category: 'Other',
          });
        }
      });
      return { items: newItems };
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

  addItem: (name: string) => {
    set((state) => ({
      items: [
        ...state.items,
        {
          id: Date.now().toString(),
          name,
          completed: false,
          category: 'Other',
        },
      ],
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      items: state.items.filter((item) => !item.completed),
    }));
  },
}));