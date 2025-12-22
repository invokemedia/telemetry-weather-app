interface WeatherTextProps {
  text?: string;
  color?: "text" | "accent";
}

export function WeatherText({ text, color = "text" }: WeatherTextProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`weather-widget__weather-text ${colorClass}`}>
      {text ?? "--"}
    </div>
  );
}
