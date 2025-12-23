// Types
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { LastUpdated } from "@/components/common/LastUpdated";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { SunTime } from "../common/SunTime";
import { ForecastLabel } from "../common/ForecastLabel";
import { selectForecastItems } from "@/utils/selectForecastItems";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout16x9Props {
  currentWeather: WeatherConditions;
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
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const forecastItems = selectForecastItems(forecast, forecastType ?? "daily", {
    hourlyStep: 2,
    hourlyCount: 6,
    dailyCount: 6,
  });

  // TEMP - Not supported by API yet
  // const sunrise = "06:30";
  // const sunset = "18:45";

  return (
    <div className="weather-widget weather-widget--16x9">
      {/* Top section */}
      <div className="weather-widget__top-section">
        {/* Left group: location + time */}
        <div className="weather-widget__left-group">
          <LocationName name={locationName} color="accent" />
          <Clock timezone={currentWeather.Timezone} />
        </div>

        {/* Right group: current condition */}
        <div className="weather-widget__right-group">
          <div className="weather-widget__icon-temp-group">
            <WeatherIcon icon={weatherIcon} />
            <Temperature value={temp} />
          </div>

          <LastUpdated timestamp={currentWeather.Timestamp} />

          {/* Sunrise / Sunset */}
          {/* <div className="weather-widget__sun-group">
            <SunTime type="sunrise" time={sunrise} />
            <SunTime type="sunset" time={sunset} />
          </div> */}
        </div>
      </div>

      {/* Forecast section */}
      <div className="weather-widget__forecast-section">
        {forecastItems.map((item, index) => (
          <div key={index} className="weather-widget__forecast-item">
            <Temperature value={Math.round(item.Temp)} variant="forecast" />
            <WeatherIcon
              icon={getWeatherIcon(item.WeatherCode)}
              variant="forecast"
            />
            <ForecastLabel
              item={item}
              forecastType={forecastType}
              color="accent"
              timeFormat={timeFormat}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
