
import { gemniniAiService } from "@/api/geminiAi"
import { useQuery } from "@tanstack/react-query"

export const GEMINIAI_QEURY_KEYS = {
    weatherSuggestions: (prompt: string) => ["'weather-suggestions", prompt] as const,
} as const


export function useGeminiWeather(prompt: string) {
    return useQuery({
        queryKey: GEMINIAI_QEURY_KEYS.weatherSuggestions(prompt),
        queryFn: async () => {
            try {
                const result = await gemniniAiService.generateWeatherSuggestions(prompt)
                const data = result?.candidates?.[0].content?.parts?.[0]?.text?.replace(/```json\n|```/g, '').trim()
                const response = JSON.parse(data ?? "")
                console.log(response)
                return {
                    location: response.location,
                    places: response.places,
                    response: response.response,
                }
            } catch (error) {
                console.log(error)
                return {
                    location: null,
                    places: null,
                    response: null,
                }
            }
        },
        enabled: false
    })
}