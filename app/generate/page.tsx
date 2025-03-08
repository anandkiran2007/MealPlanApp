import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import MealPlanGenerator from '@/components/MealPlanGenerator';

export default function GeneratePage() {
  const [duration, setDuration] = React.useState('7');
  const [familySize, setFamilySize] = React.useState('2');
  const [calories, setCalories] = React.useState('2000');
  const [protein, setProtein] = React.useState('100');
  const [carbs, setCarbs] = React.useState('250');
  const [fat, setFat] = React.useState('70');

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Generate Meal Plan',
          headerLargeTitle: true
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (days)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="7"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Family Size</Text>
            <TextInput
              style={styles.input}
              value={familySize}
              onChangeText={setFamilySize}
              keyboardType="numeric"
              placeholder="2"
            />
          </View>

          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutrition Goals (per day)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="2000"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="100"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="250"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="70"
              />
            </View>
          </View>

          <MealPlanGenerator
            duration={parseInt(duration) || 7}
            familySize={parseInt(familySize) || 2}
            nutritionGoals={{
              calories: parseInt(calories) || 2000,
              protein: parseInt(protein) || 100,
              carbs: parseInt(carbs) || 250,
              fat: parseInt(fat) || 70
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  nutritionSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
}); 