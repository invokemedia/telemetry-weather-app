// Types
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { LastUpdated } from "@/components/common/LastUpdated";
import { SunTime } from "@/components/common/SunTime";
import { ForecastLabel } from "@/components/common/ForecastLabel";
import { FeelsLike } from "@/components/common/FeelsLike";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { selectForecastItems } from "@/utils/selectForecastItems";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout9x16Props {
  currentWeather: WeatherConditions;
  forecast: WeatherForecast[];
  locationName?: string;
  forecastType?: "hourly" | "daily";
}

export function Layout9x16({
  currentWeather,
  forecast,
  locationName,
  forecastType = "daily",
}: Layout9x16Props) {
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const forecastItems = selectForecastItems(forecast, forecastType, {
    hourlyStep: 2,
    hourlyCount: 6,
    dailyCount: 6,
  });

  // TEMP - Not supported by API yet
  // const feelsLike = 16;
  // const sunrise = "06:30";
  // const sunset = "18:45";

  return (
    <div className="weather-widget weather-widget--9x16">
      {/* Top section */}
      <div className="weather-widget__top-section">
        <LocationName name={locationName} color="accent" />
        <Clock timezone={currentWeather.Timezone} />
      </div>

      {/* Current section */}
      <div className="weather-widget__current-section">
        <div className="weather-widget__current-conditions">
          <WeatherIcon icon={weatherIcon} />
          <Temperature value={temp} />
          <LastUpdated timestamp={currentWeather.Timestamp} />
          {/* <FeelsLike value={feelsLike} color="text" /> */}
        </div>

        {/* Sunrise / Sunset */}
        {/* <div className="weather-widget__sun-group">
          <SunTime type="sunrise" time={sunrise} />
          <SunTime type="sunset" time={sunset} />
        </div> */}
      </div>

      {/* Forecast section */}
      <div className="weather-widget__forecast-section">
        {forecastItems.map((item, index) => (
          <div key={index} className="weather-widget__forecast-item">
            <ForecastLabel
              item={item}
              forecastType={forecastType}
              timeFormat={timeFormat}
            />
            <WeatherIcon
              icon={getWeatherIcon(item.WeatherCode)}
              variant="forecast"
            />
            <div className="weather-widget__forecast-temps">
              <Temperature
                value={getRoundedTemp(item.MaxTemp)}
                variant="forecast"
              />
              <Temperature
                value={getRoundedTemp(item.MinTemp)}
                variant="forecast"
                color="accent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
