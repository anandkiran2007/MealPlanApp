import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Meal Planner',
  slug: 'meal-planner-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'mealplanner',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.mealplanner.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.mealplanner.app'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
    build: {
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@supabase/supabase-js',
          '@expo/vector-icons',
          'react-native-reanimated',
          '@react-native-async-storage/async-storage'
        ]
      }
    },
    backgroundColor: '#ffffff',
    name: 'Meal Planner',
    themeColor: '#ffffff',
    lang: 'en',
    startUrl: '/',
    display: 'standalone'
  },
  plugins: [
    'expo-router',
    // Add any additional plugins here
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  },
  extra: {
    eas: {
      projectId: 'your-project-id'
    }
  },
  // Add development-specific configuration
  developmentClient: {
    silentLaunch: true
  },
  // Add updates configuration
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/your-project-id'
  }
};

export default config;