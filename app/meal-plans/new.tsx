import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Salad, Sprout, Wheat, MilkOff, Beef, Drumstick, Sandwich, Fish, Egg } from 'lucide-react-native';
import Header from '../../components/Header';
import PreferenceCard from '../../components/PreferenceCard';
import Button from '../../components/Button';
import { mockDietaryPreferences } from '../../data/mockData';
import { useMealPlanStore } from '../../store/mealPlanStore';

export default function NewMealPlanScreen() {
  const router = useRouter();
  const generateMealPlan = useMealPlanStore(state => state.generateMealPlan);
  const [familySize, setFamilySize] = useState('4');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<'3' | '5' | '7'>('3');
  const [isGenerating, setIsGenerating] = useState(false);

  const getIconForPreference = (iconName: string) => {
    switch (iconName) {
      case 'Salad': return <Salad size={24} color={selectedPreferences.includes('Vegetarian') ? '#166534' : '#64748B'} />;
      case 'Sprout': return <Sprout size={24} color={selectedPreferences.includes('Vegan') ? '#166534' : '#64748B'} />;
      case 'Wheat': return <Wheat size={24} color={selectedPreferences.includes('Gluten-Free') ? '#166534' : '#64748B'} />;
      case 'MilkOff': return <MilkOff size={24} color={selectedPreferences.includes('Dairy-Free') ? '#166534' : '#64748B'} />;
      case 'Beef': return <Beef size={24} color={selectedPreferences.includes('Keto') ? '#166534' : '#64748B'} />;
      case 'Drumstick': return <Drumstick size={24} color={selectedPreferences.includes('Paleo') ? '#166534' : '#64748B'} />;
      case 'Sandwich': return <Sandwich size={24} color={selectedPreferences.includes('Low Carb') ? '#166534' : '#64748B'} />;
      case 'Fish': return <Fish size={24} color={selectedPreferences.includes('Mediterranean') ? '#166534' : '#64748B'} />;
      case 'Egg': return <Egg size={24} color={selectedPreferences.includes('High Protein') ? '#166534' : '#64748B'} />;
      default: return <Salad size={24} color="#64748B" />;
    }
  };

  const togglePreference = (preference: string) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleGenerateMealPlan = async () => {
    if (!familySize || parseInt(familySize) < 1) {
      Alert.alert('Invalid Family Size', 'Please enter a valid number of people.');
      return;
    }

    setIsGenerating(true);
    try {
      const mealPlan = await generateMealPlan({
        duration: selectedDuration,
        preferences: selectedPreferences,
        familySize: parseInt(familySize),
        nutritionGoals: {
          calories: 2000,
          protein: 100,
          carbs: 250,
          fat: 65
        }
      });
      router.push(`/meal-plans/${mealPlan.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Meal Plan" showBack />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Family Size</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={familySize}
              onChangeText={setFamilySize}
              keyboardType="numeric"
              placeholder="Enter number of people"
              placeholderTextColor="#94A3B8"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Text style={styles.sectionDescription}>
            Select all that apply to your family's dietary needs.
          </Text>
          
          <View style={styles.preferencesContainer}>
            {mockDietaryPreferences.map((preference) => (
              <PreferenceCard
                key={preference.id}
                title={preference.title}
                icon={getIconForPreference(preference.icon)}
                isSelected={selectedPreferences.includes(preference.title)}
                onPress={() => togglePreference(preference.title)}
              />
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Meal Plan Duration</Text>
          <View style={styles.durationContainer}>
            {(['3', '5', '7'] as const).map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.durationButton,
                  selectedDuration === duration && styles.activeDurationButton
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={[
                  styles.durationText,
                  selectedDuration === duration && styles.activeDurationText
                ]}>{duration} days</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Nutrition Goals</Text>
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>2000 kcal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>100g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>250g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>65g</Text>
            </View>
          </View>
          
          <Button 
            title="Generate Meal Plan" 
            onPress={handleGenerateMealPlan} 
            loading={isGenerating}
            style={styles.generateButton}
            size="large"
          />
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
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 12,
    marginTop: 24,
  },
  sectionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    height: 40,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeDurationButton: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  durationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeDurationText: {
    color: '#166534',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  generateButton: {
    marginTop: 32,
    marginBottom: 24,
  },
});