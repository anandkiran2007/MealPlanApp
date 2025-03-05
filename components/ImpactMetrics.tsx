import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplet, Leaf, DollarSign } from 'lucide-react-native';

interface ImpactMetricsProps {
  co2Saved: number;
  waterSaved: number;
  moneySaved: number;
}

export default function ImpactMetrics({ co2Saved, waterSaved, moneySaved }: ImpactMetricsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.metric}>
        <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
          <Leaf size={24} color="#22C55E" />
        </View>
        <View>
          <Text style={styles.value}>{co2Saved.toFixed(1)}kg</Text>
          <Text style={styles.label}>CO2 Saved</Text>
        </View>
      </View>

      <View style={styles.metric}>
        <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
          <Droplet size={24} color="#3B82F6" />
        </View>
        <View>
          <Text style={styles.value}>{waterSaved.toFixed(0)}L</Text>
          <Text style={styles.label}>Water Saved</Text>
        </View>
      </View>

      <View style={styles.metric}>
        <View style={[styles.iconContainer, { backgroundColor: '#FEF9C3' }]}>
          <DollarSign size={24} color="#EAB308" />
        </View>
        <View>
          <Text style={styles.value}>${moneySaved.toFixed(2)}</Text>
          <Text style={styles.label}>Money Saved</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metric: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});