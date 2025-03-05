import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { appStorage } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface UserState {
  profile: UserProfile;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleNotifications: () => void;
  toggleDarkMode: () => void;
  fetchProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: 'Guest User',
  familySize: 1,
  dietaryPreferences: [],
  allergies: [],
  nutritionGoals: {
    calories: '2000 kcal',
    protein: '100g',
    carbs: '250g',
    fat: '65g'
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      notificationsEnabled: true,
      darkModeEnabled: false,
      loading: false,
      error: null,

      updateProfile: async (updates) => {
        try {
          set({ loading: true, error: null });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No authenticated user');

          const { error } = await supabase
            .from('users')
            .update({
              name: updates.name,
              family_size: updates.familySize,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (error) throw error;

          set((state) => ({
            profile: { ...state.profile, ...updates },
            loading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      toggleNotifications: () => {
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled }));
      },

      toggleDarkMode: () => {
        set((state) => ({ darkModeEnabled: !state.darkModeEnabled }));
      },

      fetchProfile: async () => {
        try {
          set({ loading: true, error: null });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No authenticated user');

          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            set({
              profile: {
                name: data.name || defaultProfile.name,
                familySize: data.family_size || defaultProfile.familySize,
                dietaryPreferences: data.dietary_preferences || defaultProfile.dietaryPreferences,
                allergies: data.allergies || defaultProfile.allergies,
                nutritionGoals: data.nutrition_goals || defaultProfile.nutritionGoals
              },
              loading: false
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => appStorage)
    }
  )
);