import { API_CONFIG } from "./config";
import { Coordinates, ForecastData, GeoCodingData, WeatherData, WeatherAIRequest, WeatherResponse } from "./types";

class WeatherAPI {
    private createURL(endpoint: string, params: Record<string, string | number>) {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params
        })
        return `${endpoint}?${searchParams.toString()}`
    }

    private async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.statusText}`)
        }
        return response.json()
    }

    async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
        const url = this.createURL(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: "metric",
        })
        return this.fetchData<WeatherData>(url)
    }
    async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
        const url = this.createURL(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: "metric",
        })
        return this.fetchData<ForecastData>(url)
    }
    async reverseGeoCode({ lat, lon }: Coordinates): Promise<GeoCodingData[]> {
        const url = this.createURL(`${API_CONFIG.GEO_API}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: 1
        })
        return this.fetchData<GeoCodingData[]>(url)
    }
    async searchLocations(query: string): Promise<GeoCodingData[]> {
        const url = this.createURL(`${API_CONFIG.GEO_API}/direct`, {
            q: query,
            limit: 5
        })
        return this.fetchData<GeoCodingData[]>(url)
    }

    async geminiWeather({ location, userQuery }: WeatherAIRequest): Promise<WeatherResponse> {
        if (!location) return null
        const geoCodingData = await this.searchLocations(location)
        if (!geoCodingData || geoCodingData.length === 0) return null
        const coordinates: Coordinates = {
            lat: geoCodingData[0].lat,
            lon: geoCodingData[0].lon
        }
        if (userQuery.toLowerCase().includes('forecast') || userQuery.toLowerCase().includes('next')) {
            const forecastData = await this.getForecast(coordinates)
            return { type: "forecast", data: forecastData }
        }
        const weatherData = await this.getCurrentWeather(coordinates)
        return { type: "weather", data: weatherData }
    }
}


export const weatherApi = new WeatherAPI()