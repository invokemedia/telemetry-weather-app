import type { WeatherForecast } from "@/types/weather";
import { formatForecastTime, formatDayLabel } from "@/utils/timeFormat";

interface ForecastLabelProps {
  item: WeatherForecast;
  forecastType: "hourly" | "daily";
  color?: "text" | "accent";
  timeFormat?: "12h" | "24h";
}

export function ForecastLabel({
  item,
  forecastType,
  color = "text",
  timeFormat = "12h",
}: ForecastLabelProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`weather-widget__forecast-label ${colorClass}`}>
      {forecastType === "hourly"
        ? formatForecastTime(item.Timestamp, timeFormat)
        : formatDayLabel(item.Datetime)}
    </div>
  );
}
