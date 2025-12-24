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

// Converts Unix timestamp to HH:MM time string (e.g., "14:30" or "2:30 PM")
export function formatTimeFromTimestamp(
  timestamp: number,
  format: "12h" | "24h" = "12h"
): string {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (format === "24h") {
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  // 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");
  return `${h12}:${m} ${period}`;
}

// Formats Unix timestamp for forecast labels in user's local timezone (e.g., "1 PM", "14:00")
export function formatForecastTime(
  timestamp: number,
  format: "12h" | "24h" = "12h"
): string {
  // Convert Unix timestamp to Date
  const date = new Date(timestamp * 1000);

  if (isNaN(date.getTime())) {
    console.error(`Invalid timestamp: ${timestamp}`);
    return format === "24h" ? "00:00" : "12 AM";
  }

  // Get user's timezone automatically
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format in user's local timezone
  const timeString = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: format === "12h",
    timeZone: userTimeZone,
  }).format(date);

  if (format === "24h") {
    // Extract hour and pad with zero
    const hour = parseInt(timeString, 10);
    return hour.toString().padStart(2, "0") + ":00";
  }

  // 12-hour format - return as-is from Intl (e.g., "1 PM")
  return timeString;
}

// Formats date string to abbreviated day name for daily forecast (e.g., "Mon", "Tue")
export function formatDayLabel(datetime: string): string {
  // Handle TelemetryOS API format: "2025-12-19:06" or "2025-12-19"
  // Extract the date part before any colon
  const datePart = datetime.split(":")[0];
  const date = new Date(datePart);

  if (isNaN(date.getTime())) {
    console.error(`Invalid datetime string: ${datetime}`);
    return "---";
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}
