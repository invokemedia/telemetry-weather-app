interface WeatherForecastItemProps {
  temperature: number;
  icon: string;
  day: string;
}

export function WeatherForecastItem({
  temperature,
  icon,
  day,
}: WeatherForecastItemProps) {
  return (
    <div className="weather-widget__forecast-item">
      <div className="weather-widget__forecast-temp">{temperature}°</div>
      <div className="weather-widget__forecast-icon">{icon}</div>
      <div className="weather-widget__forecast-day">{day}</div>
    </div>
  );
}
