import { useState, useEffect } from "react";
import { formatTimeInTimezone } from "@/utils/formatTimeInTimezone";

interface ClockProps {
  timezone: string;
  timeFormat?: "12h" | "24h";
  color?: "text" | "accent";
}

export function Clock({
  timezone,
  timeFormat = "24h",
  color = "text",
}: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  const formatClass = timeFormat === "12h" ? "weather-widget__time--12h" : "";

  return (
    <div className={`weather-widget__time ${colorClass} ${formatClass}`}>
      {formatTimeInTimezone(now, timezone, timeFormat)}
    </div>
  );
}
