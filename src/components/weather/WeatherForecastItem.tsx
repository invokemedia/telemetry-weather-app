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
      <div className="weather-widget__forecast-icon">
        <img src={icon} alt="Weather icon" />
      </div>
      <div className="weather-widget__forecast-day">{day}</div>
    </div>
  );
}
