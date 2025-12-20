import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { formatDayLabel } from "@/utils/timeFormat";

interface Layout9x16Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout9x16({
  currentWeather,
  forecast,
  locationName,
  forecastType = "daily",
}: Layout9x16Props) {
  const temp = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : undefined;
  const feelsLike = currentWeather?.FeelsLike
    ? Math.round(currentWeather.FeelsLike)
    : undefined;
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");

  // Get first 3 forecast items for daily forecast
  const forecastItems = forecast.slice(0, 3);

  return (
    <div className="weather-widget weather-widget--9x16">
      <div className="weather-widget__location weather-widget__accent-text">
        {locationName || "Loading..."}
      </div>

      <Clock
        format="24h"
        className="weather-widget__clock weather-widget__text-color"
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

      <div className="weather-widget__feels-like weather-widget__text-color">
        Feels Like {feelsLike !== undefined ? `${feelsLike}°` : "--°"}
      </div>

      <div className="weather-widget__sun-times weather-widget__text-color">
        <span>☀️ 8:25PM</span>
        <span>🌙 5:10PM</span>
      </div>

      <div className="weather-widget__forecast-box">
        {forecastItems.map((item, index) => {
          const maxTemp = Math.round(item.MaxTemp || item.Temp);
          const minTemp = Math.round(item.MinTemp || item.Temp);
          const forecastIcon = getWeatherIcon(item.WeatherCode || "");
          const dayLabel = formatDayLabel(item.Datetime);

          return (
            <div key={index} className="weather-widget__forecast-item">
              <div className="weather-widget__forecast-day weather-widget__text-color">
                {dayLabel}
              </div>
              <div className="weather-widget__forecast-icon">
                <img
                  src={forecastIcon}
                  alt="Forecast icon"
                  className="weather-widget__forecast-icon-img"
                />
              </div>
              <div className="weather-widget__forecast-temps">
                <span className="weather-widget__forecast-temp-max weather-widget__text-color">
                  {maxTemp}°
                </span>
                <span className="weather-widget__forecast-temp-min weather-widget__accent-text">
                  {minTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
