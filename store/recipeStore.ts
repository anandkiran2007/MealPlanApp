import { create } from 'zustand';
import { Recipe } from '../types';
import { supabase, getTypedRecipes } from '../lib/supabase';
import { mockRecipes } from '../data/mockData';
import { Database } from '../types/supabase';

interface RecipeData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  prep_time: number | null;
  calories: number | null;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  total_time: string | null;
  rating: number | null;
  diet_type: string[];
}

interface RecipeState {
  recipes: Recipe[];
  favorites: Set<string>;
  bookmarks: Set<string>;
  searchQuery: string;
  selectedTags: string[];
  loading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  searchRecipes: (query: string, filters?: RecipeFilters) => Promise<void>;
  toggleFavorite: (id: string) => void;
  toggleBookmark: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  getFilteredRecipes: () => Recipe[];
  refreshRecipes: () => Promise<void>;
}

interface RecipeFilters {
  tags?: string[];
  dietType?: string[];
  maxPrepTime?: number;
  minRating?: number;
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
      
      // First try a simple connection test
      const { error: connectionError } = await supabase
        .from('recipes')
        .select('id')
        .limit(1)
        .abortSignal(AbortSignal.timeout(5000)); // 5 second timeout for connection test

      if (connectionError) {
        console.error('Connection test failed:', connectionError);
        throw new Error('Failed to connect to the recipe database');
      }

      // Load recipes in smaller chunks
      const CHUNK_SIZE = 10;
      let allRecipes: Recipe[] = [];
      let lastId = '';
      let hasMore = true;
      let retryCount = 0;
      const MAX_RETRIES = 3;

      while (hasMore && retryCount < MAX_RETRIES) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const { data, error } = await getTypedRecipes()
            .order('id', { ascending: true })
            .gt('id', lastId)
            .limit(CHUNK_SIZE)
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (error) throw error;

          if (!data || data.length === 0) {
            hasMore = false;
            break;
          }

          const transformedChunk = data.map((recipe: RecipeData) => ({
            id: recipe.id,
            title: recipe.title?.trim() || 'Untitled Recipe',
            description: recipe.description?.trim() || '',
            image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            time: recipe.total_time || `${recipe.prep_time || 0} min`,
            calories: typeof recipe.calories === 'number' ? `${recipe.calories} kcal` : '0 kcal',
            servings: recipe.servings || 4,
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
            nutrition: {
              protein: recipe.nutrition?.protein || '0g',
              carbs: recipe.nutrition?.carbs || '0g',
              fat: recipe.nutrition?.fat || '0g',
              fiber: recipe.nutrition?.fiber || '0g'
            },
            tags: Array.isArray(recipe.tags) ? recipe.tags : [],
            rating: typeof recipe.rating === 'number' ? recipe.rating : 0,
            dietType: Array.isArray(recipe.diet_type) ? recipe.diet_type : [],
            prepTime: typeof recipe.prep_time === 'number' ? recipe.prep_time : 0
          }));

          allRecipes = [...allRecipes, ...transformedChunk];
          lastId = data[data.length - 1].id;

          // Update state progressively
          set({ recipes: allRecipes });

        } catch (chunkError) {
          console.error('Error loading recipe chunk:', chunkError);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          continue;
        }
      }

      if (allRecipes.length === 0 && retryCount >= MAX_RETRIES) {
        throw new Error('Failed to load recipes after multiple attempts');
      }

      set({ loading: false });
    } catch (error) {
      console.error('Error in loadRecipes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false 
      });

      if (__DEV__) {
        console.log('Loading mock recipes in development');
        set({ recipes: mockRecipes, loading: false });
      }
    }
  },

  searchRecipes: async (query: string, filters?: RecipeFilters) => {
    try {
      set({ loading: true, error: null });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let recipeQuery = getTypedRecipes()
        .order('rating', { ascending: false });

      // Apply text search if query exists
      if (query) {
        recipeQuery = recipeQuery.textSearch('title', query);
      }

      // Apply filters
      if (filters) {
        if (filters.tags?.length) {
          recipeQuery = recipeQuery.contains('tags', filters.tags);
        }
        if (filters.dietType?.length) {
          recipeQuery = recipeQuery.contains('diet_type', filters.dietType);
        }
        if (filters.maxPrepTime) {
          recipeQuery = recipeQuery.lte('prep_time', filters.maxPrepTime);
        }
        if (filters.minRating) {
          recipeQuery = recipeQuery.gte('rating', filters.minRating);
        }
      }

      const { data, error } = await recipeQuery
        .limit(50)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;

      if (!data || data.length === 0) {
        set({ recipes: [], loading: false });
        return;
      }

      const transformedRecipes = data.map((recipe: RecipeData) => ({
        id: recipe.id,
        title: recipe.title?.trim() || 'Untitled Recipe',
        description: recipe.description?.trim() || '',
        image: recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        time: recipe.total_time || `${recipe.prep_time || 0} min`,
        calories: typeof recipe.calories === 'number' ? `${recipe.calories} kcal` : '0 kcal',
        servings: recipe.servings || 4,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        nutrition: {
          protein: recipe.nutrition?.protein || '0g',
          carbs: recipe.nutrition?.carbs || '0g',
          fat: recipe.nutrition?.fat || '0g',
          fiber: recipe.nutrition?.fiber || '0g'
        },
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        rating: typeof recipe.rating === 'number' ? recipe.rating : 0,
        dietType: Array.isArray(recipe.diet_type) ? recipe.diet_type : [],
        prepTime: typeof recipe.prep_time === 'number' ? recipe.prep_time : 0
      }));

      set({ recipes: transformedRecipes, loading: false });
    } catch (error) {
      console.error('Error searching recipes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        loading: false 
      });
    }
  },

  refreshRecipes: async () => {
    const currentState = get();
    if (currentState.searchQuery || currentState.selectedTags.length > 0) {
      await currentState.searchRecipes(currentState.searchQuery, {
        tags: currentState.selectedTags
      });
    } else {
      await currentState.loadRecipes();
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