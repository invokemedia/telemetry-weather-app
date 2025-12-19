import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout1x10Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
  forecastType?: "hourly" | "daily";
}

export function Layout1x10({}: Layout1x10Props) {
  return <div>Layout 1x10 - Not implemented</div>;
}
