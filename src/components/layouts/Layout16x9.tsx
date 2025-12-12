import { WeatherForecastItem } from "@/components/weather/WeatherForecastItem";
import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout16x9Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
}

export function Layout16x9({
  currentWeather,
  forecast,
  locationName,
}: Layout16x9Props) {
  const getLastUpdatedTime = () => {
    if (!currentWeather?.Timestamp) return "--:--";
    const date = new Date(currentWeather.Timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getDayLabel = (datetime: string) => {
    // Parse date in UTC to avoid timezone shifting
    const date = new Date(datetime + "T00:00:00Z");
    return date
      .toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })
      .slice(0, 2);
  };

  // Always skip first forecast day and show the next 5 days
  const getTomorrowForecast = () => {
    // Skip index 0, show indices 1-5
    return forecast.slice(1, 6);
  };

  return (
    <div className="weather-widget weather-widget--16x9">
      {/* Top content section */}
      <div className="weather-widget__content-top">
        {/* Row 1: Location and Feels Like */}
        <div className="weather-widget__row-header">
          <div className="weather-widget__col">
            <div className="weather-widget__location">
              {locationName || currentWeather?.CityLocalized || "Loading..."}
            </div>
          </div>
          <div className="weather-widget__col--right">
            <div className="weather-widget__feels-like">
              {currentWeather?.WeatherText || "Loading..."}
            </div>
          </div>
        </div>

        {/* Row 2: Temperature/Icon and Details */}
        <div className="weather-widget__row-main">
          <div className="weather-widget__col-temp">
            <div className="weather-widget__temperature">
              {currentWeather?.Temp ? Math.round(currentWeather.Temp) : "--"}°
            </div>
            <div className="weather-widget__icon">
              <img
                src={getWeatherIcon(currentWeather?.WeatherCode || "")}
                alt="Weather icon"
              />
            </div>
          </div>
          <div className="weather-widget__col-details">
            <div className="weather-widget__details-row">
              <div className="weather-widget__detail-text">
                💧 {currentWeather?.RelativeHumidity || "--"}%
              </div>
              <div className="weather-widget__detail-text">
                💨 {currentWeather?.WindSpeed || "--"} km/h
              </div>
            </div>
            <div className="weather-widget__details-row">
              <div className="weather-widget__detail-text">
                Last updated: {getLastUpdatedTime()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom forecast section */}
      <div className="weather-widget__content-bottom">
        {getTomorrowForecast().map((day, index) => (
          <WeatherForecastItem
            key={index}
            temperature={Math.round(day.Temp)}
            icon={getWeatherIcon(day.WeatherCode)}
            day={getDayLabel(day.Datetime)}
          />
        ))}
      </div>
    </div>
  );
}
