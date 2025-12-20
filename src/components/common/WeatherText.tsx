interface WeatherTextProps {
  text?: string;
  className?: string;
}

export function WeatherText({ text, className }: WeatherTextProps) {
  return (
    <div className={`weather-widget__weather-text ${className ?? ""}`}>
      {text ?? "--"}
    </div>
  );
}
