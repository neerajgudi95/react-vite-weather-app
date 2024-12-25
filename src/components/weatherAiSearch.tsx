import { useGeminiWeather } from "@/hooks/use-gemini-ai";
import { sampleQuestions } from "@/lib/sampleQuestions";
import { AlertTriangle, LoaderPinwheel, Snowflake } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import WeatherAiDetails from "./WeatherAiDetails";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

const WeatherAISearch = () => {
  const [placeholder] = useState(sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]);
  const [searchQuery, setSearchQuery] = useState("");
  //   const searchQueryRef = useRef<HTMLInputElement | null>(null);
  //   const intervalRef = useRef<NodeJS.Timeout | null>(null);
  //   const placeholderRef = useRef<string>(sampleQuestions[0]);

  const { data: geminiResponse, isLoading, isError: geminiError, refetch } = useGeminiWeather(searchQuery);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    await refetch();
  };

  return (
    <div className="mt-5">
      <div className="w-3/4 mx-auto border rounded-lg p-2 flex items-center">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleValueChange}
          className="border-none outline-none ring-0 w-4/5 focus-visible:ring-0 px-4 py-2 placeholder:text-muted-foreground"
        />
        <Button
          className="text-white bg-gradient-to-br from-blue-700 to-blue-400 w-1/5"
          disabled={!searchQuery || isLoading}
          onClick={handleSearch}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 animate-spin" /> Asking...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Snowflake className="h-4 w-4" /> Ask
            </span>
          )}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex gap-4 w-full mt-5">
          <LoaderPinwheel className="w-6 h-6 animate-spin text-muted-foreground" />
          <div className="flex-1 flex flex-col gap-1">
            <Skeleton className="w-full h-[10px] rounded-lg" />
            <Skeleton className="w-full h-[10px] rounded-lg" />
            <Skeleton className="w-full h-[10px] rounded-lg" />
          </div>
        </div>
      ) : (
        geminiResponse && <WeatherAiDetails geminiData={geminiResponse} userQuery={searchQuery} />
      )}
      {geminiError && (
        <Alert variant={"destructive"} className="mt-5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex flex-col gap-4">Error</AlertTitle>
          <AlertDescription>
            <p>Failed to get the answer, please try again</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WeatherAISearch;
