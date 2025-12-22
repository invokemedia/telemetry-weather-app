interface WeatherIconProps {
  icon: string;
  variant?: "current" | "forecast";
  color?: "text" | "accent";
}

export function WeatherIcon({
  icon,
  variant = "current",
  color = "text",
}: WeatherIconProps) {
  const variantClass =
    variant === "current"
      ? "weather-widget__icon--current"
      : "weather-widget__icon--forecast";

  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`${variantClass} ${colorClass}`}>
      <img src={icon} alt="Weather icon" className="weather-widget__icon-img" />
    </div>
  );
}
