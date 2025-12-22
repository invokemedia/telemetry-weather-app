interface FeelsLikeProps {
  value?: number;
  color?: "text" | "accent";
}

export function FeelsLike({ value, color = "text" }: FeelsLikeProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`weather-widget__feels-like ${colorClass}`}>
      Feels Like {value !== undefined ? `${value}°` : "--°"}
    </div>
  );
}
