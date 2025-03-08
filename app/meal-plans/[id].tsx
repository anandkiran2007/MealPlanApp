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

    // Calculate nutrition values based on calories
    const calculateNutrition = (calories: number) => {
      // Using common macro ratios: 30% protein, 40% carbs, 30% fat
      const proteinCal = calories * 0.3;  // 30% from protein
      const carbsCal = calories * 0.4;    // 40% from carbs
      const fatCal = calories * 0.3;      // 30% from fat

      // Convert calories to grams
      // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
      const protein = Math.round(proteinCal / 4);
      const carbs = Math.round(carbsCal / 4);
      const fat = Math.round(fatCal / 9);
      const fiber = Math.round(carbs * 0.1); // Estimate fiber as 10% of carbs

      return {
        protein: `${protein}g`,
        carbs: `${carbs}g`,
        fat: `${fat}g`,
        fiber: `${fiber}g`
      };
    };

    // Format calories display and calculate nutrition
    const formatCalories = (calories: string | number) => {
      const cal = typeof calories === 'string' ? parseInt(calories) : calories;
      return {
        display: `${cal.toLocaleString()} cal`,
        value: cal
      };
    };

    const calories = formatCalories(recipe.calories);
    const calculatedNutrition = calculateNutrition(calories.value);
    const nutrition = {
      protein: recipe.nutrition.protein === '0g' ? calculatedNutrition.protein : recipe.nutrition.protein,
      carbs: recipe.nutrition.carbs === '0g' ? calculatedNutrition.carbs : recipe.nutrition.carbs,
      fat: recipe.nutrition.fat === '0g' ? calculatedNutrition.fat : recipe.nutrition.fat,
      fiber: recipe.nutrition.fiber === '0g' ? calculatedNutrition.fiber : recipe.nutrition.fiber
    };

    // Enhanced cleaning function for ingredients
    const cleanIngredients = (ingredients: string[]) => {
      return ingredients.map(ingredient => {
        // Remove brackets, quotes, and escape characters
        let cleaned = ingredient
          .replace(/[\[\]"\\]/g, '')
          .replace(/\\n/g, ' ')
          .trim();
        
        // Handle common fractions
        cleaned = cleaned
          .replace('1/2', '½')
          .replace('1/3', '⅓')
          .replace('2/3', '⅔')
          .replace('1/4', '¼')
          .replace('3/4', '¾');
        
        // Capitalize first letter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }).filter(ingredient => ingredient.length > 0);
    };

    // Enhanced cleaning function for instructions
    const cleanInstructions = (instructions: string[]) => {
      return instructions.map(instruction => {
        // Remove brackets, quotes, and escape characters
        let cleaned = instruction
          .replace(/[\[\]"\\]/g, '')
          .replace(/\\n/g, ' ')
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim();
        
        // Handle temperature formats
        cleaned = cleaned
          .replace(/(\d+)\\u00b0/g, '$1°')  // Replace unicode degree symbol
          .replace(/(\d+)\s*degrees?/gi, '$1°');  // Replace "degrees" with °
        
        // Capitalize first letter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }).filter(instruction => instruction.length > 0);
    };

    // Format time display
    const formatTime = (time: string) => {
      if (!time) return '';
      // Convert "HH:MM:SS" format to readable time
      if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        if (totalMinutes >= 60) {
          const h = Math.floor(totalMinutes / 60);
          const m = totalMinutes % 60;
          return `${h}h ${m > 0 ? `${m}m` : ''}`;
        }
        return `${totalMinutes}m`;
      }
      return time;
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
            <Text style={styles.modalDescription}>
              {recipe.description.replace(/[\[\]"]/g, '').trim()}
            </Text>

            <View style={styles.modalInfoContainer}>
              <View style={styles.modalInfoItem}>
                <Clock size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{formatTime(recipe.time)}</Text>
              </View>
              <View style={styles.modalInfoItem}>
                <ChefHat size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{calories.display}</Text>
              </View>
              <View style={styles.modalInfoItem}>
                <Users size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.servings} servings</Text>
              </View>
            </View>

            <View style={styles.modalNutritionContainer}>
              <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
              <View style={styles.modalNutritionGrid}>
                <View style={[styles.nutritionItem, styles.nutritionItemModal]}>
                  <Text style={styles.nutritionValue}>{nutrition.protein}</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={[styles.nutritionItem, styles.nutritionItemModal]}>
                  <Text style={styles.nutritionValue}>{nutrition.carbs}</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={[styles.nutritionItem, styles.nutritionItemModal]}>
                  <Text style={styles.nutritionValue}>{nutrition.fat}</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
                <View style={[styles.nutritionItem, styles.nutritionItemModal]}>
                  <Text style={styles.nutritionValue}>{nutrition.fiber}</Text>
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
                    <Text style={styles.tagText}>
                      {tag.replace(/[\[\]"]/g, '').trim()}
                    </Text>
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
  nutritionItemModal: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});