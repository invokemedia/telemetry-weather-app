import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout1x3Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout1x3({}: Layout1x3Props) {
  return <div>Layout 1x3 - Not implemented</div>;
}
