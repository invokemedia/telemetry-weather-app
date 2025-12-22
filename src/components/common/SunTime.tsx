import SunriseIcon from "@/assets/icon-sunrise.svg";
import SunsetIcon from "@/assets/icon-sunset.svg";

interface SunTimeProps {
  type: "sunrise" | "sunset";
  time: string;
  color?: "text" | "accent";
}

export function SunTime({ type, time, color = "text" }: SunTimeProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className="weather-widget__sun-item">
      <div
        className={`weather-widget__sun-icon weather-widget__sun-icon--${type} ${colorClass}`}
      />
      <span className={`weather-widget__sun-time ${colorClass}`}>{time}</span>
    </div>
  );
}
