import { Recipe, MealPlan, DietaryPreference, UserProfile } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '30 min',
    calories: '420 kcal',
    servings: 4,
    description: 'A refreshing Mediterranean salad with grilled chicken, fresh vegetables, and a zesty lemon dressing.',
    ingredients: [
      '2 boneless, skinless chicken breasts',
      '1 large cucumber, diced',
      '2 cups cherry tomatoes, halved',
      '1 red onion, thinly sliced',
      '1 cup Kalamata olives, pitted',
      '6 oz feta cheese, crumbled',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      '2 cloves garlic, minced',
      '1 tsp dried oregano',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Season chicken breasts with salt, pepper, and 1 tsp oregano.',
      'Grill chicken for 6-7 minutes per side until cooked through. Let rest for 5 minutes, then slice.',
      'In a large bowl, combine cucumber, tomatoes, red onion, and olives.',
      'In a small bowl, whisk together olive oil, lemon juice, garlic, and remaining oregano.',
      'Add sliced chicken to the salad, drizzle with dressing, and toss to combine.',
      'Top with crumbled feta cheese and serve immediately.'
    ],
    nutrition: {
      protein: '35g',
      carbs: '12g',
      fat: '28g',
      fiber: '4g'
    },
    tags: ['Mediterranean', 'High Protein', 'Salad', 'Gluten-Free']
  },
  {
    id: '2',
    title: 'Vegetarian Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '25 min',
    calories: '380 kcal',
    servings: 2,
    description: 'A nourishing bowl packed with roasted vegetables, quinoa, and a creamy tahini dressing.',
    ingredients: [
      '1 cup quinoa, rinsed',
      '1 sweet potato, diced',
      '1 cup broccoli florets',
      '1 red bell pepper, sliced',
      '1 cup chickpeas, drained and rinsed',
      '1 avocado, sliced',
      '2 tbsp olive oil',
      '2 tbsp tahini',
      '1 lemon, juiced',
      '1 clove garlic, minced',
      '1 tsp maple syrup',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Cook quinoa according to package instructions.',
      'Toss sweet potato, broccoli, and bell pepper with 1 tbsp olive oil, salt, and pepper. Roast for 20 minutes.',
      'In a small bowl, whisk together tahini, lemon juice, garlic, maple syrup, and 1 tbsp water to make the dressing.',
      'Assemble bowls with quinoa, roasted vegetables, chickpeas, and avocado.',
      'Drizzle with tahini dressing and serve.'
    ],
    nutrition: {
      protein: '15g',
      carbs: '52g',
      fat: '18g',
      fiber: '12g'
    },
    tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'High Fiber']
  },
  {
    id: '3',
    title: 'Salmon with Lemon-Dill Sauce',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '20 min',
    calories: '350 kcal',
    servings: 4,
    description: 'Perfectly seared salmon fillets topped with a creamy lemon-dill sauce.',
    ingredients: [
      '4 salmon fillets (6 oz each)',
      '2 tbsp olive oil',
      '1/4 cup Greek yogurt',
      '2 tbsp fresh dill, chopped',
      '1 lemon, zested and juiced',
      '1 clove garlic, minced',
      '1 tbsp capers, drained',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Pat salmon fillets dry and season with salt and pepper.',
      'Heat olive oil in a large skillet over medium-high heat.',
      'Cook salmon skin-side down for 4 minutes, then flip and cook for another 3-4 minutes.',
      'In a small bowl, mix Greek yogurt, dill, lemon zest, lemon juice, garlic, and capers.',
      'Serve salmon topped with the lemon-dill sauce.'
    ],
    nutrition: {
      protein: '29g',
      carbs: '3g',
      fat: '22g',
      fiber: '0g'
    },
    tags: ['Seafood', 'High Protein', 'Low Carb', 'Gluten-Free']
  },
  {
    id: '4',
    title: 'Vegan Lentil Curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '35 min',
    calories: '310 kcal',
    servings: 6,
    description: 'A hearty and flavorful vegan curry made with red lentils, coconut milk, and aromatic spices.',
    ingredients: [
      '2 cups red lentils, rinsed',
      '1 onion, diced',
      '3 cloves garlic, minced',
      '1 tbsp ginger, grated',
      '1 can (14 oz) coconut milk',
      '2 cups vegetable broth',
      '2 tbsp curry powder',
      '1 tsp ground turmeric',
      '1 tsp ground cumin',
      '1 can (14 oz) diced tomatoes',
      '2 cups spinach, chopped',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Heat olive oil in a large pot over medium heat. Add onion and cook until translucent.',
      'Add garlic and ginger, cook for 1 minute until fragrant.',
      'Stir in curry powder, turmeric, and cumin, cook for 30 seconds.',
      'Add lentils, diced tomatoes, coconut milk, and vegetable broth. Bring to a boil.',
      'Reduce heat and simmer for 20-25 minutes until lentils are tender.',
      'Stir in spinach and cook until wilted.',
      'Season with salt and pepper to taste.',
      'Garnish with fresh cilantro before serving.'
    ],
    nutrition: {
      protein: '14g',
      carbs: '42g',
      fat: '10g',
      fiber: '8g'
    },
    tags: ['Vegan', 'Gluten-Free', 'High Fiber', 'Dairy-Free']
  },
  {
    id: '5',
    title: 'Turkey and Vegetable Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '20 min',
    calories: '280 kcal',
    servings: 4,
    description: 'A quick and healthy stir-fry with lean ground turkey and colorful vegetables.',
    ingredients: [
      '1 lb ground turkey',
      '2 bell peppers, sliced',
      '2 cups broccoli florets',
      '1 carrot, julienned',
      '1 zucchini, sliced',
      '3 cloves garlic, minced',
      '1 tbsp ginger, grated',
      '3 tbsp low-sodium soy sauce',
      '1 tbsp honey',
      '1 tsp sesame oil',
      '2 tbsp olive oil',
      '2 green onions, sliced',
      'Sesame seeds for garnish'
    ],
    instructions: [
      'Heat 1 tbsp olive oil in a large wok or skillet over medium-high heat.',
      'Add ground turkey and cook until browned, about 5 minutes. Remove from wok.',
      'Add remaining olive oil to the wok. Add vegetables and stir-fry for 4-5 minutes until crisp-tender.',
      'Add garlic and ginger, cook for 30 seconds until fragrant.',
      'In a small bowl, whisk together soy sauce, honey, and sesame oil.',
      'Return turkey to the wok, add sauce, and toss to combine.',
      'Cook for another 1-2 minutes until everything is well coated and heated through.',
      'Garnish with green onions and sesame seeds before serving.'
    ],
    nutrition: {
      protein: '26g',
      carbs: '15g',
      fat: '14g',
      fiber: '4g'
    },
    tags: ['High Protein', 'Low Carb', 'Quick Meal', 'Dairy-Free']
  },
  {
    id: '6',
    title: 'Quinoa Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1543339318-b43dc53e19b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    time: '25 min',
    calories: '350 kcal',
    servings: 4,
    description: 'A nourishing vegetarian bowl with quinoa, roasted vegetables, and tahini dressing.',
    ingredients: [
      '1 cup quinoa',
      '2 sweet potatoes, cubed',
      '2 cups broccoli florets',
      '1 can chickpeas, drained',
      '2 tbsp olive oil',
      '1 avocado',
      '2 tbsp tahini',
      '1 lemon',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Roast sweet potatoes and broccoli with olive oil',
      'Season chickpeas and warm them',
      'Make tahini dressing with lemon juice',
      'Assemble bowls with all ingredients',
      'Top with sliced avocado and dressing'
    ],
    nutrition: {
      protein: '15g',
      carbs: '45g',
      fat: '18g',
      fiber: '12g'
    },
    tags: ['Vegetarian', 'Vegan', 'High Fiber']
  }
];

