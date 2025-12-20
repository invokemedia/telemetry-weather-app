interface TemperatureProps {
  value?: number;
  className?: string;
}

export function Temperature({ value, className }: TemperatureProps) {
  return (
    <div className={`weather-widget__temperature ${className ?? ""}`}>
      {value !== undefined ? `${value}°` : "--°"}
    </div>
  );
}
