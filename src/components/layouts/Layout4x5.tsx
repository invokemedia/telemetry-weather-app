// Types
import type { WeatherConditions } from "@/types/weather";

// Common components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { WeatherText } from "@/components/common/WeatherText";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";

// Store
import { useWeatherConfigState } from "@/hooks/store";

interface Layout4x5Props {
  currentWeather: WeatherConditions;
  locationName?: string;
}

export function Layout4x5({ currentWeather, locationName }: Layout4x5Props) {
  const [, config] = useWeatherConfigState();
  const timeFormat = config.timeFormat || "12h";
  const units = config.units || "imperial";

  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText;

  return (
    <div className="weather-widget weather-widget--4x5">
      {/* Top section */}
      <div className="weather-widget__top-group">
        <LocationName name={locationName} color="accent" />
        <Clock timezone={currentWeather.Timezone} timeFormat={timeFormat} />
      </div>

      {/* Middle section */}
      <div className="weather-widget__temp-icon-group">
        <WeatherIcon icon={weatherIcon} />
        <Temperature value={temp} units={units} />
      </div>

      {/* Bottom section*/}
      <WeatherText text={weatherText} />
    </div>
  );
}
