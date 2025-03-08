import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Sparkles } from 'lucide-react-native';
import MealCard from '../../components/MealCard';
import Button from '../../components/Button';
import { mockRecipes, mockMealPlans, mockUserProfile } from '../../data/mockData';


export default function HomeScreen() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMealPlan = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/meal-plans');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {mockUserProfile.name}!</Text>
            <Text style={styles.subGreeting}>Ready for some meal inspiration?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Meal Plans</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/meal-plans')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#22C55E" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mealPlansContainer}
          >
            {mockMealPlans.map((plan) => (
              <TouchableOpacity 
                key={plan.id} 
                style={styles.mealPlanCard}
                onPress={() => router.push(`/meal-plans/${plan.id}`)}
              >
                <Text style={styles.mealPlanTitle}>{plan.title}</Text>
                <Text style={styles.mealPlanDescription} numberOfLines={2}>
                  {plan.description}
                </Text>
                <View style={styles.mealPlanFooter}>
                  <Text style={styles.mealPlanDays}>{plan.days.length} days</Text>
                  <ChevronRight size={16} color="#64748B" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Recipes</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/recipes')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color="#22C55E" />
            </TouchableOpacity>
          </View>
          
          {mockRecipes.slice(0, 3).map((recipe) => (
            <MealCard
              key={recipe.id}
              title={recipe.title}
              image={recipe.image}
              time={recipe.time}
              calories={recipe.calories}
              servings={recipe.servings}
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  aiGeneratorCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#22C55E',
    marginRight: 4,
  },
  mealPlansContainer: {
    paddingRight: 16,
  },
  mealPlanCard: {
    width: 250,
    padding: 16,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mealPlanTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  mealPlanDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  mealPlanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPlanDays: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
});