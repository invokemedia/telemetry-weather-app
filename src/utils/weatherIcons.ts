/**
 * Maps weather code to emoji icons
 * Uses WeatherCode (OpenWeatherMap standard codes)
 *
 * Code ranges:
 * - 200-299: Thunderstorm
 * - 300-399: Drizzle
 * - 500-599: Rain
 * - 600-699: Snow
 * - 700-799: Atmosphere (fog, mist, haze, etc.)
 * - 800: Clear sky
 * - 801-804: Clouds
 *
 * Reference: https://openweathermap.org/weather-conditions
 */
export function getWeatherIcon(weatherCode: string): string {
  if (!weatherCode) return "—";

  const code = parseInt(weatherCode, 10);

  // Thunderstorm (200-299)
  if (code >= 200 && code < 300) {
    return "⛈️";
  }

  // Drizzle (300-399)
  if (code >= 300 && code < 400) {
    return "🌧️";
  }

  // Rain (500-599)
  if (code >= 500 && code < 600) {
    return "🌧️";
  }

  // Snow (600-699)
  if (code >= 600 && code < 700) {
    return "❄️";
  }

  // Atmosphere - Fog/Mist/Haze (700-799)
  if (code >= 700 && code < 800) {
    return "🌫️";
  }

  // Clear sky (800)
  if (code === 800) {
    return "☀️";
  }

  // Clouds (801-804)
  if (code === 801 || code === 802) {
    // Few clouds, scattered clouds
    return "⛅";
  }

  if (code === 803 || code === 804) {
    // Broken clouds, overcast
    return "☁️";
  }

  // Default fallback if code doesn't match
  return "—";
}
