import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Header from '../../components/Header';
import ImpactMetrics from '../../components/ImpactMetrics';
import AchievementCard from '../../components/AchievementCard';
import { useWasteReductionStore } from '../../store/wasteReductionStore';

export default function ImpactScreen() {
  const { totalImpact, achievements } = useWasteReductionStore();

  return (
    <View style={styles.container}>
      <Header 
        title="Your Impact" 
        showNotification 
        onNotificationPress={() => {}}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          <ImpactMetrics
            co2Saved={totalImpact.co2Saved}
            waterSaved={totalImpact.waterSaved}
            moneySaved={totalImpact.moneySaved}
          />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalImpact.mealsTracked}</Text>
              <Text style={styles.statLabel}>Meals Tracked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalImpact.wasteReduced}</Text>
              <Text style={styles.statLabel}>Items Saved</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.achievementsHeader}>
            <Trophy size={24} color="#22C55E" />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              progress={achievement.progress}
              target={achievement.target}
              completed={achievement.completed}
              dateCompleted={achievement.dateCompleted}
            />
          ))}
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
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});