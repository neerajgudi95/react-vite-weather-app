import type { ForecastData } from '@/api/types'
import { format } from 'date-fns'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
interface HourlyTempProps {
    data: ForecastData
}

const HourlyTemperature = ({ data }: HourlyTempProps) => {

    const chartData = data.list.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 1000), "ha"),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like)
    }));

    return (
        <Card className='flex-1'>
            <CardHeader>
                <CardTitle>Today's Temperature</CardTitle>
            </CardHeader>
            <CardContent className='h-[200px] w-full'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={chartData}>
                        <XAxis dataKey='time' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}º`} />
                        <Tooltip content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className='rounded-lg border bg-background p-2 shadow-sm'>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <div className='flex flex-col'>
                                                <span className='text-[0.7rem] uppercase text-muted-foreground'>Temp</span>
                                                <span className='font-bold'>{payload[0].value}º</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='text-[0.7rem] uppercase text-muted-foreground'>Feels Like</span>
                                                <span className='font-bold'>{payload[1].value}º</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }} />
                        <Line type='monotone' dataKey='temp' stroke='#8884d8' strokeWidth={2} />
                        <Line type='monotone' dataKey='feels_like' stroke='#64748b' strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default HourlyTemperature