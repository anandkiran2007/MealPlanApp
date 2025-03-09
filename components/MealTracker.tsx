import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ChefHat, Clock, Users, Check, AlertTriangle } from 'lucide-react-native';
import { Recipe } from '../types';
import { useMealTrackingStore } from '../store/mealTrackingStore';
import { useShoppingListStore } from '../store/shoppingListStore';

interface MealTrackerProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function MealTracker({ recipe, onClose }: MealTrackerProps) {
  const [servingsMade, setServingsMade] = useState(recipe.servings);
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState(
    recipe.ingredients.map(ing => {
      const match = ing.match(/^([\d.]+)?\s*([a-zA-Z]+)?\s+(.+)$/);
      if (match) {
        const [_, amount, unit, name] = match;
        return {
          name: name.trim(),
          amount: amount ? parseFloat(amount) : 1,
          unit: unit || 'unit',
          wasSubstituted: false,
          substitutedWith: '',
          used: true,
        };
      }
      return {
        name: ing,
        amount: 1,
        unit: 'unit',
        wasSubstituted: false,
        substitutedWith: '',
        used: true,
      };
    })
  );

  const { trackMealPreparation } = useMealTrackingStore();
  const { updatePantryItem } = useShoppingListStore();

  const handleServingsChange = (value: string) => {
    const servings = parseInt(value);
    if (!isNaN(servings) && servings > 0) {
      setServingsMade(servings);
    }
  };

  const toggleIngredientUsed = (index: number) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, used: !ing.used } : ing
    ));
  };

  const toggleSubstitution = (index: number) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, wasSubstituted: !ing.wasSubstituted } : ing
    ));
  };

  const updateSubstitution = (index: number, substitute: string) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, substitutedWith: substitute } : ing
    ));
  };

  const handleComplete = () => {
    // Track the meal preparation
    trackMealPreparation(
      recipe,
      servingsMade,
      ingredients.map(ing => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        wasSubstituted: ing.wasSubstituted,
        substitutedWith: ing.substitutedWith,
      })),
      notes
    );

    // Update pantry for unused ingredients
    ingredients.forEach(ing => {
      if (!ing.used) {
        updatePantryItem(ing.name, ing.amount, ing.unit);
      }
    });

    onClose();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Track Meal Preparation</Text>
          <Text style={styles.subtitle}>{recipe.title}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#64748B" />
            <Text style={styles.infoText}>{recipe.time}</Text>
          </View>
          <View style={styles.infoItem}>
            <ChefHat size={20} color="#64748B" />
            <Text style={styles.infoText}>{recipe.calories}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color="#64748B" />
            <View style={styles.servingsInput}>
              <TextInput
                style={styles.input}
                value={servingsMade.toString()}
                onChangeText={handleServingsChange}
                keyboardType="number-pad"
              />
              <Text style={styles.infoText}>servings</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients Used</Text>
          <Text style={styles.sectionSubtitle}>
            Check off ingredients as you use them. Mark any substitutions made.
          </Text>

          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <TouchableOpacity
                style={[styles.checkbox, ingredient.used && styles.checkboxChecked]}
                onPress={() => toggleIngredientUsed(index)}
              >
                {ingredient.used && <Check size={16} color="#FFFFFF" />}
              </TouchableOpacity>

              <View style={styles.ingredientInfo}>
                <Text style={styles.ingredientName}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </Text>

                <TouchableOpacity
                  style={styles.substitutionButton}
                  onPress={() => toggleSubstitution(index)}
                >
                  <Text style={styles.substitutionButtonText}>
                    {ingredient.wasSubstituted ? 'Substituted' : 'Mark Substitution'}
                  </Text>
                </TouchableOpacity>

                {ingredient.wasSubstituted && (
                  <TextInput
                    style={styles.substitutionInput}
                    placeholder="What did you use instead?"
                    value={ingredient.substitutedWith}
                    onChangeText={(text) => updateSubstitution(index, text)}
                  />
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any notes about the preparation..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Complete Preparation</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  servingsInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    width: 40,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  substitutionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  substitutionButtonText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins-Regular',
  },
  substitutionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    fontFamily: 'Poppins-Regular',
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: 'Poppins-Regular',
  },
  completeButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
}); 