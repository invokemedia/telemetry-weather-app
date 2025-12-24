export function formatTimeInTimezone(
  date: Date,
  timezone: string,
  timeFormat: "12h" | "24h" = "24h"
): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: timeFormat === "12h",
    timeZone: timezone,
  }).format(date);
}
