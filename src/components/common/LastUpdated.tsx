import { formatTimeFromTimestamp } from "@/utils/timeFormat";

interface LastUpdatedProps {
  timestamp: number;
  timeFormat?: "12h" | "24h";
  color?: "text" | "accent";
}

export function LastUpdated({
  timestamp,
  timeFormat = "24h",
  color = "text",
}: LastUpdatedProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  const formattedTime = formatTimeFromTimestamp(timestamp, timeFormat);

  return (
    <div className={`weather-widget__last-updated ${colorClass}`}>
      (last updated {formattedTime})
    </div>
  );
}
