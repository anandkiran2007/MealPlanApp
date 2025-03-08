import { create } from 'zustand';
import { Recipe } from '../types';
import { supabase } from '../lib/supabase';
import { mockRecipes } from '../data/mockData';

interface RecipeState {
  recipes: Recipe[];
  favorites: Set<string>;
  bookmarks: Set<string>;
  searchQuery: string;
  selectedTags: string[];
  loading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  toggleBookmark: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  getFilteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  favorites: new Set(),
  bookmarks: new Set(),
  searchQuery: '',
  selectedTags: [],
  loading: false,
  error: null,

  loadRecipes: async () => {
    try {
      set({ loading: true, error: null });
      
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured() && __DEV__) {
        console.warn('Supabase not configured, using mock data');
        set({ recipes: mockRecipes, loading: false });
        return;
      }
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
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
        `)
        .order('rating', { ascending: false })
        .limit(50);

      if (error) throw error;

      // If we got data, transform and use it
      if (data && data.length > 0) {
        const recipes: Recipe[] = data.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description || '',
          image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          time: recipe.total_time || `${recipe.prep_time} min`,
          calories: `${recipe.calories} kcal`,
          servings: recipe.servings,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          nutrition: {
            protein: recipe.nutrition?.protein || '0g',
            carbs: recipe.nutrition?.carbs || '0g',
            fat: recipe.nutrition?.fat || '0g',
            fiber: recipe.nutrition?.fiber || '0g'
          },
          tags: recipe.tags || []
        }));
        set({ recipes, loading: false });
      } else {
        // If no data, use mock data in development
        if (__DEV__) {
          console.warn('No recipes found in database, using mock data');
          set({ recipes: mockRecipes, loading: false });
        } else {
          throw new Error('No recipes found');
        }
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      // In development, fallback to mock data
      if (__DEV__) {
        console.warn('Using mock data due to error');
        set({ 
          recipes: mockRecipes,
          error: null,
          loading: false 
        });
      } else {
        set({ 
          error: 'Failed to load recipes. Please try again later.',
          loading: false 
        });
      }
    }
  },

  toggleFavorite: (id: string) => {
    set((state) => {
      const newFavorites = new Set(state.favorites);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return { favorites: newFavorites };
    });
  },

  toggleBookmark: (id: string) => {
    set((state) => {
      const newBookmarks = new Set(state.bookmarks);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return { bookmarks: newBookmarks };
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  toggleTag: (tag: string) => {
    set((state) => {
      const newTags = [...state.selectedTags];
      const index = newTags.indexOf(tag);
      if (index === -1) {
        newTags.push(tag);
      } else {
        newTags.splice(index, 1);
      }
      return { selectedTags: newTags };
    });
  },

  getFilteredRecipes: () => {
    const state = get();
    return state.recipes.filter((recipe) => {
      const matchesSearch =
        state.searchQuery === '' ||
        recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(state.searchQuery.toLowerCase());

      const matchesTags =
        state.selectedTags.length === 0 ||
        state.selectedTags.some((tag) => recipe.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  },
}));