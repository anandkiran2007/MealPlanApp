const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Merge with default config
module.exports = {
  ...defaultConfig,
  
  // Configure caching
  cacheStores: undefined, // Remove custom cache stores to use Metro's default

  // Optimize transformer
  transformer: {
    ...defaultConfig.transformer,
    minifierConfig: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        dead_code: true,
        unused: true,
        if_return: true,
        sequences: true
      }
    },
    assetPlugins: ['expo-asset/tools/hashAssetFiles']
  },

  // Optimize resolver
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
    assetExts: [...defaultConfig.resolver.assetExts, 'db']
  }
};