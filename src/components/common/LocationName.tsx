interface LocationNameProps {
  name?: string;
  className?: string;
}

export function LocationName({ name, className }: LocationNameProps) {
  return (
    <div className={`weather-widget__location ${className ?? ""}`}>
      {name ?? "--"}
    </div>
  );
}
