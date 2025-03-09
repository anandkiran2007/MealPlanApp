export type MealStatus = 'pending' | 'completed';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  calories: number | string;
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
  status?: MealStatus;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  days: DayMeals[];
  nutritionGoals: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  totalNutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  startDate?: Date;
  feedback?: {
    rating: number;
    comments: string;
    completedMeals: number;
    totalMeals: number;
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

export interface DayMeals {
  day: string;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snacks?: Recipe[];
  };
}