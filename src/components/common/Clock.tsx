import { useState, useEffect } from "react";

interface ClockProps {
  format?: "12h" | "24h";
  showSeconds?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function formatTime(
  date: Date,
  format: "12h" | "24h",
  showSeconds: boolean
): { time: string; period?: string } {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (format === "24h") {
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    if (showSeconds) {
      const s = seconds.toString().padStart(2, "0");
      return { time: `${h}:${m}:${s}` };
    }
    return { time: `${h}:${m}` };
  }

  // 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");

  if (showSeconds) {
    const s = seconds.toString().padStart(2, "0");
    return { time: `${h12}:${m}:${s}`, period };
  }
  return { time: `${h12}:${m}`, period };
}

export function Clock({
  format = "12h",
  showSeconds = false,
  className,
  style,
}: ClockProps) {
  const [timeData, setTimeData] = useState(() =>
    formatTime(new Date(), format, showSeconds)
  );

  useEffect(() => {
    // Update time every second (or every minute if not showing seconds)
    const interval = setInterval(
      () => {
        setTimeData(formatTime(new Date(), format, showSeconds));
      },
      showSeconds ? 1000 : 60000
    );

    return () => clearInterval(interval);
  }, [format, showSeconds]);

  return (
    <div className={className} style={style}>
      {timeData.time}
      {timeData.period && (
        <span className="weather-widget__time-period"> {timeData.period}</span>
      )}
    </div>
  );
}
