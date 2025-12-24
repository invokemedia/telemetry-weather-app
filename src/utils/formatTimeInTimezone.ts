// Converts a Date to HH:MM time string in a specific timezone (e.g., "14:30" or "2:30 PM")
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
