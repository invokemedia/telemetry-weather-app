// TypeScript interfaces based on TelemetryOS Weather API
export interface WeatherConditions {
  CityLocalized: string;
  Temp: number;
  RelativeHumidity: number;
  WindSpeed: number;
  WindDirectionEnglish: string;
  WeatherText: string;
  WeatherCode: string;
  Timestamp: number;
}

export interface WeatherForecast {
  Datetime: string;
  Label: string;
  WeatherCode: string;
  Timestamp: number;
  Temp: number;
  MinTemp: number;
  MaxTemp: number;
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
}

// Cached weather data with timestamp
export interface CachedWeatherData {
  currentWeather: WeatherConditions;
  forecast: WeatherForecast[];
  cachedAt: number; // Unix timestamp in milliseconds
}
