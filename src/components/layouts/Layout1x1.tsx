import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout1x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Layout1x1({ currentWeather }: Layout1x1Props) {
  return (
    <div className="weather-widget weather-widget--1x1">
      {/* Weather icon */}
      <div className="weather-widget__icon">
        {getWeatherIcon(currentWeather?.WeatherText || "")}
      </div>

      {/* Temperature */}
      <div className="weather-widget__temperature">
        {currentWeather?.Temp ? Math.round(currentWeather.Temp) : "--"}°
      </div>

      {/* Weather condition text */}
      <div className="weather-widget__condition-text">
        {currentWeather?.WeatherText || "Loading..."}
      </div>
    </div>
  );
}
