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

interface Layout1x1Props {
  currentWeather: WeatherConditions;
  locationName?: string;
  variant?: "location" | "current-condition-label";
}

export function Layout1x1({
  currentWeather,
  locationName,
  variant = "location",
}: Layout1x1Props) {
  const temp = getRoundedTemp(currentWeather.Temp);
  const weatherIcon = getWeatherIcon(currentWeather.WeatherCode);
  const weatherText = currentWeather.WeatherText;

  // Layout variant: with current condition label
  if (variant === "current-condition-label") {
    return (
      <div className="weather-widget weather-widget--1x1">
        <Clock timezone={currentWeather.Timezone} />

        <div className="weather-widget__bottom-group">
          <div className="weather-widget__temp-icon-group">
            <Temperature value={temp} />
            <WeatherIcon icon={weatherIcon} />
          </div>

          <WeatherText text={weatherText} color="accent" />
        </div>
      </div>
    );
  }

  // Layout variant: with location
  return (
    <div className="weather-widget weather-widget--1x1">
      <LocationName name={locationName} color="accent" />
      <Clock timezone={currentWeather.Timezone} />

      <div className="weather-widget__temp-icon-group">
        <Temperature value={temp} />
        <WeatherIcon icon={weatherIcon} />
      </div>
    </div>
  );
}
