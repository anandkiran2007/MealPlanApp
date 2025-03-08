import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Clock, Users, ChefHat } from 'lucide-react-native';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  mealType?: string;
}

export function RecipeCard({ recipe, onPress, mealType }: RecipeCardProps) {
  // Clean the ingredients array - remove quotes and brackets
  const cleanIngredients = (ingredients: string[]) => {
    return ingredients.map(ingredient => {
      return ingredient.replace(/[\[\]"]/g, '').trim();
    });
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      {mealType && (
        <Text style={styles.mealType}>{mealType}</Text>
      )}
      <Image 
        source={{ uri: recipe.image }} 
        style={styles.image}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#6c757d" />
            <Text style={styles.infoText}>{recipe.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={16} color="#6c757d" />
            <Text style={styles.infoText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.infoItem}>
            <ChefHat size={16} color="#6c757d" />
            <Text style={styles.infoText}>{recipe.calories}</Text>
          </View>
        </View>

        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionValue}>{recipe.nutrition.protein}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fat</Text>
            <Text style={styles.nutritionValue}>{recipe.nutrition.fat}</Text>
          </View>
        </View>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {cleanIngredients(recipe.ingredients).slice(0, 3).map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
            ))}
            {recipe.ingredients.length > 3 && (
              <Text style={styles.moreText}>+{recipe.ingredients.length - 3} more ingredients</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#495057',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  ingredientsContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  moreText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  mealType: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
    padding: 8,
    paddingBottom: 0,
    fontFamily: 'Poppins-SemiBold',
  },
}); 