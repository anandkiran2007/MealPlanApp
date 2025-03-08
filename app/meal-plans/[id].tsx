import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Clock, Users, ChefHat } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useMealPlanStore } from '../../store/mealPlanStore';
import { Recipe } from '../../types';
import { RecipeCard } from '../../components/RecipeCard';

export default function MealPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { mealPlans } = useMealPlanStore();
  const mealPlan = mealPlans.find(plan => plan.id === id);

  useEffect(() => {
    if (!mealPlan && id) {
      setError('Meal plan not found');
    }
    setLoading(false);
  }, [mealPlan, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Loading..." showBack={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </View>
    );
  }

  if (error || !mealPlan) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Meal plan not found'}</Text>
          <Link href="/meal-plans" asChild>
            <Button 
              title="Go to Meal Plans" 
              style={styles.errorButton}
              onPress={() => {}}
            />
          </Link>
        </View>
      </View>
    );
  }

  const RecipeModal = ({ recipe }: { recipe: Recipe | null }) => {
    if (!recipe) return null;

    // Clean the ingredients array - remove quotes and brackets
    const cleanIngredients = (ingredients: string[]) => {
      return ingredients.map(ingredient => {
        return ingredient.replace(/[\[\]"]/g, '').trim();
      });
    };

    // Clean the instructions array
    const cleanInstructions = (instructions: string[]) => {
      return instructions.map(instruction => {
        return instruction.replace(/[\[\]"]/g, '').trim();
      });
    };

    return (
      <View style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedRecipe(null)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Image 
            source={{ uri: recipe.image }}
            style={styles.modalImage}
            defaultSource={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
          />

          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>{recipe.title}</Text>
            <Text style={styles.modalDescription}>{recipe.description}</Text>

            <View style={styles.modalInfoContainer}>
              <View style={styles.modalInfoItem}>
                <Clock size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.time}</Text>
              </View>
              <View style={styles.modalInfoItem}>
                <ChefHat size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.calories}</Text>
              </View>
              <View style={styles.modalInfoItem}>
                <Users size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.servings} servings</Text>
              </View>
            </View>

            <View style={styles.modalNutritionContainer}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.modalNutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.protein}</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.fat}</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutrition.fiber}</Text>
                  <Text style={styles.nutritionLabel}>Fiber</Text>
                </View>
              </View>
            </View>

            <View style={styles.ingredientsSection}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {cleanIngredients(recipe.ingredients).map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            <View style={styles.instructionsSection}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {cleanInstructions(recipe.instructions).map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            {recipe.tags && recipe.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{mealPlan.title}</Text>
        <Text style={styles.description}>{mealPlan.description}</Text>
      </View>

      <View style={styles.nutritionSummary}>
        <Text style={styles.sectionTitle}>Total Nutrition</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Calories</Text>
            <Text style={styles.nutritionValue}>{mealPlan.nutritionGoals.calories}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionValue}>{mealPlan.nutritionGoals.protein}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionValue}>{mealPlan.nutritionGoals.carbs}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Fat</Text>
            <Text style={styles.nutritionValue}>{mealPlan.nutritionGoals.fat}</Text>
          </View>
        </View>
      </View>

      {mealPlan.days.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day.day}</Text>
          
          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>Breakfast</Text>
            <RecipeCard 
              recipe={day.meals.breakfast} 
              onPress={() => setSelectedRecipe(day.meals.breakfast)}
            />
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>Lunch</Text>
            <RecipeCard 
              recipe={day.meals.lunch}
              onPress={() => setSelectedRecipe(day.meals.lunch)}
            />
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>Dinner</Text>
            <RecipeCard 
              recipe={day.meals.dinner}
              onPress={() => setSelectedRecipe(day.meals.dinner)}
            />
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Button 
          title="Add All Ingredients to Shopping List" 
          onPress={() => router.push('/shopping')}
          style={styles.addButton}
        />
      </View>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
  },
  nutritionSummary: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  modalNutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  nutritionItem: {
    width: '48%',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  dayContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  mealSection: {
    marginBottom: 20,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  addButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
  errorButton: {
    width: 200,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalBody: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 8,
  },
  modalNutritionContainer: {
    marginBottom: 24,
  },
  ingredientsSection: {
    marginTop: 24,
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
    color: '#212529',
    flex: 1,
  },
  instructionsSection: {
    marginTop: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  instructionText: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    marginBottom: 32,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#6c757d',
  },
});