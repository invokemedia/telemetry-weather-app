import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout10x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout10x1({}: Layout10x1Props) {
  return <div>Layout 10x1 - Not implemented</div>;
}
