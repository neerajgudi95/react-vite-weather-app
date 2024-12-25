import { useWeatherAI } from "@/hooks/use-weather";
import { BadgeInfo, Cloudy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CurrentWeather from "./CurrentWeather";
import { Button } from "./ui/button";
import WeatherForecast from "./WeatherForecast";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Place {
  name: string;
  description: string;
}

const colors = ["#E02424", "#1C64F2", "#5850EC", "#7E3AF2", "#D61F69"];

const WeatherAiDetails = ({ geminiData, userQuery }: any) => {
  const isForecast = userQuery.toLowerCase().includes("forecast") || userQuery.toLowerCase().includes("next");

  const weatherQuery = useWeatherAI({ location: geminiData?.location, userQuery: userQuery });
  const getWeatherData = async () => {
    await weatherQuery.refetch();
  };

  if (weatherQuery.isError) {
    toast.error("Something went wrong in getting weahter details, please try again");
  }

  return (
    <div className="mt-4 p-2">
      <h3
        className="text-2xl font-bold mb-3 tracking-wide bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text 
        text-transparent animate-gradient-wave capitalize">
        {geminiData?.location.toLowerCase()}
      </h3>
      <p className="text-lg mb-3 flex items-start gap-2">
        <BadgeInfo className="h-6 w-6 text-indigo-500" />
        {geminiData.response}
        <Button className="flex items-center gap-2" variant="link" size="sm" onClick={getWeatherData}>
          {weatherQuery.isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isForecast ? "Getting forecast details" : "Getting weather details"}
            </>
          ) : (
            <>
              <Cloudy className="h-4 w-4" />
              {isForecast ? "Get forecast details" : "Get weather details"}
            </>
          )}
        </Button>
      </p>
      <div className="grid lg:grid-cols-2 gap-4">
        {weatherQuery.data && weatherQuery.data.type === "weather" ? (
          <CurrentWeather data={weatherQuery.data.data} locationName={geminiData?.location} />
        ) : (
          weatherQuery?.data?.type === "forecast" && <WeatherForecast data={weatherQuery.data.data} />
        )}
        {geminiData?.places && (
          <div>
            <h2 className="-mb-2">
              You can enjoy below places in <span className="capitalize">{geminiData?.location.toLowerCase()}</span>
            </h2>
            <ul>
              {geminiData?.places.map((place: Place, index: number) => (
                <li
                  key={place.name}
                  className="p-4 my-5 border border-l-[3px] rounded-lg"
                  style={{ borderLeftColor: colors[index] }}>
                  <p className="font-bold" style={{ color: colors[index] }}>
                    {place.name}
                  </p>
                  <p className="text-sm pl-2 text-muted-foreground">{place.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherAiDetails;
