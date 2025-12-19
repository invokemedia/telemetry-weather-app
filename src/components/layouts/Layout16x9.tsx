import { Clock } from "../common/Clock";
import type { WeatherConditions, WeatherForecast } from "@/types/weather";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { formatForecastTime, formatDayLabel } from "@/utils/timeFormat";

interface Layout16x9Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  forecastType?: "hourly" | "daily";
  locationName?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout16x9({
  currentWeather,
  forecast,
  forecastType = "hourly",
  locationName,
  timeFormat = "12h",
}: Layout16x9Props) {
  if (!currentWeather) {
    return <div>Loading...</div>;
  }

  const weatherIconUrl = getWeatherIcon(currentWeather.WeatherCode);

  // Get forecast items to display based on type
  const getForecastItems = () => {
    if (forecastType === "hourly") {
      // Show hourly forecast - pick every 2 hours to fit 6 items
      return forecast.filter((_, index) => index % 2 === 0).slice(0, 6);
    } else {
      // Show daily forecast - skip index 0 (today), show next 5 days
      return forecast.slice(1, 6);
    }
  };

  // Hardcoded sunrise/sunset times for now (API doesn't support yet)
  const hardcodedSunrise = "06:30";
  const hardcodedSunset = "18:45";

  return (
    <div className="weather-widget weather-widget--16x9">
      {/* Top section */}
      <div className="weather-widget__top-section">
        {/* Left: Location + Time */}
        <div className="weather-widget__left-group">
          <div className="weather-widget__location weather-widget__accent-text">
            {locationName}
          </div>
          <Clock
            key={timeFormat}
            format={timeFormat}
            className="weather-widget__time weather-widget__text-color"
          />
        </div>

        {/* Right: Icon + Temperature */}
        <div className="weather-widget__right-group">
          <div className="weather-widget__icon-temp-group">
            <div className="weather-widget__icon">
              <img src={weatherIconUrl} alt="Weather icon" />
            </div>
            <div className="weather-widget__temperature weather-widget__text-color">
              {Math.round(currentWeather.Temp)}°
            </div>
          </div>

          {/* Sunrise / Sunset */}
          <div className="weather-widget__sun-group">
            <div className="weather-widget__sun-item">
              <div className="weather-widget__sun-icon weather-widget__sun-icon--sunrise"></div>
              <span className="weather-widget__sun-time weather-widget__text-color">
                {hardcodedSunrise}
              </span>
            </div>
            <div className="weather-widget__sun-item">
              <div className="weather-widget__sun-icon weather-widget__sun-icon--sunset"></div>
              <span className="weather-widget__sun-time weather-widget__text-color">
                {hardcodedSunset}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast section */}
      <div className="weather-widget__forecast-section">
        {getForecastItems().map((item, index) => (
          <div key={index} className="weather-widget__forecast-item">
            <div className="weather-widget__forecast-temp weather-widget__text-color">
              {Math.round(item.Temp)}°
            </div>
            <div className="weather-widget__forecast-icon">
              <img src={getWeatherIcon(item.WeatherCode)} alt="Forecast icon" />
            </div>
            <div className="weather-widget__forecast-day weather-widget__accent-text">
              {forecastType === "hourly"
                ? formatForecastTime(item.Datetime, timeFormat)
                : formatDayLabel(item.Datetime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
