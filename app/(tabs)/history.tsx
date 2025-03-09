import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMealPlanStore } from '../../store/mealPlanStore';
import MealHistory from '../../components/MealHistory';
import Header from '../../components/Header';

export default function HistoryScreen() {
  const { mealHistory } = useMealPlanStore();

  return (
    <View style={styles.container}>
      <Header title="Meal History" showBack={false} />
      <MealHistory completedMeals={mealHistory} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
}); 