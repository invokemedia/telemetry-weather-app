import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout1x10Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Layout1x10({ currentWeather }: Layout1x10Props) {
  return (
    <div className="weather-widget weather-widget--1x10">
      {/* Top section - High temp and Tomorrow label */}
      <div className="weather-widget__section-top">
        <div className="weather-widget__temp-high">22°</div>
        <div className="weather-widget__label-tmr">TMR</div>
      </div>

      {/* Center section - Current icon and temp */}
      <div className="weather-widget__section-center">
        <div className="weather-widget__icon">🌤️</div>
        <div className="weather-widget__temperature">
          {currentWeather?.Temp || 18}°
        </div>
      </div>

      {/* Bottom section - Min/max temps */}
      <div className="weather-widget__section-bottom">
        <div className="weather-widget__temp-max">↑ 21°</div>
        <div className="weather-widget__temp-min">↓ 13°</div>
      </div>
    </div>
  );
}
