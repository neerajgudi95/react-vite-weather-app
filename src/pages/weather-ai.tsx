import WeatherAISearch from "@/components/weatherAiSearch";

const WeatherAI = () => {
  return (
    <div>
      <div className="flex gap-2 items-baseline justify-center">
        <p className="text-2xl mt-2">Get AI-Powered Personalized Weather Recommendation with</p>
        <h2
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text 
        text-transparent animate-gradient-wave">
          Weather AI
        </h2>
      </div>
      <WeatherAISearch />
    </div>
  );
};

export default WeatherAI;
