// TypeScript interfaces based on TelemetryOS Weather API
export interface WeatherConditions {
  CityLocalized: string; // City name (localized)
  CityEnglish: string; // City name (English)
  WindAbbr: string; // Wind abbreviation
  CountryCode: string; // ISO country code
  Timezone: string; // Timezone
  WeatherText: string; // Weather description text
  State: string; // State/Province
  Pod: string; // Part of day (day/night indicator)
  WeatherCode: string; // Weather code (internal mapping)
  WindDirectionDegrees: string; // Wind direction in degrees
  WindDirectionEnglish: string; // Wind direction (cardinal, English)
  WindDirectionLocalized: string; // Wind direction (localized)
  RelativeHumidity: number; // Relative humidity percentage
  Timestamp: number; // Unix timestamp
  Longitude: number; // Longitude
  Latitude: number; // Latitude
  Temp: number; // Current temperature
  Pressure: number; // Atmospheric pressure
  WindSpeed: number; // Wind speed
  Visibility: number; // Visibility distance
  Precip: number; // Precipitation amount
}

export interface WeatherForecast {
  Datetime: string; // ISO datetime string
  Pod: string; // Part of day (day/night indicator)
  Label: string; // Weather description label
  WeatherCode: string; // Weather code
  Timestamp: number; // Unix timestamp
  Temp: number; // Temperature
  MinTemp: number; // Minimum temperature
  MaxTemp: number; // Maximum temperature
}

// Location entry with display name
export interface Location {
  id: string;
  city: string;
  displayName?: string;
}

// Configuration from Settings
export interface WeatherConfig {
  locations: Location[];
  displayDuration: number; // seconds per location
  showForecast: boolean;
  forecastType?: "hourly" | "daily"; // Type of forecast to display
  theme: "light" | "dark"; // Color theme for widget
  textColor?: string; // Primary text color (hex format, e.g., "#ffffff")
  textOpacity?: number; // Primary text opacity (0-100)
  accentColor?: string; // Accent text color (hex format, e.g., "#ffffff")
  accentOpacity?: number; // Accent text opacity (0-100)
  timeFormat?: "12h" | "24h"; // 12-hour or 24-hour time format
  layoutPattern?: string; // Selected layout pattern for current aspect ratio
  currentAspectRatio?: string; // Current detected aspect ratio from device
  layout1x1Variant?: "location" | "current-condition-label"; // Layout variant for 1x1 aspect ratio
  layout10x1Variant?:
    | "current-condition-only"
    | "current-condition-location"
    | "current-condition-forecast"; // Layout variant for 10x1 aspect ratio
  layout3x1Variant?: "weather-text" | "temp-range";
}

// Cached weather data with timestamp
export interface CachedWeatherData {
  currentWeather: WeatherConditions;
  forecast: WeatherForecast[];
  cachedAt: number; // Unix timestamp in milliseconds
}
