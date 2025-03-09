import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame, Users, Heart, Bookmark, Share2, ChefHat, ShoppingBag } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import NutritionBadge from '../../components/NutritionBadge';
import MealTracker from '../../components/MealTracker';
import { useShoppingListStore } from '../../store/shoppingListStore';
import { mockRecipes } from '../../data/mockData';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMealTracker, setShowMealTracker] = useState(false);
  
  const recipe = mockRecipes.find(r => r.id === id);
  const { addRecipeIngredients, generateSmartList } = useShoppingListStore();
  
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Header title="Recipe Not Found" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareRecipe = () => {
    // Share functionality would be implemented here
    console.log('Sharing recipe:', recipe.title);
  };

  const addToShoppingList = () => {
    addRecipeIngredients(recipe);
    router.push('/shopping');
  };

  const startCooking = () => {
    setShowMealTracker(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image 
          source={{ uri: recipe.image }}
          style={styles.image}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Clock size={20} color="#64748B" />
              <Text style={styles.statText}>{recipe.time}</Text>
            </View>
            <View style={styles.stat}>
              <Flame size={20} color="#64748B" />
              <Text style={styles.statText}>{recipe.calories}</Text>
            </View>
            <View style={styles.stat}>
              <Users size={20} color="#64748B" />
              <Text style={styles.statText}>{recipe.servings} servings</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, isFavorite && styles.actionButtonActive]}
              onPress={toggleFavorite}
            >
              <Heart 
                size={20} 
                color={isFavorite ? '#DC2626' : '#64748B'} 
                fill={isFavorite ? '#DC2626' : 'none'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, isBookmarked && styles.actionButtonActive]}
              onPress={toggleBookmark}
            >
              <Bookmark 
                size={20} 
                color={isBookmarked ? '#22C55E' : '#64748B'} 
                fill={isBookmarked ? '#22C55E' : 'none'}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={shareRecipe}
            >
              <Share2 size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutrition per serving</Text>
            <View style={styles.nutritionGrid}>
              <NutritionBadge
                label="Protein"
                value={recipe.nutrition.protein}
                color="#22C55E"
              />
              <NutritionBadge
                label="Carbs"
                value={recipe.nutrition.carbs}
                color="#3B82F6"
              />
              <NutritionBadge
                label="Fat"
                value={recipe.nutrition.fat}
                color="#F59E0B"
              />
              <NutritionBadge
                label="Fiber"
                value={recipe.nutrition.fiber}
                color="#8B5CF6"
              />
            </View>
          </View>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Start Cooking"
          onPress={startCooking}
          style={styles.cookButton}
          icon={<ChefHat size={20} color="#FFFFFF" />}
        />
        <Button 
          title="Add to Shopping List"
          onPress={addToShoppingList}
          variant="outline"
          style={styles.shoppingButton}
          icon={<ShoppingBag size={20} color="#22C55E" />}
        />
      </View>

      <Modal
        visible={showMealTracker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <MealTracker 
          recipe={recipe}
          onClose={() => setShowMealTracker(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  nutritionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  ingredientsContainer: {
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    fontFamily: 'Poppins-SemiBold',
  },
  instructionText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  cookButton: {
    flex: 1,
    backgroundColor: '#22C55E',
  },
  shoppingButton: {
    flex: 1,
    borderColor: '#22C55E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  errorButton: {
    backgroundColor: '#22C55E',
  },
});