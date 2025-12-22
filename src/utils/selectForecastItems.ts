type ForecastType = "hourly" | "daily";

interface ForecastSelectOptions {
  hourlyStep: number; // e.g. 2 → every 2 hours
  hourlyCount: number; // how many items to show
  dailyCount: number; // how many days to show
  skipToday?: boolean; // exclude today's forecast
}

export function selectForecastItems(
  forecast: any[],
  type: ForecastType,
  {
    hourlyStep,
    hourlyCount,
    dailyCount,
    skipToday = true,
  }: ForecastSelectOptions
) {
  if (type === "hourly") {
    return forecast
      .filter((_, index) => index % hourlyStep === 0)
      .slice(0, hourlyCount);
  }

  const startIndex = skipToday ? 1 : 0;
  return forecast.slice(startIndex, startIndex + dailyCount);
}
