import { useState, useEffect } from "react";

function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function Clock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-widget__time weather-widget__text-color">
      {time}
    </div>
  );
}
