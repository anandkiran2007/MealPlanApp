import OpenAI from 'openai';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OpenAI API key');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Required for web support
});

export async function generateMealPlan(params: {
  duration: number;
  preferences: string[];
  familySize: number;
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}) {
  const prompt = `Generate a ${params.duration}-day meal plan for a family of ${params.familySize} with the following preferences: ${params.preferences.join(', ')}.
  
Daily nutrition goals:
- Calories: ${params.nutritionGoals.calories}
- Protein: ${params.nutritionGoals.protein}g
- Carbs: ${params.nutritionGoals.carbs}g
- Fat: ${params.nutritionGoals.fat}g

For each day, provide:
1. Breakfast
2. Lunch
3. Dinner
4. Optional snacks

Each meal should include:
- Title
- Brief description
- Preparation time
- Calories
- Servings
- Main ingredients
- Basic instructions
- Tags (e.g., Vegetarian, High Protein, etc.)

Format the response as a JSON object.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional nutritionist and meal planner. Generate detailed, healthy meal plans that match the user's requirements."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}