import { formatTimeFromTimestamp } from "@/utils/timeFormat";

interface LastUpdatedProps {
  timestamp: number;
  color?: "text" | "accent";
}

export function LastUpdated({ timestamp, color = "text" }: LastUpdatedProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  const formattedTime = formatTimeFromTimestamp(timestamp, "24h");

  return (
    <div className={`weather-widget__last-updated ${colorClass}`}>
      (last updated {formattedTime})
    </div>
  );
}
