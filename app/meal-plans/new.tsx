import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useMealPlanStore } from '../../store/mealPlanStore';

export default function NewMealPlanScreen() {
  const router = useRouter();
  const generateMealPlan = useMealPlanStore(state => state.generateMealPlan);
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    try {
      await generateMealPlan({
        days: selectedDays
      });
      router.push('/meal-plans');
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
          <Text style={styles.sectionTitle}>Meal Plan Duration</Text>
          <View style={styles.durationContainer}>
            {[3, 5, 7].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.durationButton,
                  selectedDays === days && styles.activeDurationButton
                ]}
                onPress={() => setSelectedDays(days)}
              >
                <Text style={[
                  styles.durationText,
                  selectedDays === days && styles.activeDurationText
                ]}>{days} days</Text>
              </TouchableOpacity>
            ))}
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
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeDurationButton: {
    backgroundColor: '#22C55E',
  },
  durationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  activeDurationText: {
    color: '#FFFFFF',
  },
  generateButton: {
    marginTop: 16,
  },
});