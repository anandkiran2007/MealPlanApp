import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  dateCompleted?: string;
}

export default function AchievementCard({
  title,
  description,
  icon,
  progress,
  target,
  completed,
  dateCompleted,
}: AchievementCardProps) {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` },
              completed && styles.completedProgressBar
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progress} / {target}
        </Text>
      </View>

      {completed && dateCompleted && (
        <Text style={styles.completedDate}>
          Completed on {new Date(dateCompleted).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  completedProgressBar: {
    backgroundColor: '#15803D',
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
  },
  completedDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#15803D',
    marginTop: 8,
  },
});