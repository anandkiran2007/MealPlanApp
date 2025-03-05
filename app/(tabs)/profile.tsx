import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, LogOut, Settings, User as UserIcon, CreditCard as Edit2 } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { profile, updateProfile, notificationsEnabled, darkModeEnabled, toggleNotifications, toggleDarkMode } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleSaveProfile = () => {
    if (!editedProfile.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    if (editedProfile.familySize < 1) {
      Alert.alert('Error', 'Family size must be at least 1');
      return;
    }

    updateProfile(editedProfile);
    setIsEditing(false);
  };

  const toggleDietaryPreference = (preference: string) => {
    setEditedProfile(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setEditedProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Profile" 
        showNotification 
        onNotificationPress={() => {}}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserIcon size={40} color="#FFFFFF" />
          </View>
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                placeholder="Enter your name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileInfo}>Family of {profile.familySize}</Text>
            </>
          )}
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={20} color="#22C55E" />
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Size</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.familySize.toString()}
                onChangeText={(text) => {
                  const size = parseInt(text) || 1;
                  setEditedProfile(prev => ({ ...prev, familySize: size }));
                }}
                keyboardType="numeric"
                placeholder="Enter family size"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                }}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dietary Preferences</Text>
              <View style={styles.preferencesContainer}>
                {profile.dietaryPreferences.map((preference, index) => (
                  <View key={index} style={styles.preferenceTag}>
                    <Text style={styles.preferenceText}>{preference}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergies</Text>
              <View style={styles.preferencesContainer}>
                {profile.allergies.map((allergy, index) => (
                  <View key={index} style={styles.allergyTag}>
                    <Text style={styles.allergyText}>{allergy}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Goals</Text>
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{profile.nutritionGoals.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{profile.nutritionGoals.protein}</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{profile.nutritionGoals.carbs}</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{profile.nutritionGoals.fat}</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: '#E2E8F0', true: '#DCFCE7' }}
                  thumbColor={notificationsEnabled ? '#22C55E' : '#FFFFFF'}
                />
              </View>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: '#E2E8F0', true: '#DCFCE7' }}
                  thumbColor={darkModeEnabled ? '#22C55E' : '#FFFFFF'}
                />
              </View>
              
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Settings size={20} color="#64748B" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Account Settings</Text>
                </View>
                <ChevronRight size={20} color="#64748B" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleSignOut}
              >
                <View style={styles.menuItemLeft}>
                  <LogOut size={20} color="#EF4444" style={styles.menuIcon} />
                  <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'relative',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 8,
  },
  editNameContainer: {
    width: '100%',
    marginBottom: 8,
  },
  nameInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 4,
  },
  profileInfo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  preferenceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#166534',
  },
  allergyTag: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#B91C1C',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  settingsSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  logoutText: {
    color: '#EF4444',
  },
});