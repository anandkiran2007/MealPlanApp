import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react-native';
import Header from '../../components/Header';
import MealCard from '../../components/MealCard';
import Button from '../../components/Button';
import { useMealPlanStore } from '../../store/mealPlanStore';

export default function MealPlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [expandedDays, setExpandedDays] = useState<string[]>(['Monday']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mealPlan = useMealPlanStore(state => state.currentPlan);

  useEffect(() => {
    // If there's no meal plan and we have an ID, we should show an error
    if (!mealPlan && id) {
      setError('Meal plan not found');
    }
    setLoading(false);
  }, [mealPlan, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Loading..." showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </View>
    );
  }

  if (error || !mealPlan) {
    return (
      <View style={styles.container}>
        <Header title="Meal Plan Not Found" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Meal plan not found'}</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.errorButton}
          />
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
                  <MealCard
                    title={day.meals.breakfast.title}
                    image={day.meals.breakfast.image}
                    time={day.meals.breakfast.time}
                    calories={day.meals.breakfast.calories}
                    servings={day.meals.breakfast.servings}
                    onPress={() => router.push(`/recipes/${day.meals.breakfast.id}`)}
                  />
                  
                  <Text style={styles.mealTypeTitle}>Lunch</Text>
                  <MealCard
                    title={day.meals.lunch.title}
                    image={day.meals.lunch.image}
                    time={day.meals.lunch.time}
                    calories={day.meals.lunch.calories}
                    servings={day.meals.lunch.servings}
                    onPress={() => router.push(`/recipes/${day.meals.lunch.id}`)}
                  />
                  
                  <Text style={styles.mealTypeTitle}>Dinner</Text>
                  <MealCard
                    title={day.meals.dinner.title}
                    image={day.meals.dinner.image}
                    time={day.meals.dinner.time}
                    calories={day.meals.dinner.calories}
                    servings={day.meals.dinner.servings}
                    onPress={() => router.push(`/recipes/${day.meals.dinner.id}`)}
                  />
                  
                  {day.meals.snacks.length > 0 && (
                    <>
                      <Text style={styles.mealTypeTitle}>Snacks</Text>
                      {day.meals.snacks.map((snack) => (
                        <MealCard
                          key={snack.id}
                          title={snack.title}
                          image={snack.image}
                          time={snack.time}
                          calories={snack.calories}
                          servings={snack.servings}
                          onPress={() => router.push(`/recipes/${snack.id}`)}
                        />
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
});