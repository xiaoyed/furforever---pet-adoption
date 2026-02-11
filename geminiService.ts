
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIMatchSuggestions = async (userProfile: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Profile: ${userProfile}. Based on this, suggest which types of pets (dogs, cats, etc.) and specific breeds would be a good match. Respond in a friendly, encouraging way.`,
      config: {
        systemInstruction: "You are a professional pet adoption counselor. Help users find their perfect pet match.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "我们现在无法提供AI建议，但我们的每一只宠物都期待着您的关注！";
  }
};
