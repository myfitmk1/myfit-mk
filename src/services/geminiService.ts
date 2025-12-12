
import { GoogleGenAI, Type } from "@google/genai";
import { StatItem } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  // @ts-ignore
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePlan = async (topic: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "AI Сервисот не е достапен (Недостасува API клуч). Ве молиме подесете го клучот за да генерирате план.";

  try {
    const prompt = `Create a detailed, well-structured plan for the following request: "${topic}". 
    Format the output with clear headings, bullet points, and actionable steps. 
    Do not use markdown code blocks, just plain text with formatting characters is fine.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No plan generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Грешка при генерирање на планот. Обидете се повторно.";
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  if (!ai) throw new Error("Missing API Key");
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const analyzeTextToStats = async (text: string): Promise<StatItem[]> => {
  const ai = getAI();
  if (!ai) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following text and categorize the time or activities mentioned into a list of categories with values. 
      The input text is: "${text}".
      Return a JSON array of objects with 'name' (string) and 'value' (number). 
      If unit is not specified, assume hours or a generic count.
      Example output: [{"name": "Work", "value": 5}, {"name": "Exercise", "value": 1}]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "Name of the category or activity"
              },
              value: {
                type: Type.NUMBER,
                description: "Numerical value associated with the activity"
              }
            },
            required: ["name", "value"]
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr) as StatItem[];
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return [];
  }
};
