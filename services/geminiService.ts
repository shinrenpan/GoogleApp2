import { GoogleGenAI, Type } from "@google/genai";
import { AITaskResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client. 
// Note: In a real production app, you might handle the missing key more gracefully 
// or require user input if not present in env.
const ai = new GoogleGenAI({ apiKey });

export const generateTasksFromGoal = async (goal: string): Promise<AITaskResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down the following goal into a list of specific, actionable tasks suitable for 25-minute Pomodoro sessions. 
      Keep titles concise (under 50 chars). Estimate 1-4 pomodoros per task.
      Goal: ${goal}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "A concise task title",
                  },
                  estimatedPomodoros: {
                    type: Type.INTEGER,
                    description: "Estimated number of 25-min sessions (1-4)",
                  },
                },
                required: ["title", "estimatedPomodoros"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as AITaskResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};