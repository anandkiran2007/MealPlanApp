import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage for React Native
});

export async function getRecipeAssistantResponse(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful cooking assistant. Only provide information about the specific recipe in the context. If asked about something outside the recipe context, politely explain that you can only discuss the given recipe."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from AI assistant');
  }
} 