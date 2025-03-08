import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';

// Mark the component as a Client Component if you need interactivity
export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchMealPlans() {
      try {
        const { data, error } = await supabase
          .from('meal_plans')
          .select(`
            *,
            meal_plan_days (
              *,
              breakfast_recipe:recipes!breakfast_recipe_id(*),
              lunch_recipe:recipes!lunch_recipe_id(*),
              dinner_recipe:recipes!dinner_recipe_id(*)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMealPlans(data || []);
      } catch (err) {
        console.error('Error fetching meal plans:', err);
        setError(err instanceof Error ? err.message : 'Failed to load meal plans');
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading meal plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
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
        {mealPlans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
            {plan.meal_plan_days?.map((day: any) => (
              <View key={day.id} style={styles.dayContainer}>
                <Text style={styles.dayTitle}>Day {day.day_number}</Text>
                <View style={styles.mealsContainer}>
                  <Text>Breakfast: {day.breakfast_recipe?.title}</Text>
                  <Text>Lunch: {day.lunch_recipe?.title}</Text>
                  <Text>Dinner: {day.dinner_recipe?.title}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  planDescription: {
    color: '#666',
    marginBottom: 16
  },
  dayContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  mealsContainer: {
    gap: 8
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
}); 