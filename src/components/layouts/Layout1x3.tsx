import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { formatForecastTime, formatDayLabel } from "@/utils/timeFormat";

interface Layout1x3Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout1x3({
  currentWeather,
  forecast,
  locationName,
  timeFormat = "24h",
  forecastType = "daily",
}: Layout1x3Props) {
  const temp = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : undefined;
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText || "";

  // Get first 3 forecast items
  const forecastItems = forecast.slice(0, 3);

  return (
    <div className="weather-widget weather-widget--1x3">
      <div className="weather-widget__top-section">
        <div className="weather-widget__location weather-widget__accent-text">
          {locationName || "Loading..."}
        </div>
        {/* <Clock /> */}
      </div>

      <div className="weather-widget__current-group">
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

      <div className="weather-widget__forecast-section">
        {forecastItems.map((item, index) => {
          const forecastTemp = Math.round(item.Temp);
          const forecastIcon = getWeatherIcon(item.WeatherCode || "");
          const timeLabel =
            forecastType === "hourly"
              ? formatForecastTime(item.Datetime, timeFormat)
              : formatDayLabel(item.Datetime);

          return (
            <div key={index} className="weather-widget__forecast-item">
              <div className="weather-widget__forecast-day weather-widget__text-color">
                {timeLabel}
              </div>
              <div className="weather-widget__forecast-icon">
                <img
                  src={forecastIcon}
                  alt="Forecast icon"
                  className="weather-widget__forecast-icon-img"
                />
              </div>
              <div className="weather-widget__forecast-temp weather-widget__text-color">
                {forecastTemp}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
