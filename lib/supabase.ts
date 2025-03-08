import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { appStorage } from './storage';

// Initialize Supabase with proper error handling and platform-specific config
const initSupabase = () => {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Platform-specific storage configuration
    const storage = Platform.select({
      web: {
        getItem: async (key: string) => {
          const value = window.localStorage.getItem(key);
          return value;
        },
        setItem: async (key: string, value: string) => {
          window.localStorage.setItem(key, value);
        },
        removeItem: async (key: string) => {
          window.localStorage.removeItem(key);
        }
      },
      default: appStorage
    });

    return createClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          storage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: Platform.OS === 'web'
        }
      }
    );
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
};

export const supabase = initSupabase();

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL && 
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
};