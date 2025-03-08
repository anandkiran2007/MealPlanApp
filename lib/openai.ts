import OpenAI from 'openai';
import { mockMealPlans } from '../data/mockData';

interface MealPlanParams {
  duration: string;
  preferences: string[];
  familySize: number;
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

let openai: OpenAI;

try {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OpenAI API key');
  }

  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  if (__DEV__) {
    console.error('OpenAI initialization error:', error);
  }
  // Create a mock client for development
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{
            message: {
              content: JSON.stringify(mockMealPlans[0])
            }
          }]
        })
      }
    }
  } as unknown as OpenAI;
}

export async function generateMealPlan(params: MealPlanParams) {
  try {
    if (__DEV__ && !process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      console.warn('Using mock meal plan data for development');
      return mockMealPlans[0];
    }

    const prompt = `Generate a ${params.duration}-day meal plan for a family of ${params.familySize} with the following preferences: ${params.preferences.join(', ')}.

Daily nutrition goals per person:
- Calories: ${params.nutritionGoals.calories} kcal
- Protein: ${params.nutritionGoals.protein}g
- Carbs: ${params.nutritionGoals.carbs}g
- Fat: ${params.nutritionGoals.fat}g

Please provide a meal plan that includes:
1. A descriptive title
2. A brief description
3. Daily meals including breakfast, lunch, dinner, and optional snacks
4. Each meal should include:
   - Title
   - Description
   - Preparation time
   - Calories
   - Servings (adjusted for family size)
   - Ingredients with quantities
   - Step-by-step instructions
   - Image URL from Unsplash
   - Relevant tags

Format the response as a JSON object with this structure:
{
  "title": "string",
  "description": "string",
  "days": [
    {
      "day": "string",
      "meals": {
        "breakfast": { meal object },
        "lunch": { meal object },
        "dinner": { meal object },
        "snacks": [{ meal object }]
      }
    }
  ],
  "nutritionGoals": {
    "calories": "string",
    "protein": "string",
    "carbs": "string",
    "fat": "string"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and meal planner. Generate detailed, practical meal plans that match the specified requirements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    try {
      const mealPlan = JSON.parse(response);
      
      // Validate the response structure
      if (!mealPlan.title || !mealPlan.description || !Array.isArray(mealPlan.days)) {
        throw new Error('Invalid meal plan structure');
      }

      // Add default image if missing
      const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';
      mealPlan.days.forEach((day: any) => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          if (day.meals[mealType]) {
            day.meals[mealType].image = day.meals[mealType].image || defaultImage;
          }
        });
        if (day.meals.snacks) {
          day.meals.snacks.forEach((snack: any) => {
            snack.image = snack.image || defaultImage;
          });
        }
      });

      return mealPlan;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      if (__DEV__) {
        console.warn('Falling back to mock data');
        return mockMealPlans[0];
      }
      throw new Error('Failed to generate meal plan');
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    if (__DEV__) {
      return mockMealPlans[0];
    }
    throw error;
  }
}