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
  currentWeather: WeatherConditions | null;
  locationName?: string;
  variant?: "location" | "current-condition-label";
}

export function Layout1x1({
  currentWeather,
  locationName,
  variant = "location",
}: Layout1x1Props) {
  const temp = getRoundedTemp(currentWeather);
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText;

  // Layout variant: with current condition label
  if (variant === "current-condition-label") {
    return (
      <div className="weather-widget weather-widget--1x1 weather-widget--1x1-with-weather-text">
        {/* Current time */}
        <Clock />

        <div className="weather-widget__bottom-group">
          <div className="weather-widget__temp-icon-group">
            {/* Current temperature */}
            <Temperature value={temp} className="weather-widget__text-color" />

            {/* Current weather icon */}
            <WeatherIcon icon={weatherIcon} />
          </div>

          {/* Current condition label */}
          <WeatherText
            text={weatherText}
            className="weather-widget__accent-text"
          />
        </div>
      </div>
    );
  }

  // Layout variant: with location
  return (
    <div className="weather-widget weather-widget--1x1">
      {/* Location name */}
      <LocationName
        name={locationName}
        className="weather-widget__accent-text"
      />

      {/* Current time */}
      <Clock />

      <div className="weather-widget__temp-icon-group">
        {/* Current temperature */}
        <Temperature value={temp} className="weather-widget__text-color" />

        {/* Current weather icon */}
        <WeatherIcon icon={weatherIcon} />
      </div>
    </div>
  );
}
