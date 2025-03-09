import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Clock } from 'lucide-react-native';
import { format, startOfWeek, addDays } from 'date-fns';
import { MealPlan, MealStatus } from '../types';

interface MealCalendarProps {
  mealPlan: MealPlan;
  onToggleMealStatus: (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', status: MealStatus) => void;
}

export default function MealCalendar({ mealPlan, onToggleMealStatus }: MealCalendarProps) {
  const startDate = startOfWeek(new Date());

  const renderMealStatus = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const status = mealPlan.days[dayIndex].meals[mealType]?.status || 'pending';
    
    return (
      <TouchableOpacity
        style={[styles.mealStatus, styles[`status${status}`]]}
        onPress={() => {
          const newStatus = status === 'completed' ? 'pending' : 'completed';
          onToggleMealStatus(dayIndex, mealType, newStatus);
        }}
      >
        {status === 'completed' ? (
          <Check size={16} color="#FFFFFF" />
        ) : (
          <Clock size={16} color="#64748B" />
        )}
        <Text style={[styles.mealTypeText, status === 'completed' && styles.completedText]}>
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress</Text>
      <View style={styles.calendar}>
        {mealPlan.days.map((day, index) => (
          <View key={day.day} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>
                {format(addDays(startDate, index), 'EEE')}
              </Text>
              <Text style={styles.dayDate}>
                {format(addDays(startDate, index), 'd')}
              </Text>
            </View>
            <View style={styles.mealsContainer}>
              {renderMealStatus(index, 'breakfast')}
              {renderMealStatus(index, 'lunch')}
              {renderMealStatus(index, 'dinner')}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Poppins-SemiBold',
  },
  mealsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  mealStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    width: '90%',
  },
  statuscompleted: {
    backgroundColor: '#22C55E',
  },
  statuspending: {
    backgroundColor: '#F3F4F6',
  },
  mealTypeText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  completedText: {
    color: '#FFFFFF',
  },
}); 