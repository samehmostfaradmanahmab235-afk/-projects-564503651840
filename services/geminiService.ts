
import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";

const controlTools: FunctionDeclaration[] = [
  {
    name: 'generate_full_storyboard',
    parameters: {
      type: Type.OBJECT,
      description: 'توليد الصور لجميع مشاهد الستوري بورد التسعة في الإعلان الترويجي.',
      properties: {},
    },
  },
  {
    name: 'update_specific_scene',
    parameters: {
      type: Type.OBJECT,
      description: 'توليد أو تحديث صورة لمشهد واحد معين في الستوري بورد.',
      properties: {
        sceneId: {
          type: Type.NUMBER,
          description: 'رقم المشهد المراد تحديثه (من 1 إلى 9).',
        },
      },
      required: ['sceneId'],
    },
  }
];

export class GeminiService {
  constructor() {}

  private getAI() {
    // Rely exclusively on the platform-provided API key
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async generateSceneImage(description: string, highQuality: boolean = false): Promise<string | null> {
    try {
      const ai = this.getAI();
      // Use gemini-2.5-flash-image as the reliable default for quick generation
      const model = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      const prompt = `Industrial high-end cinematography, realistic architectural photography of a modern factory in Aden. Scene: ${description}. Professional studio lighting, metallic rolling shutters, clean factory environment. Colors: Cream, Grey, and MCT brand colors (Red/Green/Purple).`;
      
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation failed:", error);
      return null;
    }
  }

  async enhanceScript(currentScript: string): Promise<string> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `أعد صياغة هذا الوصف ليكون وصفاً بصرياً دقيقاً لمحرك توليد صور ذكاء اصطناعي، ركز على الإضاءة والخامات المعدنية والأبواب السحابة الحديثة: "${currentScript}"`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return response.text || currentScript;
    } catch (error) {
      return currentScript;
    }
  }

  createChat(systemInstruction: string): Chat {
    const ai = this.getAI();
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: controlTools }],
      },
    });
  }
}

export const geminiService = new GeminiService();
