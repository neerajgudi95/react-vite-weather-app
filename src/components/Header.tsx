import { useTheme } from "@/context/theme-provider";
import { Moon, Snowflake, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import CitySearch from "./CitySearch";
import { Button } from "./ui/button";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img src={isDark ? "/logo.png" : "/logo2.png"} alt="WEATHERY" className="h-14" />
        </Link>

        <div className="flex items-center justify-between gap-6">
          <CitySearch />
          <Button className="text-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            <Link to="/weather-ai" className="flex items-center gap-1">
              <Snowflake className="h-4 w-4" />
              Weather AI
            </Link>
          </Button>
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`cursor-pointer flex items-center transition-transform duration-500
                            ${isDark ? "rotate-180" : "rotate-0"}
                        `}>
            {isDark ? (
              <Sun className="h-6 w-6 text-orange-400 rotate-0 transtion-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transtion-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
