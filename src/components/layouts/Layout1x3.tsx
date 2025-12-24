// Types
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { ForecastLabel } from "@/components/common/ForecastLabel";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { selectForecastItems } from "@/utils/selectForecastItems";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout1x3Props {
  currentWeather: WeatherConditions;
  forecast: WeatherForecast[];
  locationName?: string;
  forecastType?: "hourly" | "daily";
}

export function Layout1x3({
  currentWeather,
  forecast,
  locationName,
  forecastType = "daily",
}: Layout1x3Props) {
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";
  const units = config.units || "imperial";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const forecastItems = selectForecastItems(forecast, forecastType, {
    hourlyStep: 2,
    hourlyCount: 3,
    dailyCount: 3,
  });

  return (
    <div className="weather-widget weather-widget--1x3">
      {/* Top section */}
      <div className="weather-widget__top-section">
        <LocationName name={locationName} color="accent" />
        <Clock timezone={currentWeather.Timezone} timeFormat={timeFormat} />
      </div>

      {/* Current section */}
      <div className="weather-widget__current-section">
        <WeatherIcon icon={weatherIcon} />
        <Temperature value={temp} units={units} />
        <div className="weather-widget__weather-text">
          {currentWeather.WeatherText}
        </div>
      </div>

      {/* Forecast section */}
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
              units={units}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
