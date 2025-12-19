import type { WeatherConditions, WeatherForecast } from "@/types/weather";

interface Layout9x16Props {
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
  locationName?: string;
  pattern?: string;
  timeFormat?: "12h" | "24h";
}

export function Layout9x16({}: Layout9x16Props) {
  return <div>Layout 9x16 - Not implemented</div>;
}
