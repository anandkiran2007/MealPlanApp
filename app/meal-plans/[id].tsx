import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Calendar, ChevronDown, ChevronUp, Clock, Flame, Users, ArrowLeft } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useMealPlanStore } from '../../store/mealPlanStore';
import { Recipe } from '../../types';

export default function MealPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [expandedDays, setExpandedDays] = useState<string[]>(['Monday']);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mealPlan = useMealPlanStore(state => state.currentPlan);

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
            />
          </Link>
        </View>
      </View>
    );
  }

  const toggleDay = (day: string) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter(d => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  const addAllToShoppingList = () => {
    router.push('/shopping');
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => setSelectedRecipe(recipe)}
    >
      <Image 
        source={{ uri: recipe.image }}
        style={styles.recipeImage}
        defaultSource={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }}
      />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.infoText}>{recipe.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <Flame size={16} color="#64748B" />
            <Text style={styles.infoText}>{recipe.calories}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={16} color="#64748B" />
            <Text style={styles.infoText}>{recipe.servings} servings</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RecipeModal = ({ recipe }: { recipe: Recipe | null }) => {
    if (!recipe) return null;

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
                <Flame size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.calories}</Text>
              </View>
              <View style={styles.modalInfoItem}>
                <Users size={20} color="#64748B" />
                <Text style={styles.modalInfoText}>{recipe.servings} servings</Text>
              </View>
            </View>

            <View style={styles.nutritionContainer}>
              <Text style={styles.sectionTitle}>Nutrition</Text>
              <View style={styles.nutritionGrid}>
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
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            <View style={styles.instructionsSection}>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Meal Plan Details" showBack />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Calendar size={24} color="#22C55E" />
          </View>
          <View>
            <Text style={styles.title}>{mealPlan.title}</Text>
            <Text style={styles.subtitle}>{mealPlan.days.length} days</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.description}>{mealPlan.description}</Text>
          
          <View style={styles.nutritionContainer}>
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
          
          <Text style={styles.sectionTitle}>Daily Meal Plan</Text>
          
          {mealPlan.days.map((day) => (
            <View key={day.day} style={styles.dayContainer}>
              <TouchableOpacity 
                style={styles.dayHeader}
                onPress={() => toggleDay(day.day)}
              >
                <Text style={styles.dayTitle}>{day.day}</Text>
                {expandedDays.includes(day.day) ? (
                  <ChevronUp size={20} color="#64748B" />
                ) : (
                  <ChevronDown size={20} color="#64748B" />
                )}
              </TouchableOpacity>
              
              {expandedDays.includes(day.day) && (
                <View style={styles.mealsContainer}>
                  <Text style={styles.mealTypeTitle}>Breakfast</Text>
                  <RecipeCard recipe={day.meals.breakfast} />
                  
                  <Text style={styles.mealTypeTitle}>Lunch</Text>
                  <RecipeCard recipe={day.meals.lunch} />
                  
                  <Text style={styles.mealTypeTitle}>Dinner</Text>
                  <RecipeCard recipe={day.meals.dinner} />
                  
                  {day.meals.snacks.length > 0 && (
                    <>
                      <Text style={styles.mealTypeTitle}>Snacks</Text>
                      {day.meals.snacks.map((snack) => (
                        <RecipeCard key={snack.id} recipe={snack} />
                      ))}
                    </>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Add All Ingredients to Shopping List" 
          onPress={addAllToShoppingList} 
          style={styles.addButton}
        />
      </View>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1E293B',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  content: {
    padding: 16,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    marginBottom: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  nutritionValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  dayContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dayTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  mealsContainer: {
    padding: 16,
  },
  mealTypeTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
    marginTop: 8,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
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
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
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
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
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
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 8,
  },
  modalDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalInfoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
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
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#22C55E',
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
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
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
});