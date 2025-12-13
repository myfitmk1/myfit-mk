
import { GoogleGenAI, Type } from "@google/genai";
import { StatItem } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  // @ts-ignore
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.includes("API_KEY")) {
    console.warn("API Key is missing or invalid.");
    // We throw error here to be caught by the caller
    throw new Error("Невалиден API Клуч во конфигурацијата.");
  }
  return new GoogleGenAI({ apiKey });
};

const handleGeminiError = (error: any): string => {
    console.error("Gemini Error:", error);
    if (error.message) {
        if (error.message.includes("403") || error.message.includes("PERMISSION_DENIED")) {
            return "⛔ ГРЕШКА 403: Google го блокираше барањето. Проверете дали `http://localhost:5175/*` е додаден во 'Website Restrictions' во Google Cloud Console.";
        } else if (error.message.includes("429")) {
            return "⏳ Системот е преоптоварен. Ве молиме обидете се повторно за минута.";
        }
    }
    return `Грешка: ${error.message || "Проверете интернет конекција."}`;
};

export const generatePlan = async (topic: string): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Create a detailed, well-structured fitness plan for: "${topic}". 
    Format with clear headings and bullet points. Language: Macedonian.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Не успеав да генерирам план.";
  } catch (error: any) {
    return handleGeminiError(error);
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAI();
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
    throw new Error("Нема слика во одговорот.");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const analyzeTextToStats = async (text: string): Promise<StatItem[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze text: "${text}". Return JSON array of objects with 'name' (string) and 'value' (number).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER }
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
