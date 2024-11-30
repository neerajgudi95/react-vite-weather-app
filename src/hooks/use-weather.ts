import { Coordinates } from "@/api/types"
import { weatherApi } from "@/api/weather"
import { useQuery } from "@tanstack/react-query"

export const WEATHER_KEYS = {
    weather: (coords: Coordinates) => ["weather", coords] as const,
    forecast: (coords: Coordinates) => ["forecast", coords] as const,
    geocode: (coords: Coordinates) => ["geocode", coords] as const,
    search: (query: string) => ["location-search", query] as const,
} as const

export function useWeatherQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates
    })
}
export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.getForecast(coordinates) : null,
        enabled: !!coordinates
    })
}
export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.geocode(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.reverseGeoCode(coordinates) : null,
        enabled: !!coordinates
    })
}
export function useSearchLocation(query: string) {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => weatherApi.searchLocations(query),
        enabled: query.length >= 3
    })
}