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

// Configuration from Settings
export interface WeatherConfig {
  city: string;
}
