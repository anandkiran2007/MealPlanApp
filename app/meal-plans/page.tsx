import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { useMealPlanStore, MAX_MEAL_PLANS } from '@/store/mealPlanStore';
import Button from '@/components/Button';

// Mark the component as a Client Component if you need interactivity
export default function MealPlansPage() {
  const router = useRouter();
  const { mealPlans, deleteMealPlan } = useMealPlanStore();
  const [loading, setLoading] = React.useState(false);

  const handleGeneratePress = () => {
    router.push('/meal-plans/generate');
  };

  const handleDeletePlan = (id: string) => {
    deleteMealPlan(id);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading meal plans...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Your Meal Plans',
          headerLargeTitle: true
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.planCount}>
            <Text style={styles.planCountText}>
              {mealPlans.length}/{MAX_MEAL_PLANS} Meal Plans
            </Text>
            {mealPlans.length >= MAX_MEAL_PLANS && (
              <Text style={styles.limitWarning}>
                You've reached the maximum number of meal plans. Delete a plan to create a new one.
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.generateButton,
              mealPlans.length >= MAX_MEAL_PLANS && styles.generateButtonDisabled
            ]}
            onPress={handleGeneratePress}
            disabled={mealPlans.length >= MAX_MEAL_PLANS}
          >
            <View style={styles.generateButtonContent}>
              <Plus size={20} color={mealPlans.length >= MAX_MEAL_PLANS ? '#9CA3AF' : '#FFFFFF'} />
              <Text style={[
                styles.generateButtonText,
                mealPlans.length >= MAX_MEAL_PLANS && styles.generateButtonTextDisabled
              ]}>
                Generate New Plan
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {mealPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeletePlan(plan.id)}
              >
                <Trash2 size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>

            <View style={styles.nutritionSummary}>
              <Text style={styles.sectionTitle}>Total Nutrition</Text>
              <View style={styles.nutritionGrid}>
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
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                  <Text style={styles.nutritionValue}>{plan.nutritionGoals.fat}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => router.push(`/meal-plans/${plan.id}`)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}

        {mealPlans.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Meal Plans Yet</Text>
            <Text style={styles.emptyStateText}>
              Generate your first meal plan to get started with your healthy eating journey.
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  planCount: {
    marginBottom: 12,
  },
  planCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  limitWarning: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: 4,
  },
  generateButton: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  } as ViewStyle,
  generateButtonDisabled: {
    backgroundColor: '#E5E7EB',
  } as ViewStyle,
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  } as ViewStyle,
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  generateButtonTextDisabled: {
    color: '#9CA3AF',
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  nutritionSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  viewDetailsButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 