interface TemperatureProps {
  value?: number;
  variant?: "current" | "forecast";
  color?: "text" | "accent";
}

export function Temperature({
  value,
  variant = "current",
  color = "text",
}: TemperatureProps) {
  const variantClass =
    variant === "current"
      ? "weather-widget__temp--current"
      : "weather-widget__temp--forecast";

  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`${variantClass} ${colorClass}`}>
      {value !== undefined ? `${value}°` : "--°"}
    </div>
  );
}
