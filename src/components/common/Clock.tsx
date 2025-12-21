import { useState, useEffect } from "react";
import { formatTimeInTimezone } from "@/utils/formatTimeInTimezone";

interface ClockProps {
  timezone: string;
}

export function Clock({ timezone }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-widget__time weather-widget__text-color">
      {formatTimeInTimezone(now, timezone)}
    </div>
  );
}
