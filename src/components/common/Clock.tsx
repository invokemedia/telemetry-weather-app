import { useState, useEffect } from "react";
import { formatTimeInTimezone } from "@/utils/formatTimeInTimezone";

interface ClockProps {
  timezone: string;
  color?: "text" | "accent";
}

export function Clock({ timezone, color = "text" }: ClockProps) {
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

  return (
    <div className={`weather-widget__time ${colorClass}`}>
      {formatTimeInTimezone(now, timezone)}
    </div>
  );
}
