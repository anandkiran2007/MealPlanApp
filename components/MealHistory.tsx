import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, TrendingUp } from 'lucide-react-native';
import { format, subMonths, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { Recipe, MealStatus } from '../types';

interface MealHistoryProps {
  completedMeals: {
    date: Date;
    recipe: Recipe;
    mealType: string;
  }[];
}

export default function MealHistory({ completedMeals }: MealHistoryProps) {
  if (!completedMeals || completedMeals.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Calendar size={24} color="#22C55E" />
          <Text style={styles.title}>Meal History</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals completed yet</Text>
          <Text style={styles.emptySubtext}>Complete meals to see your history</Text>
        </View>
      </View>
    );
  }

  // Group meals by month
  const groupedMeals = completedMeals.reduce((acc, meal) => {
    const monthKey = format(meal.date, 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(meal);
    return acc;
  }, {} as Record<string, typeof completedMeals>);

  // Calculate statistics
  const now = new Date();
  const last30Days = completedMeals.filter(meal => 
    isWithinInterval(meal.date, {
      start: subMonths(now, 1),
      end: now
    })
  ).length;

  // Calculate this week's meals
  const thisWeekMeals = completedMeals.filter(meal =>
    isWithinInterval(meal.date, {
      start: startOfWeek(now),
      end: endOfWeek(now)
    })
  ).length;

  // Calculate most common meal type
  const mealTypeCounts = completedMeals.reduce((acc, meal) => {
    acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMealType = Object.entries(mealTypeCounts).length > 0 
    ? Object.entries(mealTypeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    : 'None';

  const totalMeals = completedMeals.length;
  const weeklyAverage = Math.round((last30Days / 4) * 10) / 10;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={24} color="#22C55E" />
        <Text style={styles.title}>Meal History</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{last30Days}</Text>
            <Text style={styles.statLabel}>Last 30 Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{thisWeekMeals}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{weeklyAverage}</Text>
            <Text style={styles.statLabel}>Weekly Average</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalMeals}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
        </View>
        <View style={styles.insightContainer}>
          <TrendingUp size={16} color="#22C55E" />
          <Text style={styles.insightText}>
            Most prepared: {mostCommonMealType}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.historyList}>
        {Object.entries(groupedMeals).map(([month, meals]) => (
          <View key={month} style={styles.monthSection}>
            <Text style={styles.monthTitle}>{month}</Text>
            {meals.map((meal, index) => (
              <View key={index} style={styles.mealItem}>
                <Text style={styles.mealDate}>
                  {format(meal.date, 'MMM d')}
                </Text>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTitle}>{meal.recipe.title}</Text>
                  <Text style={styles.mealType}>{meal.mealType}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
    fontFamily: 'Poppins-Medium',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22C55E',
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  historyList: {
    flex: 1,
  },
  monthSection: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mealDate: {
    width: 80,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  mealInfo: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Poppins-Medium',
  },
  mealType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  insightText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#22C55E',
    fontFamily: 'Poppins-Medium',
  },
}); 