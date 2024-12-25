import { GoogleGenerativeAI, GenerativeModel, GenerateContentResponse } from "@google/generative-ai";


class GeminiService {
    private model: GenerativeModel;
    private apiKey: string;


    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.model = this.initializeModel();
    }

    private initializeModel(): GenerativeModel {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        return genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateWeatherSuggestions(prompt: string): Promise<GenerateContentResponse> {
        const enhancedPrompt = `
          Based on the following prompt, extract the base location name,
           and suggest a list of places around that location.
           Also, provide a textual suggestion based on the weather in that region.  
        Please provide the output in the following JSON format:
        \`\`\`json
        {
        "location": "base location name for openweather api",
        "response": "two lines on how the weater is based on the location name",
        "places":"[
        {
        "name":"name of the place",
        "description":"whats good about this place"
        },{
        "name":"name of the place",
        "description":"whats good about this place"
        },{
        "name":"name of the place",
        "description":"whats good about this place"
        },{
        "name":"name of the place",
        "description":"whats good about this place"
        },{
        "name":"name of the place",
        "description":"whats good about this place"
        }
        ]"
        }
        \`\`\`

        Please note the weather information you will need to get the most up to date using openweather api.
         You also need to use this to suggest the best suited location or activites.

          The prompt is: ${prompt}
        `
        try {
            const result = await this.model.generateContent(enhancedPrompt);
            return result.response;
        } catch (error) {
            console.error("Error with Gemini API:", error);
            throw new Error("Failed to fetch suggestions from Gemini.");
        }
    }
}


export const gemniniAiService = new GeminiService(import.meta.env.VITE_GEMINI_API_KEY);