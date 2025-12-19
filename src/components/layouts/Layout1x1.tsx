import type { WeatherConditions } from "@/types/weather";
import { Clock } from "@/components/common/Clock";
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
  const temp = currentWeather?.Temp
    ? Math.round(currentWeather.Temp)
    : undefined;
  const weatherIcon = getWeatherIcon(currentWeather?.WeatherCode || "");
  const weatherText = currentWeather?.WeatherText || "";

  // Current condition label variant - shows weather text at bottom
  if (variant === "current-condition-label") {
    return (
      <div className="weather-widget weather-widget--1x1 weather-widget--1x1-with-weather-text">
        <Clock
          format="24h"
          className="weather-widget__time weather-widget__text-color"
        />
        <div className="weather-widget__bottom-group">
          <div className="weather-widget__temp-icon-group">
            <div className="weather-widget__temperature weather-widget__text-color">
              {temp !== undefined ? `${temp}°` : "--°"}
            </div>
            <div className="weather-widget__icon">
              <img
                src={weatherIcon}
                alt="Weather icon"
                className="weather-widget__icon-img"
              />
            </div>
          </div>
          <div className="weather-widget__weather-text weather-widget__accent-text">
            {weatherText}
          </div>
        </div>
      </div>
    );
  }

  // Default variant with location at top
  return (
    <div className="weather-widget weather-widget--1x1">
      <div className="weather-widget__location weather-widget__accent-text">
        {locationName || "Loading..."}
      </div>
      <Clock
        format="24h"
        className="weather-widget__time weather-widget__text-color"
      />
      <div className="weather-widget__temp-icon-group">
        <div className="weather-widget__temperature weather-widget__text-color">
          {temp !== undefined ? `${temp}°` : "--°"}
        </div>
        <div className="weather-widget__icon">
          <img
            src={weatherIcon}
            alt="Weather icon"
            className="weather-widget__icon-img"
          />
        </div>
      </div>
    </div>
  );
}
