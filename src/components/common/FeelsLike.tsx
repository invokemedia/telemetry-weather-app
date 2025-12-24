interface FeelsLikeProps {
  value?: number;
  color?: "text" | "accent";
  units?: "imperial" | "metric";
}

export function FeelsLike({
  value,
  color = "text",
  units = "imperial",
}: FeelsLikeProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  const unitSymbol = units === "imperial" ? "°F" : "°C";

  return (
    <div className={`weather-widget__feels-like ${colorClass}`}>
      Feels Like {value !== undefined ? `${value}${unitSymbol}` : `--${unitSymbol}`}
    </div>
  );
}
