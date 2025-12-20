import type { WeatherConditions } from "@/types/weather";

export function getRoundedTemp(
  weather: WeatherConditions | null
): number | undefined {
  if (weather?.Temp == null) return undefined;
  return Math.round(weather.Temp);
}
