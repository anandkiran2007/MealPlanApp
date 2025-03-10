import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({ 
  title, 
  showBack = false, 
  showNotification = false,
  onNotificationPress,
  rightElement
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={[styles.header, Platform.OS === 'ios' && styles.iosHeader]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.notificationButton}>
            <Bell size={24} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}
      </View>
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? 40 : 12,
  },
  iosHeader: {
    paddingTop: 50,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    color: '#1E293B',
    flex: 1,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    flexShrink: 1,
    marginLeft: 12,
  },
  backButton: {
    padding: 4,
  },
  notificationButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});