export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  calories: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  tags: string[];
  rating: number;
  dietType: string[];
  prepTime: number;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  days: {
    day: string;
    meals: {
      breakfast: Recipe;
      lunch: Recipe;
      dinner: Recipe;
      snacks: Recipe[];
    };
  }[];
  nutritionGoals: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface MealPlanDay {
  day: string;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snacks: Recipe[];
  };
}

export interface DietaryPreference {
  id: string;
  title: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  familySize: number;
  dietaryPreferences: string[];
  allergies: string[];
  nutritionGoals: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}