export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  calories: string;
  servings: number;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  tags: string[];
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  days: MealPlanDay[];
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