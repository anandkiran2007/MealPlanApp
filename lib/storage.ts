import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Create a storage adapter that works on both web and native
export const createStorage = (secure = false) => {
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => {
        try {
          const value = window.localStorage.getItem(key);
          return Promise.resolve(value);
        } catch (e) {
          return Promise.resolve(null);
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (e) {
          return Promise.resolve();
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        } catch (e) {
          return Promise.resolve();
        }
      }
    };
  }

  // For native platforms, use SecureStore for sensitive data, AsyncStorage for regular data
  return secure ? {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync
  } : AsyncStorage;
};

// Export instances for different storage types
export const appStorage = createStorage(false);
export const secureStorage = createStorage(true);