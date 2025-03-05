import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionBadgeProps {
  label: string;
  value: string;
  color: string;
}

export default function NutritionBadge({ label, value, color }: NutritionBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
  },
});