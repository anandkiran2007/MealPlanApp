export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          family_size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          family_size?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          family_size?: number
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          prep_time: number | null
          calories: number | null
          servings: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          prep_time?: number | null
          calories?: number | null
          servings?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          prep_time?: number | null
          calories?: number | null
          servings?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          amount: number | null
          unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          amount?: number | null
          unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          amount?: number | null
          unit?: string | null
          created_at?: string
        }
      }
      recipe_instructions: {
        Row: {
          id: string
          recipe_id: string
          step_number: number
          instruction: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          step_number: number
          instruction: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          step_number?: number
          instruction?: string
          created_at?: string
        }
      }
      recipe_nutrition: {
        Row: {
          id: string
          recipe_id: string
          protein: number | null
          carbs: number | null
          fat: number | null
          fiber: number | null
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          fiber?: number | null
          created_at?: string
        }
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag: string
        }
        Insert: {
          recipe_id: string
          tag: string
        }
        Update: {
          recipe_id?: string
          tag?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          duration_days: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          duration_days: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          duration_days?: number
          created_at?: string
          updated_at?: string
        }
      }
      meal_plan_days: {
        Row: {
          id: string
          meal_plan_id: string
          day_number: number
          breakfast_recipe_id: string | null
          lunch_recipe_id: string | null
          dinner_recipe_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          day_number: number
          breakfast_recipe_id?: string | null
          lunch_recipe_id?: string | null
          dinner_recipe_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          day_number?: number
          breakfast_recipe_id?: string | null
          lunch_recipe_id?: string | null
          dinner_recipe_id?: string | null
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          user_id: string
          meal_plan_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shopping_list_items: {
        Row: {
          id: string
          shopping_list_id: string
          ingredient_name: string
          amount: number | null
          unit: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shopping_list_id: string
          ingredient_name: string
          amount?: number | null
          unit?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shopping_list_id?: string
          ingredient_name?: string
          amount?: number | null
          unit?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}