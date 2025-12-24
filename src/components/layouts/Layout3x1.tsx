// Types
import type { WeatherConditions } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { WeatherText } from "@/components/common/WeatherText";

// Utils
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout3x1Props {
  currentWeather: WeatherConditions;
  locationName?: string;
  variant?: "weather-text" | "temp-range";
}

export function Layout3x1({
  currentWeather,
  locationName,
  variant = "weather-text",
}: Layout3x1Props) {
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";
  const units = config.units || "imperial";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather.WeatherCode);

  // TODO: temp-range variant requires max/min temps from currentWeather (WeatherConditions)
  // const maxTemp = 21;
  // const minTemp = 13;

  return (
    <div className="weather-widget weather-widget--3x1">
      {/* Left section */}
      <div className="weather-widget__left-column">
        <LocationName name={locationName} color="accent" />
        <Clock timezone={currentWeather.Timezone} timeFormat={timeFormat} />
      </div>

      {/* Right section */}
      <div className="weather-widget__right-column">
        <div className="weather-widget__current-row">
          <WeatherIcon icon={weatherIcon} />
          <Temperature value={temp} units={units} />
        </div>

        {/* Variant content */}
        {variant === "weather-text" && (
          <WeatherText text={currentWeather.WeatherText} />
        )}

        {/* TODO: Uncomment when maxTemp and minTemp are available from currentWeather (WeatherConditions) */}
        {/* {variant === "temp-range" && (
          <div className="weather-widget__temp-range">
            <div className="weather-widget__temp-range-item">
              <div className="weather-widget__arrow-icon weather-widget__arrow-icon-max" />
              <Temperature value={maxTemp} variant="forecast" units={units} />
            </div>
            <div className="weather-widget__temp-range-item">
              <div className="weather-widget__arrow-icon weather-widget__arrow-icon-min" />
              <Temperature value={minTemp} variant="forecast" units={units} />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
