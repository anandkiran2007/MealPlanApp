import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight, Filter, Plus, Sparkles } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useMealPlanStore } from '../../store/mealPlanStore';

export default function MealPlansScreen() {
  const router = useRouter();
  const { mealPlans, loading, error, fetchMealPlans } = useMealPlanStore();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const handleGenerateMealPlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/meal-plans/new');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Meal Plans" 
        showNotification 
        onNotificationPress={() => {}}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.aiGeneratorCard}>
            <View style={styles.aiGeneratorContent}>
              <View style={styles.aiIconContainer}>
                <Sparkles size={24} color="#FFFFFF" />
              </View>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>AI Meal Planner</Text>
                <Text style={styles.aiDescription}>
                  Generate a personalized meal plan based on your preferences and nutrition goals.
                </Text>
              </View>
            </View>
            <Button 
              title="Generate Plan" 
              onPress={handleGenerateMealPlan} 
              loading={isGenerating}
              style={styles.generateButton}
            />
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#64748B" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/meal-plans/new')}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.createText}>Create Plan</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Your Meal Plans</Text>
          
          {mealPlans.map((plan) => (
            <TouchableOpacity 
              key={plan.id} 
              style={styles.mealPlanCard}
              onPress={() => router.push(`/meal-plans/${plan.id}`)}
            >
              <View style={styles.mealPlanHeader}>
                <View style={styles.iconContainer}>
                  <Calendar size={20} color="#22C55E" />
                </View>
                <View style={styles.mealPlanInfo}>
                  <Text style={styles.mealPlanTitle}>{plan.title}</Text>
                  <Text style={styles.mealPlanDays}>{plan.days.length} days</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </View>
              <Text style={styles.mealPlanDescription} numberOfLines={2}>
                {plan.description}
              </Text>
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{plan.nutritionGoals.calories}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>{plan.nutritionGoals.protein}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                  <Text style={styles.nutritionValue}>{plan.nutritionGoals.carbs}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  aiGeneratorCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  aiGeneratorContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
  },
  aiDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  generateButton: {
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  mealPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealPlanInfo: {
    flex: 1,
  },
  mealPlanTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  mealPlanDays: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  mealPlanDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  nutritionValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#1E293B',
  },
});