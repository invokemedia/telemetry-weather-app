interface LocationNameProps {
  name?: string;
  color?: "text" | "accent";
}

export function LocationName({ name, color = "text" }: LocationNameProps) {
  const colorClass =
    color === "text"
      ? "weather-widget__text-color"
      : "weather-widget__accent-text";

  return (
    <div className={`weather-widget__location ${colorClass}`}>
      {name ?? "--"}
    </div>
  );
}
