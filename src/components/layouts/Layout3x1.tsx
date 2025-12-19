import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout3x1Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout3x1({}: Layout3x1Props) {
  return <div>Layout 3x1 - Not implemented</div>;
}
