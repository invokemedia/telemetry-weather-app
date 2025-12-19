import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout4x5Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout4x5({}: Layout4x5Props) {
  return <div>Layout 4x5 - Not implemented</div>;
}
