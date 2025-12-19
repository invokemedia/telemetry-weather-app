import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout4x5Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout4x5({ currentWeather, locationName }: Layout4x5Props) {
  const temp = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : undefined;
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText || "";

  return (
    <div className="weather-widget weather-widget--4x5">
      <div className="weather-widget__location weather-widget__accent-text">
        {locationName || "Loading..."}
      </div>
      <Clock
        format="24h"
        className="weather-widget__time weather-widget__text-color"
      />
      <div className="weather-widget__icon">
        <img
          src={weatherIcon}
          alt="Weather icon"
          className="weather-widget__icon-img"
        />
      </div>
      <div className="weather-widget__temperature weather-widget__text-color">
        {temp !== undefined ? `${temp}°` : "--°"}
      </div>
      <div className="weather-widget__weather-text weather-widget__text-color">
        {weatherText}
      </div>
    </div>
  );
}
