// Types
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { WeatherText } from "@/components/common/WeatherText";
import { ForecastLabel } from "@/components/common/ForecastLabel";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { selectForecastItems } from "@/utils/selectForecastItems";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout10x1Props {
  currentWeather: WeatherConditions;
  forecast: WeatherForecast[];
  locationName?: string;
  variant?:
    | "current-condition-only"
    | "current-condition-location"
    | "current-condition-forecast";
  forecastType?: "hourly" | "daily";
}

export function Layout10x1({
  currentWeather,
  forecast,
  locationName,
  variant = "current-condition-location",
  forecastType = "hourly",
}: Layout10x1Props) {
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather.WeatherCode);
  const weatherText = currentWeather?.WeatherText;

  // Forecast items (used only by forecast variant)
  const forecastItems = selectForecastItems(forecast, forecastType, {
    hourlyStep: 2,
    hourlyCount: 3,
    dailyCount: 3,
  });

  return (
    <div
      className={`weather-widget weather-widget--10x1 weather-widget--${variant}`}
    >
      {/* Time */}
      <Clock timezone={currentWeather.Timezone} />

      {/* Current conditions */}
      <div className="weather-widget__current-conditions">
        <Temperature value={temp} />
        <WeatherIcon icon={weatherIcon} />
        <WeatherText text={weatherText} />
      </div>

      {/* Location (optional) */}
      {variant === "current-condition-location" && (
        <div className="current-condition-location">
          <LocationName name={locationName} />
        </div>
      )}

      {/* Forecast section */}
      {variant === "current-condition-forecast" && (
        <div className="weather-widget__forecast-section">
          {forecastItems.map((item) => (
            <div key={item.Datetime} className="weather-widget__forecast-item">
              <ForecastLabel
                item={item}
                forecastType={forecastType}
                timeFormat={timeFormat}
              />

              <WeatherIcon
                icon={getWeatherIcon(item.WeatherCode)}
                variant="forecast"
              />

              <Temperature
                value={getRoundedTemp(item.Temp)}
                variant="forecast"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
