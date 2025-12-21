// Types
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

// Common UI components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { formatForecastTime, formatDayLabel } from "@/utils/timeFormat";

interface Layout16x9Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  forecastType?: "hourly" | "daily";
  locationName?: string;
}

export function Layout16x9({
  currentWeather,
  forecast,
  forecastType = "hourly",
  locationName,
}: Layout16x9Props) {
  const temp = getRoundedTemp(currentWeather);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");

  const forecastItems =
    forecastType === "hourly"
      ? forecast.filter((_, index) => index % 2 === 0).slice(0, 6)
      : forecast.slice(1, 6);

  // Temporary placeholder (API not ready)
  const sunrise = "06:30";
  const sunset = "18:45";

  return (
    <div className="weather-widget weather-widget--16x9">
      {/* Top section */}
      <div className="weather-widget__top-section">
        {/* Left group: location + time */}
        <div className="weather-widget__left-group">
          <LocationName
            name={locationName}
            className="weather-widget__accent-text"
          />
          {/* <Clock /> */}
        </div>

        {/* Right group: current condition */}
        <div className="weather-widget__right-group">
          <div className="weather-widget__icon-temp-group">
            <WeatherIcon icon={weatherIcon} />
            <Temperature value={temp} className="weather-widget__text-color" />
          </div>

          {/* Sunrise / sunset */}
          <div className="weather-widget__sun-group">
            <div className="weather-widget__sun-item">
              <div className="weather-widget__sun-icon weather-widget__sun-icon--sunrise" />
              <span className="weather-widget__sun-time weather-widget__text-color">
                {sunrise}
              </span>
            </div>

            <div className="weather-widget__sun-item">
              <div className="weather-widget__sun-icon weather-widget__sun-icon--sunset" />
              <span className="weather-widget__sun-time weather-widget__text-color">
                {sunset}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast section */}
      <div className="weather-widget__forecast-section">
        {forecastItems.map((item, index) => (
          <div key={index} className="weather-widget__forecast-item">
            <Temperature
              value={Math.round(item.Temp)}
              className="weather-widget__text-color weather-widget__forecast-temp"
            />

            <WeatherIcon
              icon={getWeatherIcon(item.WeatherCode)}
              className="weather-widget__forecast-icon"
            />

            <div className="weather-widget__forecast-day weather-widget__accent-text">
              {forecastType === "hourly"
                ? formatForecastTime(item.Datetime)
                : formatDayLabel(item.Datetime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
