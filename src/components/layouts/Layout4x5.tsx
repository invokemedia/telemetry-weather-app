// Types
import type { WeatherConditions } from "@/types/weather";

// Common UI components
import { Clock } from "@/components/common/Clock";
import { LocationName } from "@/components/common/LocationName";
import { Temperature } from "@/components/common/Temperature";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { WeatherText } from "@/components/common/WeatherText";

// Utils / selectors
import { getRoundedTemp } from "@/utils/getRoundedTemp";
import { getWeatherIcon } from "@/utils/weatherIcons";

interface Layout4x5Props {
  currentWeather: WeatherConditions;
  locationName?: string;
}

export function Layout4x5({ currentWeather, locationName }: Layout4x5Props) {
  const temp = getRoundedTemp(currentWeather);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText;

  return (
    <div className="weather-widget weather-widget--4x5">
      {/* Top group: location + time */}
      <div className="weather-widget__top-group">
        <LocationName
          name={locationName}
          className="weather-widget__accent-text"
        />
        {/* Current time */}
        <Clock timezone={currentWeather.Timezone} />
      </div>

      {/* Middle group: icon + temperature */}
      <div className="weather-widget__temp-icon-group">
        <WeatherIcon icon={weatherIcon} />
        <Temperature value={temp} className="weather-widget__text-color" />
      </div>

      {/* Bottom: condition label */}
      <WeatherText text={weatherText} className="weather-widget__text-color" />
    </div>
  );
}
