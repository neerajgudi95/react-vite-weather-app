import CurrentWeather from '@/components/CurrentWeather'
import FavoriteCities from '@/components/FavoriteCities'
import HourlyTemperature from '@/components/HourlyTemperature'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import WeatherDetails from '@/components/WeatherDetails'
import WeatherForecast from '@/components/WeatherForecast'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/use-weather'
import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react'
// import React from 'react'

const WeatherDashboard = () => {
    const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();

    const locationQuery = useReverseGeocodeQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    const weatherQuery = useWeatherQuery(coordinates);


    const handleRefresh = () => {
        getLocation()
        if (coordinates) {
            locationQuery.refetch()
            forecastQuery.refetch()
            weatherQuery.refetch()
        }
    };

    if (locationLoading) {
        return <LoadingSkeleton />
    }
    if (locationError) {
        return <Alert variant={'destructive'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className='flex flex-col gap-4'>Location Error</AlertTitle>
            <AlertDescription>
                <p>{locationError}</p>
                <Button variant={'outline'} className='w-fit' onClick={getLocation}>
                    <MapPin className='mr-2 h-4 w-4' />
                    Enable Location
                </Button>
            </AlertDescription>
        </Alert>
    }
    if (!coordinates) {
        return <Alert variant={'destructive'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className='flex flex-col gap-4'>Location Required</AlertTitle>
            <AlertDescription>
                <p>Please enable location access to see your local weather</p>
                <Button variant={'outline'} className='w-fit' onClick={getLocation}>
                    <MapPin className='mr-2 h-4 w-4' />
                    Enable Location
                </Button>
            </AlertDescription>
        </Alert>
    }

    const locationName = locationQuery.data?.[0];

    if (weatherQuery.error || forecastQuery.error) {
        return (<Alert variant={'destructive'}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className='flex flex-col gap-4'>Error</AlertTitle>
            <AlertDescription>
                <p>Failed to fetch weather data. Please try again</p>
                <Button variant={'outline'} className='w-fit' onClick={getLocation}>
                    <RefreshCw className='mr-2 h-4 w-4' />
                    Retry
                </Button>
            </AlertDescription>
        </Alert>);
    }

    if (!weatherQuery.data || !forecastQuery.data) {
        return <LoadingSkeleton />;
    }

    return (
        <>
            <FavoriteCities />
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
                    <Button variant={'outline'} size={'icon'} onClick={handleRefresh}
                        disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
                        <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <div className='grid gap-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <CurrentWeather data={weatherQuery.data} locationName={locationName} />
                        <HourlyTemperature data={forecastQuery.data} />
                    </div>
                    <div className='grid gap-6 md:grid-cols-2 items-start'>
                        <WeatherDetails data={weatherQuery.data} />
                        <WeatherForecast data={forecastQuery.data} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default WeatherDashboard