import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout1x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Layout1x1({ currentWeather }: Layout1x1Props) {
  return (
    <div className="weather-widget weather-widget--1x1">
      {/* Weather icon */}
      <div className="weather-widget__icon">🌤️</div>

      {/* Temperature */}
      <div className="weather-widget__temperature">
        {currentWeather?.Temp || 18}°
      </div>

      {/* Weather condition text */}
      <div className="weather-widget__condition-text">Mostly Cloudy</div>
    </div>
  );
}
