import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout1x10Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Layout1x10({ currentWeather, forecast }: Layout1x10Props) {
  const tomorrow = forecast[0];
  const today = forecast.length > 0 ? forecast[0] : null;

  return (
    <div className="weather-widget weather-widget--1x10">
      {/* Top section - High temp and Tomorrow label */}
      <div className="weather-widget__section-top">
        <div className="weather-widget__temp-high">
          {tomorrow?.MaxTemp ? Math.round(tomorrow.MaxTemp) : "--"}°
        </div>
        <div className="weather-widget__label-tmr">TMR</div>
      </div>

      {/* Center section - Current icon and temp */}
      <div className="weather-widget__section-center">
        <div className="weather-widget__icon">
          {getWeatherIcon(currentWeather?.WeatherText || "")}
        </div>
        <div className="weather-widget__temperature">
          {currentWeather?.Temp ? Math.round(currentWeather.Temp) : "--"}°
        </div>
      </div>

      {/* Bottom section - Min/max temps */}
      <div className="weather-widget__section-bottom">
        <div className="weather-widget__temp-max">
          ↑ {today?.MaxTemp ? Math.round(today.MaxTemp) : "--"}°
        </div>
        <div className="weather-widget__temp-min">
          ↓ {today?.MinTemp ? Math.round(today.MinTemp) : "--"}°
        </div>
      </div>
    </div>
  );
}
