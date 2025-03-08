import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';

interface MealPlanGeneratorProps {
  duration: number;
  preferences?: string[];
  familySize: number;
  nutritionGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  calories: number;
  prep_time: number;
  total_time: string;
  diet_type: string[];
  cuisine_type: string;
  difficulty_level: string;
  servings: number;
}

export default function MealPlanGenerator({
  duration,
  preferences = [],
  familySize,
  nutritionGoals
}: MealPlanGeneratorProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [debugData, setDebugData] = React.useState<any>(null);

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);
    setDebugData(null);
    
    try {
      console.log('Fetching recipes from Supabase...');
      
      // Fetch all available recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          calories,
          prep_time,
          total_time,
          diet_type,
          cuisine_type,
          difficulty_level,
          servings
        `)
        .limit(20); // Increased limit for more variety

      // Save debug data
      setDebugData({ recipes, error: recipesError });

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        throw new Error('Failed to fetch recipes');
      }

      if (!recipes || recipes.length === 0) {
        console.error('No recipes found in the database');
        throw new Error('No recipes available for meal planning');
      }

      console.log('Successfully fetched recipes:', recipes.length);

      // Create a new meal plan
      const { data: mealPlan, error: mealPlanError } = await supabase
        .from('meal_plans')
        .insert([
          {
            title: `${duration}-Day Meal Plan`,
            description: `Generated meal plan for ${familySize} people`,
            preferences: preferences,
            family_size: familySize,
            nutrition_goals: nutritionGoals,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (mealPlanError) {
        console.error('Error creating meal plan:', mealPlanError);
        throw new Error('Failed to create meal plan');
      }

      console.log('Created meal plan:', mealPlan.id);

      // Create meal plan days
      const mealPlanDays = [];
      for (let i = 0; i < duration; i++) {
        // Randomly select recipes for each meal
        const breakfast = recipes[Math.floor(Math.random() * recipes.length)];
        const lunch = recipes[Math.floor(Math.random() * recipes.length)];
        const dinner = recipes[Math.floor(Math.random() * recipes.length)];

        mealPlanDays.push({
          meal_plan_id: mealPlan.id,
          day_number: i + 1,
          breakfast_recipe_id: breakfast.id,
          lunch_recipe_id: lunch.id,
          dinner_recipe_id: dinner.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      console.log('Creating meal plan days...');
      const { error: daysError } = await supabase
        .from('meal_plan_days')
        .insert(mealPlanDays);

      if (daysError) {
        console.error('Error creating meal plan days:', daysError);
        throw new Error('Failed to create meal plan days');
      }

      console.log('Meal plan generated successfully:', {
        mealPlanId: mealPlan.id,
        numberOfDays: duration,
        numberOfRecipes: recipes.length,
        totalMeals: mealPlanDays.length * 3
      });
      
    } catch (err) {
      console.error('Error in meal plan generation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={generateMealPlan}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Generate Meal Plan</Text>
        )}
      </TouchableOpacity>

      {/* Debug View */}
      {debugData && (
        <ScrollView style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Available Recipes:</Text>
          {debugData.error ? (
            <Text style={styles.errorText}>Error: {JSON.stringify(debugData.error, null, 2)}</Text>
          ) : debugData.recipes?.length > 0 ? (
            <>
              <Text style={styles.debugSubtitle}>Found {debugData.recipes.length} recipes</Text>
              {debugData.recipes.map((recipe: Recipe) => (
                <View key={recipe.id} style={styles.recipeDebug}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text>Description: {recipe.description?.slice(0, 100)}...</Text>
                  <Text>Calories: {recipe.calories}</Text>
                  <Text>Prep Time: {recipe.prep_time} minutes</Text>
                  <Text>Total Time: {recipe.total_time}</Text>
                  <Text>Diet Types: {recipe.diet_type?.join(', ') || 'None'}</Text>
                  <Text>Cuisine: {recipe.cuisine_type}</Text>
                  <Text>Difficulty: {recipe.difficulty_level}</Text>
                  <Text>Servings: {recipe.servings}</Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No recipes found in the database</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    maxHeight: 400,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  debugSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  recipeDebug: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 8,
    gap: 4,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
}); 