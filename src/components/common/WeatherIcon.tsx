interface WeatherIconProps {
  icon: string;
  className?: string;
}

export function WeatherIcon({ icon, className }: WeatherIconProps) {
  return (
    <div className={`weather-widget__icon ${className ?? ""}`}>
      <img src={icon} alt="Weather icon" className="weather-widget__icon-img" />
    </div>
  );
}
