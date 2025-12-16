import { WeatherForecastItem } from "@/components/weather/WeatherForecastItem";
import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout16x9Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  forecastType: "hourly" | "daily";
  locationName?: string;
}

export function Layout16x9({
  currentWeather,
  forecast,
  forecastType,
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

  const getHourLabel = (datetime: string) => {
    // Hourly forecast datetime format: "2025-12-16:13" (YYYY-MM-DD:HH)
    // Split by the last colon to separate date and hour
    const lastColonIndex = datetime.lastIndexOf(":");
    if (lastColonIndex !== -1) {
      const datePart = datetime.substring(0, lastColonIndex); // "2025-12-16"
      const hourPart = datetime.substring(lastColonIndex + 1); // "13"
      // Create valid ISO string: "2025-12-16T13:00:00"
      const isoString = `${datePart}T${hourPart}:00:00`;
      const date = new Date(isoString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        });
      }
    }
    return "--";
  };

  // Get forecast items to display based on type
  const getForecastItems = () => {
    if (forecastType === "hourly") {
      // Show hourly forecast - pick every 2 hours to fit 6 items
      return forecast.filter((_, index) => index % 2 === 0).slice(0, 6);
    } else {
      // Show daily forecast - skip index 0 (today), show next 5 days (indices 1-5)
      return forecast.slice(1, 6);
    }
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
        {getForecastItems().map((item, index) => (
          <WeatherForecastItem
            key={index}
            temperature={Math.round(item.Temp)}
            icon={getWeatherIcon(item.WeatherCode)}
            day={
              forecastType === "hourly"
                ? getHourLabel(item.Datetime)
                : getDayLabel(item.Datetime)
            }
          />
        ))}
      </div>
    </div>
  );
}
