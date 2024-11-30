import { WeatherData } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Compass, Gauge, SunriseIcon, SunsetIcon } from 'lucide-react';
import { format } from 'date-fns'

interface WeatherProps {
    data: WeatherData
}

const WeatherDetails = ({ data }: WeatherProps) => {
    const { main: { pressure }, wind: { deg }, sys: { sunrise, sunset } } = data;

    const getWindDirection = (degree: number) => {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8

        return directions[index]
    }

    const weatherDetails = [
        {
            title: 'Sunrise',
            data: format(new Date(sunrise * 1000), 'p'),
            icon: SunriseIcon,
            class: 'h-5 w-5 text-orange-500',
        },
        {
            title: 'Sunset',
            data: format(new Date(sunset * 1000), 'p'),
            icon: SunsetIcon,
            class: 'h-5 w-5 text-blue-500',
        },
        {
            title: 'Wind',
            data: `${getWindDirection(deg)}(${deg}º)`,
            icon: Compass,
            class: 'h-5 w-5 text-green-500',
        },
        {
            title: 'Pressure',
            data: `${pressure} hPa`,
            icon: Gauge,
            class: 'h-5 w-5 text-purple-500',
        },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weather Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                    {
                        weatherDetails.map((item) => {
                            return (
                                <div className='flex items-center rounded-lg border p-2' key={item.title}>
                                    <item.icon className={item.class} />
                                    <div className='flex flex-col mx-2'>
                                        <span className='font-semibold'>{item.title}</span>
                                        <span className='text-muted-foreground'>{item.data}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </CardContent>
        </Card>

    )
}

export default WeatherDetails