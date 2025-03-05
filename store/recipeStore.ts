import { create } from 'zustand';
import { Recipe } from '../types';
import { mockRecipes } from '../data/mockData';

interface RecipeState {
  recipes: Recipe[];
  favorites: Set<string>;
  bookmarks: Set<string>;
  searchQuery: string;
  selectedTags: string[];
  toggleFavorite: (id: string) => void;
  toggleBookmark: (id: string) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  getFilteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: mockRecipes,
  favorites: new Set(),
  bookmarks: new Set(),
  searchQuery: '',
  selectedTags: [],

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
        recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase());

      const matchesTags =
        state.selectedTags.length === 0 ||
        state.selectedTags.some((tag) => recipe.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  },
}));