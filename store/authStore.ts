import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '../lib/storage';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: any | null;
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),

      initialize: async () => {
        try {
          set({ loading: true });
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          set({ 
            session, 
            user: session?.user ?? null,
            error: null 
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ 
            session: null, 
            user: null,
            error: (error as Error).message 
          });
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ session: data.session, user: data.user });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ session: data.session, user: data.user });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ session: null, user: null });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        session: state.session,
        user: state.user
      })
    }
  )
);