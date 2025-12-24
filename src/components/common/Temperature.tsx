interface TemperatureProps {
  value?: number;
  variant?: "current" | "forecast";
  color?: "text" | "accent";
  units?: "imperial" | "metric";
}

export function Temperature({
  value,
  variant = "current",
  color = "text",
  units = "imperial",
}: TemperatureProps) {
  const variantClass =
    variant === "current"
      ? "weather-widget__temp--current"
      : "weather-widget__temp--forecast";

  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  const unitSymbol = units === "imperial" ? "°F" : "°C";

  return (
    <div className={`${variantClass} ${colorClass}`}>
      {value !== undefined ? `${value}${unitSymbol}` : `--${unitSymbol}`}
    </div>
  );
}
