import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout10x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  variant?:
    | "current-condition-only"
    | "current-condition-location"
    | "current-condition-forecast";
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout10x1({
  currentWeather,
  forecast,
  locationName,
  variant = "current-condition-only",
  timeFormat = "12h",
  forecastType = "daily",
}: Layout10x1Props) {
  const temperature = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : "--";
  const weatherText = currentWeather?.WeatherText || "Loading...";
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");

  // Helper function to format forecast time
  const formatForecastTime = (timestamp: number) => {
    if (!timestamp) {
      console.error("No timestamp provided to formatForecastTime");
      return "--";
    }

    // Convert Unix timestamp to Date object
    const forecastTime = new Date(timestamp * 1000);

    if (isNaN(forecastTime.getTime())) {
      console.error("Invalid timestamp:", timestamp);
      return "--";
    }

    // Daily forecast: show day of week (Mon, Tue, Wed)
    if (forecastType === "daily") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return dayNames[forecastTime.getDay()];
    }

    // Hourly forecast: show time (always on the hour, ignore minutes)
    const hours = forecastTime.getHours();

    if (timeFormat === "24h") {
      // 24h format: show "14:00" (always :00 minutes for hourly)
      return `${hours.toString().padStart(2, "0")}:00`;
    } else {
      // 12h format: show "4 PM" (no minutes for hourly)
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours} ${period}`;
    }
  };

  // Forecast variant - completely different layout
  if (variant === "current-condition-forecast") {
    // Get next 3 forecast entries
    // For hourly: skip first entry (current hour), take next 3
    // For daily: skip today (first entry), take next 3 days
    const forecastItems = forecast.slice(1, 4);

    console.log("Forecast items:", forecastItems);

    return (
      <div className="weather-widget weather-widget--10x1 weather-widget--10x1-forecast">
        {/* Left group: Time + Icon + Temperature */}
        <div className="weather-widget__left-group">
          <Clock format="24h" className="weather-widget__time" />
          <div className="weather-widget__icon">
            <img
              src={weatherIcon}
              alt={weatherText}
              className="weather-widget__icon-img"
            />
          </div>
          <div className="weather-widget__temperature">{temperature}°</div>
        </div>

        {/* Forecast group - hourly only */}
        <div className="weather-widget__forecast-group">
          {forecastItems.map((item, index) => {
            const forecastIcon = getWeatherIcon(item.WeatherCode);
            const forecastTemp = Math.round(item.Temp);

            return (
              <div key={index} className="weather-widget__forecast-item">
                <div className="weather-widget__forecast-time">
                  {formatForecastTime(item.Timestamp)}
                </div>
                <div className="weather-widget__forecast-icon">
                  <img
                    src={forecastIcon}
                    alt="Forecast"
                    className="weather-widget__forecast-icon-img"
                  />
                </div>
                <div className="weather-widget__forecast-temp">
                  {forecastTemp}°
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Current condition variants (with or without location)
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

      {/* Location - only show for "current-condition-location" variant */}
      {variant === "current-condition-location" && locationName && (
        <div className="weather-widget__location">{locationName}</div>
      )}
    </div>
  );
}
