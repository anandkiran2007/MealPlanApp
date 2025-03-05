import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Check, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import Header from '../../components/Header';
import Button from '../../components/Button';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  category: string;
}

export default function ShoppingScreen() {
  const [newItem, setNewItem] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: '1', name: '2 boneless chicken breasts', completed: false, category: 'Meat' },
    { id: '2', name: '1 large cucumber', completed: false, category: 'Produce' },
    { id: '3', name: '2 cups cherry tomatoes', completed: false, category: 'Produce' },
    { id: '4', name: '1 red onion', completed: false, category: 'Produce' },
    { id: '5', name: '1 cup Kalamata olives', completed: false, category: 'Canned Goods' },
    { id: '6', name: '6 oz feta cheese', completed: false, category: 'Dairy' },
    { id: '7', name: '2 tbsp olive oil', completed: true, category: 'Oils' },
    { id: '8', name: '1 lemon', completed: true, category: 'Produce' },
  ]);

  const addItem = () => {
    if (newItem.trim() === '') return;
    
    const newShoppingItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem,
      completed: false,
      category: 'Other',
    };
    
    setShoppingList([...shoppingList, newShoppingItem]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    setShoppingList(
      shoppingList.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setShoppingList(shoppingList.filter(item => !item.completed));
  };

  // Group items by category
  const groupedItems: Record<string, ShoppingItem[]> = {};
  shoppingList.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  // Calculate progress
  const completedCount = shoppingList.filter(item => item.completed).length;
  const totalCount = shoppingList.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <Header 
        title="Shopping List" 
        showNotification 
        onNotificationPress={() => {}}
      />
      
      <View style={styles.addItemContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add an item..."
            value={newItem}
            onChangeText={setNewItem}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {completedCount} of {totalCount} items
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>
      
      <ScrollView style={styles.listContainer}>
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map(item => (
                <View key={item.id} style={styles.itemContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.checkbox, 
                      item.completed && styles.checkboxChecked
                    ]}
                    onPress={() => toggleItem(item.id)}
                  >
                    {item.completed && <Check size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <Text 
                    style={[
                      styles.itemText, 
                      item.completed && styles.itemTextCompleted
                    ]}
                  >
                    {item.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Trash2 size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
            <Text style={styles.emptyDescription}>
              Add items to your shopping list to get started.
            </Text>
          </View>
        )}
      </ScrollView>
      
      {completedCount > 0 && (
        <View style={styles.clearButtonContainer}>
          <Button 
            title="Clear Completed Items" 
            onPress={clearCompleted}
            variant="outline"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  addItemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  inputContainer: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1E293B',
  },
  progressPercentage: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#22C55E',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  itemText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  deleteButton: {
    padding: 4,
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
  },
  clearButtonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});