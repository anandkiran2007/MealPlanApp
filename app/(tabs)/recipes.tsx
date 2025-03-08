import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Bookmark } from 'lucide-react-native';
import Header from '../../components/Header';
import MealCard from '../../components/MealCard';
import { useRecipeStore } from '../../store/recipeStore';

export default function RecipesScreen() {
  const router = useRouter();
  const { 
    recipes,
    loading,
    error,
    searchQuery,
    selectedTags,
    loadRecipes,
    setSearchQuery,
    toggleTag,
    getFilteredRecipes
  } = useRecipeStore();

  useEffect(() => {
    loadRecipes();
  }, []);

  const filteredRecipes = getFilteredRecipes();

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Recipes" showNotification onNotificationPress={() => {}} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Recipes" showNotification onNotificationPress={() => {}} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadRecipes}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Recipes" 
        showNotification 
        onNotificationPress={() => {}}
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
        >
          <TouchableOpacity
            style={[
              styles.tagButton,
              selectedTags.length === 0 && styles.selectedTagButton
            ]}
            onPress={() => useRecipeStore.setState({ selectedTags: [] })}
          >
            <Text style={[
              styles.tagText,
              selectedTags.length === 0 && styles.selectedTagText
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {['Vegetarian', 'High Protein', 'Low Carb', 'Gluten-Free', 'Quick Meal'].map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                selectedTags.includes(tag) && styles.selectedTagButton
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[
                styles.tagText,
                selectedTags.includes(tag) && styles.selectedTagText
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.recipesContainer}>
        <View style={styles.content}>
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <MealCard
                key={recipe.id}
                title={recipe.title}
                image={recipe.image}
                time={recipe.time}
                calories={recipe.calories}
                servings={recipe.servings}
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Bookmark size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No recipes found</Text>
              <Text style={styles.emptyDescription}>
                Try adjusting your search or filters to find what you're looking for.
              </Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#64748B',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tagsContainer: {
    paddingHorizontal: 16,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedTagButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#64748B',
  },
  selectedTagText: {
    color: '#FFFFFF',
  },
  recipesContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});