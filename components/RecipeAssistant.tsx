import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MessageCircle, Send } from 'lucide-react-native';
import { Recipe } from '../types';
import { getRecipeAssistantResponse } from '../services/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RecipeAssistantProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeAssistant({ recipe, onClose }: RecipeAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Create a context string from the recipe data
  const getRecipeContext = () => {
    return `
      Recipe: ${recipe.title}
      Description: ${recipe.description}
      Ingredients: ${recipe.ingredients.join(', ')}
      Instructions: ${recipe.instructions.join(' ')}
      Cooking Time: ${recipe.time}
      Servings: ${recipe.servings}
      Calories: ${recipe.calories}
      Nutrition: Protein: ${recipe.nutrition.protein}, Carbs: ${recipe.nutrition.carbs}, Fat: ${recipe.nutrition.fat}, Fiber: ${recipe.nutrition.fiber}
      Tags: ${recipe.tags.join(', ')}
    `;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Create the prompt with recipe context
      const prompt = `
        You are a helpful cooking assistant. You can only answer questions about this specific recipe and its details. 
        Do not provide information beyond what is given in the recipe context.
        If asked about something not in the recipe, politely explain that you can only discuss the given recipe.
        
        Recipe Context:
        ${getRecipeContext()}
        
        User Question: ${userMessage}
      `;

      const response = await getRecipeAssistantResponse(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Assistant</Text>
        <Text style={styles.subtitle}>Ask me anything about this recipe!</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.message,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#22C55E" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about the recipe..."
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={200}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Send size={20} color={input.trim() ? '#FFFFFF' : '#94A3B8'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Poppins-Regular',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#22C55E',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
}); 