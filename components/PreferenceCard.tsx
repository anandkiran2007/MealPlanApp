import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface PreferenceCardProps {
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}

export default function PreferenceCard({ title, icon, isSelected, onPress }: PreferenceCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, isSelected && styles.selectedTitle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  selectedCard: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  selectedTitle: {
    color: '#166534',
  },
});