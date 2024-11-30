import type { ForecastData } from "@/api/types"
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface ForecastProps {
    data: ForecastData
}
interface Acc {
    date: string;
    description: string;
    temp_max: number;
    temp_min: number;
    wind_speed: number;
    humidity: number;
}
const WeatherForecast = ({ data }: ForecastProps) => {

    // console.log(data)
    const forecastData = data.list.reduce((acc, item) => {
        const date = format(new Date(item.dt * 1000), "EEE, MMM dd")
        if (!acc[date]) {
            acc[date] = {
                date: format(new Date(item.dt * 1000), "EEE, MMM dd"),
                description: item.weather[0].description,
                temp_max: item.main.temp_max,
                temp_min: item.main.temp_min,
                wind_speed: item.wind.speed,
                humidity: item.main.humidity
            }
        } else {
            acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min)
            acc[date].temp_max = Math.min(acc[date].temp_max, item.main.temp_max)
        }
        return acc
    }, {} as Record<string, Acc>)

    const fiveDaysForcast = Object.values(forecastData).slice(0, 5)

    const formatTemp = (temp: number) => `${Math.round(temp)}º`
    return (
        <Card>
            <CardHeader>
                <CardTitle>5 Days Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {
                        fiveDaysForcast.map((forecast) => {
                            return (
                                <div className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4" key={forecast.date}>
                                    <div>
                                        <p className="font-medium">{forecast.date}</p>
                                        <span className="text-sm capitalize text-muted-foreground">{forecast.description}</span>
                                    </div>
                                    <div className="flex justify-center gap-4 text-sm font-medium">
                                        <span className="flex items-center gap-1 text-blue-500">
                                            <ArrowDown className='h-4 w-4' />
                                            {formatTemp(forecast.temp_min)}
                                        </span>
                                        <span className="flex items-center gap-1 text-red-500">
                                            <ArrowUp className='h-4 w-4' />
                                            {formatTemp(forecast.temp_max)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 justify-end">
                                        <p className="flex items-center gap-2">
                                            <Droplets className='h-4 w-4 text-blue-500' />
                                            <span className="text-sm">{forecast.humidity}%</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Wind className='h-4 w-4 text-blue-500' />
                                            <span className="text-sm">{forecast.wind_speed} m/s</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </CardContent>
        </Card >
    )
}

export default WeatherForecast