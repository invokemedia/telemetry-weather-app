/**
 * Maps weather description text to emoji icons
 *
 * Note: TelemetryOS uses custom weather codes. This function uses keyword matching
 * as a fallback until official mapping is provided.
 */
export function getWeatherIcon(weatherText: string): string {
  if (!weatherText) return "🌤️";

  const text = weatherText.toLowerCase();

  // Thunderstorm
  if (text.includes("thunderstorm") || text.includes("thunder")) {
    return "⛈️";
  }

  // Snow (check before rain, as some labels contain both)
  if (text.includes("snow") || text.includes("sleet")) {
    return "❄️";
  }

  // Rain
  if (
    text.includes("rain") ||
    text.includes("drizzle") ||
    text.includes("shower")
  ) {
    return "🌧️";
  }

  // Fog/Mist/Haze
  if (text.includes("fog") || text.includes("mist") || text.includes("haze")) {
    return "🌫️";
  }

  // Clear
  if (text.includes("clear") || text.includes("sunny")) {
    return "☀️";
  }

  // Clouds - scattered/few
  if (text.includes("few clouds") || text.includes("scattered clouds")) {
    return "⛅";
  }

  // Clouds - overcast/broken
  if (
    text.includes("overcast") ||
    text.includes("broken clouds") ||
    text.includes("cloudy")
  ) {
    return "☁️";
  }

  // Generic cloud fallback
  if (text.includes("cloud")) {
    return "☁️";
  }

  // Default fallback
  return "🌤️";
}
