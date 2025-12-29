
import { GoogleGenAI, Type, Chat, FunctionDeclaration } from "@google/genai";

// تعريف العمليات التي يمكن للروبوت القيام بها
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
  },
  {
    name: 'get_contact_info',
    parameters: {
      type: Type.OBJECT,
      description: 'الحصول على معلومات الاتصال والموقع التفصيلية للمجمع الحديث.',
      properties: {},
    },
  }
];

export class GeminiService {
  constructor() {}

  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateSceneImage(description: string, highQuality: boolean = false): Promise<string | null> {
    try {
      const model = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      const prompt = `Industrial cinematography, realistic architectural photography. Scene: ${description}. Professional lighting, 4k resolution, marketing quality, focusing on metallic rolling shutters and modern factory settings in Aden, Yemen.`;
      
      const response = await this.getAI().models.generateContent({
        model: model,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: highQuality ? "1K" : undefined
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  async enhanceScript(currentScript: string): Promise<string> {
    try {
      const response = await this.getAI().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتحسين وصف هذا المشهد ليكون أكثر سينمائية واحترافية: "${currentScript}". اجعل الوصف باللغة العربية مع التركيز على التفاصيل البصرية للأبواب السحابة.`,
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return response.text || currentScript;
    } catch (error) {
      return currentScript;
    }
  }

  createChat(systemInstruction: string): Chat {
    return this.getAI().chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: controlTools }],
      },
    });
  }
}

export const geminiService = new GeminiService();
