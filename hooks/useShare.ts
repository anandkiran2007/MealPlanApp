import { Platform, Share } from 'react-native';
import { Recipe } from '../types';

export const useShare = () => {
  const shareRecipe = async (recipe: Recipe) => {
    try {
      const message = `Check out this recipe: ${recipe.title}\n\n` +
        `Preparation time: ${recipe.time}\n` +
        `Calories: ${recipe.calories}\n` +
        `Servings: ${recipe.servings}\n\n` +
        `${recipe.description}\n\n` +
        `Ingredients:\n${recipe.ingredients.join('\n')}\n\n` +
        `Instructions:\n${recipe.instructions.join('\n')}`;

      if (Platform.OS === 'web') {
        await navigator.share({
          title: recipe.title,
          text: message,
        });
      } else {
        await Share.share({
          title: recipe.title,
          message,
        });
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return { shareRecipe };
};