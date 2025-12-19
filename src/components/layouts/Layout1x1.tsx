import type { WeatherConditions } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout1x1Props {
  currentWeather: WeatherConditions | null;
  locationName?: string;
}

export function Layout1x1({ currentWeather, locationName }: Layout1x1Props) {
  const temp = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : undefined;
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");

  return (
    <div className="weather-widget weather-widget--1x1">
      <div className="weather-widget__location weather-widget__accent-text">
        {locationName || "Loading..."}
      </div>
      <Clock
        format="24h"
        className="weather-widget__time weather-widget__text-color"
      />
      <div className="weather-widget__temp-icon-group">
        <div className="weather-widget__temperature weather-widget__text-color">
          {temp !== undefined ? `${temp}°` : "--°"}
        </div>
        <div className="weather-widget__icon">
          <img
            src={weatherIcon}
            alt="Weather icon"
            className="weather-widget__icon-img"
          />
        </div>
      </div>
    </div>
  );
}
