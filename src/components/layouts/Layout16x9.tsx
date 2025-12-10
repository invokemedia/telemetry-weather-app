import { WeatherForecastItem } from "@/components/weather/WeatherForecastItem";
import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout16x9Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Layout16x9({ currentWeather, forecast }: Layout16x9Props) {
  return (
    <div className="weather-widget weather-widget--16x9">
      {/* Top content section */}
      <div className="weather-widget__content-top">
        {/* Row 1: Location and Feels Like */}
        <div className="weather-widget__row-header">
          <div className="weather-widget__col">
            <div className="weather-widget__location">
              {currentWeather?.CityLocalized || "Coquitlam, BC"}
            </div>
          </div>
          <div className="weather-widget__col--right">
            <div className="weather-widget__feels-like">Feels Like -14°</div>
          </div>
        </div>

        {/* Row 2: Temperature/Icon and Details */}
        <div className="weather-widget__row-main">
          <div className="weather-widget__col-temp">
            <div className="weather-widget__temperature">
              {currentWeather?.Temp || 18}°
            </div>
            <div className="weather-widget__icon">🌤️</div>
          </div>
          <div className="weather-widget__col-details">
            <div className="weather-widget__details-row">
              <div className="weather-widget__detail-text">💧 76%</div>
              <div className="weather-widget__detail-text">💨 5 km/h</div>
            </div>
            <div className="weather-widget__details-row">
              <div className="weather-widget__detail-text">
                Last updated: 12:30
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom forecast section */}
      <div className="weather-widget__content-bottom">
        <WeatherForecastItem temperature={17} icon="🌧️" day="We" />
        <WeatherForecastItem temperature={19} icon="☀️" day="Su" />
        <WeatherForecastItem temperature={16} icon="☁️" day="Mo" />
        <WeatherForecastItem temperature={15} icon="⛈️" day="Tu" />
        <WeatherForecastItem temperature={16} icon="🌤️" day="Sa" />
        <WeatherForecastItem temperature={14} icon="🌧️" day="Fr" />
      </div>
    </div>
  );
}