export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    title: 'Balanced Family Meal Plan',
    description: 'A nutritionally balanced meal plan for families, featuring a variety of proteins, whole grains, and vegetables.',
    days: [
      {
        day: 'Monday',
        meals: {
          breakfast: mockRecipes[1],
          lunch: mockRecipes[0],
          dinner: mockRecipes[2],
          snacks: [mockRecipes[4]]
        }
      },
      {
        day: 'Tuesday',
        meals: {
          breakfast: mockRecipes[1],
          lunch: mockRecipes[3],
          dinner: mockRecipes[4],
          snacks: [mockRecipes[0]]
        }
      },
      {
        day: 'Wednesday',
        meals: {
          breakfast: mockRecipes[4],
          lunch: mockRecipes[2],
          dinner: mockRecipes[0],
          snacks: [mockRecipes[3]]
        }
      }
    ],
    nutritionGoals: {
      calories: '2000 kcal',
      protein: '100g',
      carbs: '250g',
      fat: '65g'
    }
  },
  {
    id: '2',
    title: 'High Protein Meal Plan',
    description: 'A protein-focused meal plan designed to support muscle growth and recovery.',
    days: [
      {
        day: 'Monday',
        meals: {
          breakfast: mockRecipes[0],
          lunch: mockRecipes[2],
          dinner: mockRecipes[4],
          snacks: [mockRecipes[1]]
        }
      },
      {
        day: 'Tuesday',
        meals: {
          breakfast: mockRecipes[2],
          lunch: mockRecipes[4],
          dinner: mockRecipes[0],
          snacks: [mockRecipes[3]]
        }
      },
      {
        day: 'Wednesday',
        meals: {
          breakfast: mockRecipes[4],
          lunch: mockRecipes[0],
          dinner: mockRecipes[2],
          snacks: [mockRecipes[1]]
        }
      }
    ],
    nutritionGoals: {
      calories: '2200 kcal',
      protein: '150g',
      carbs: '200g',
      fat: '70g'
    }
  },
  {
    id: '3',
    title: 'Plant-Based Meal Plan',
    description: 'A completely plant-based meal plan rich in vegetables, fruits, legumes, and whole grains.',
    days: [
      {
        day: 'Monday',
        meals: {
          breakfast: mockRecipes[1],
          lunch: mockRecipes[3],
          dinner: mockRecipes[6],
          snacks: []
        }
      },
      {
        day: 'Tuesday',
        meals: {
          breakfast: mockRecipes[6],
          lunch: mockRecipes[1],
          dinner: mockRecipes[3],
          snacks: []
        }
      },
      {
        day: 'Wednesday',
        meals: {
          breakfast: mockRecipes[3],
          lunch: mockRecipes[6],
          dinner: mockRecipes[1],
          snacks: []
        }
      },
      {
        day: 'Thursday',
        meals: {
          breakfast: mockRecipes[1],
          lunch: mockRecipes[3],
          dinner: mockRecipes[6],
          snacks: []
        }
      },
      {
        day: 'Friday',
        meals: {
          breakfast: mockRecipes[6],
          lunch: mockRecipes[1],
          dinner: mockRecipes[3],
          snacks: []
        }
      },
      {
        day: 'Saturday',
        meals: {
          breakfast: mockRecipes[3],
          lunch: mockRecipes[6],
          dinner: mockRecipes[1],
          snacks: []
        }
      },
      {
        day: 'Sunday',
        meals: {
          breakfast: mockRecipes[1],
          lunch: mockRecipes[3],
          dinner: mockRecipes[6],
          snacks: []
        }
      }
    ],
    nutritionGoals: {
      calories: '1800 kcal',
      protein: '70g',
      carbs: '280g',
      fat: '50g'
    }
  }
];

export const mockDietaryPreferences: DietaryPreference[] = [
  {
    id: '1',
    title: 'Vegetarian',
    icon: 'Salad'
  },
  {
    id: '2',
    title: 'Vegan',
    icon: 'Sprout'
  },
  {
    id: '3',
    title: 'Gluten-Free',
    icon: 'Wheat'
  },
  {
    id: '4',
    title: 'Dairy-Free',
    icon: 'MilkOff'
  },
  {
    id: '5',
    title: 'Keto',
    icon: 'Beef'
  },
  {
    id: '6',
    title: 'Paleo',
    icon: 'Drumstick'
  },
  {
    id: '7',
    title: 'Low Carb',
    icon: 'Sandwich'
  },
  {
    id: '8',
    title: 'Mediterranean',
    icon: 'Fish'
  },
  {
    id: '9',
    title: 'High Protein',
    icon: 'Egg'
  }
];

export const mockUserProfile: UserProfile = {
  name: 'Sarah Johnson',
  familySize: 4,
  dietaryPreferences: ['Gluten-Free', 'High Protein'],
  allergies: ['Peanuts', 'Shellfish'],
  nutritionGoals: {
    calories: '2000 kcal',
    protein: '100g',
    carbs: '250g',
    fat: '65g'
  }
};