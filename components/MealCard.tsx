import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, Flame, Users } from 'lucide-react-native';

interface MealCardProps {
  title: string;
  image: string;
  time: string;
  calories: string;
  servings: number;
  onPress: () => void;
}

export default function MealCard({ title, image, time, calories, servings, onPress }: MealCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image 
        source={{ uri: image }} 
        style={styles.image}
        defaultSource={{ uri: 'https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/icon.png' }}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color="#64748B" />
            <Text style={styles.infoText}>{time}</Text>
          </View>
          <View style={styles.infoItem}>
            <Flame size={16} color="#64748B" />
            <Text style={styles.infoText}>{calories}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={16} color="#64748B" />
            <Text style={styles.infoText}>{servings}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
});