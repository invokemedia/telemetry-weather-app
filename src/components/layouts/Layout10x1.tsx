import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout10x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout10x1({ currentWeather, locationName }: Layout10x1Props) {
  const temperature = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : "--";
  const weatherText = currentWeather?.WeatherText || "Loading...";
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");

  return (
    <div className="weather-widget weather-widget--10x1">
      {/* Time - Always use 24h format */}
      <Clock format="24h" className="weather-widget__time" />

      {/* Center group: Temperature + Icon + Weather Text */}
      <div className="weather-widget__center-group">
        <div className="weather-widget__temperature">{temperature}°</div>

        <div className="weather-widget__icon">
          <img
            src={weatherIcon}
            alt={weatherText}
            className="weather-widget__icon-img"
          />
        </div>

        <div className="weather-widget__weather-text">{weatherText}</div>
      </div>

      {/* Location */}
      {locationName && (
        <div className="weather-widget__location">{locationName}</div>
      )}
    </div>
  );
}
