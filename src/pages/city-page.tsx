import CurrentWeather from '@/components/CurrentWeather'
import FavButton from '@/components/FavButton'
import HourlyTemperature from '@/components/HourlyTemperature'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import WeatherDetails from '@/components/WeatherDetails'
import WeatherForecast from '@/components/WeatherForecast'
import { useForecastQuery, useWeatherQuery } from '@/hooks/use-weather'
import { AlertTriangle } from 'lucide-react'
import { useParams, useSearchParams } from 'react-router-dom'

const CityPage = () => {
  const [searchParams] = useSearchParams()
  const params = useParams()

  const coordinates = {
    lat: parseFloat(searchParams.get("lat") || "0"),
    lon: parseFloat(searchParams.get("lon") || "0")
  }

  const forecastQuery = useForecastQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (<Alert variant={'destructive'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className='flex flex-col gap-4'>Error</AlertTitle>
      <AlertDescription>
        <p>Failed to load weather data. Please try again</p>
      </AlertDescription>
    </Alert>);
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />;
  }

  return (
    <div className='space-y-4'>
      {/* Favorite cities */}
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavButton data={weatherQuery.data} />
        </div>
      </div>
      <div className='grid gap-6'>
        <div className='flex flex-col gap-4'>
          <CurrentWeather data={weatherQuery.data} />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div className='grid gap-6 md:grid-cols-2 items-start'>
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default CityPage