import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Flame, Users, Heart, Bookmark, Share2 } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';
import NutritionBadge from '../../components/NutritionBadge';
import { mockRecipes } from '../../data/mockData';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const recipe = mockRecipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Header title="Recipe Not Found" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareRecipe = () => {
    // Share functionality would be implemented here
    console.log('Sharing recipe:', recipe.title);
  };

  const addToShoppingList = () => {
    router.push('/shopping');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <Heart 
                size={24} 
                color={isFavorite ? "#EF4444" : "#FFFFFF"} 
                fill={isFavorite ? "#EF4444" : "none"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleBookmark}
            >
              <Bookmark 
                size={24} 
                color="#FFFFFF" 
                fill={isBookmarked ? "#FFFFFF" : "none"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={shareRecipe}
            >
              <Share2 size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.title}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Clock size={20} color="#64748B" />
              <Text style={styles.infoText}>{recipe.time}</Text>
            </View>
            <View style={styles.infoItem}>
              <Flame size={20} color="#64748B" />
              <Text style={styles.infoText}>{recipe.calories}</Text>
            </View>
            <View style={styles.infoItem}>
              <Users size={20} color="#64748B" />
              <Text style={styles.infoText}>{recipe.servings} servings</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{recipe.description}</Text>
          
          <View style={styles.nutritionContainer}>
            <NutritionBadge 
              label="Protein" 
              value={recipe.nutrition.protein} 
              color="#22C55E" 
            />
            <NutritionBadge 
              label="Carbs" 
              value={recipe.nutrition.carbs} 
              color="#3B82F6" 
            />
            <NutritionBadge 
              label="Fat" 
              value={recipe.nutrition.fat} 
              color="#F59E0B" 
            />
            <NutritionBadge 
              label="Fiber" 
              value={recipe.nutrition.fiber} 
              color="#8B5CF6" 
            />
          </View>
          
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsContainer}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Add Ingredients to Shopping List" 
          onPress={addToShoppingList} 
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    marginBottom: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 12,
  },
  ingredientText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#22C55E',
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  errorButton: {
    width: 200,
  },
});