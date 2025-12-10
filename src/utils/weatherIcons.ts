/**
 * Maps AccuWeather weather codes to emoji icons
 *
 * Uses official AccuWeather icon codes (1-44)
 * Reference: https://apidev.accuweather.com/developers/weatherIcons
 */
export function getWeatherIcon(weatherCode: string): string {
  if (!weatherCode) return "🌤️";

  const code = parseInt(weatherCode, 10);

  switch (code) {
    // Sunny / Clear
    case 1: // Sunny
    case 2: // Mostly Sunny
    case 33: // Clear (night)
    case 34: // Mostly Clear (night)
      return "☀️";

    // Partly Cloudy
    case 3: // Partly Sunny
    case 4: // Intermittent Clouds
    case 5: // Hazy Sunshine
    case 35: // Partly Cloudy (night)
    case 36: // Intermittent Clouds (night)
    case 37: // Hazy Moonlight (night)
      return "⛅";

    // Cloudy
    case 6: // Mostly Cloudy
    case 7: // Cloudy
    case 8: // Dreary (Overcast)
    case 38: // Mostly Cloudy (night)
      return "☁️";

    // Fog
    case 11: // Fog
      return "🌫️";

    // Rain / Showers
    case 12: // Showers
    case 13: // Mostly Cloudy w/ Showers
    case 14: // Partly Sunny w/ Showers
    case 18: // Rain
    case 26: // Freezing Rain
    case 39: // Partly Cloudy w/ Showers (night)
    case 40: // Mostly Cloudy w/ Showers (night)
      return "🌧️";

    // Thunderstorms
    case 15: // Thunderstorms
    case 16: // Mostly Cloudy w/ Thunderstorms
    case 17: // Partly Sunny w/ Thunderstorms
    case 41: // Partly Cloudy w/ Thunderstorms (night)
    case 42: // Mostly Cloudy w/ Thunderstorms (night)
      return "⛈️";

    // Snow
    case 19: // Flurries
    case 20: // Mostly Cloudy w/ Flurries
    case 21: // Partly Sunny w/ Flurries
    case 22: // Snow
    case 23: // Mostly Cloudy w/ Snow
    case 43: // Mostly Cloudy w/ Flurries (night)
    case 44: // Mostly Cloudy w/ Snow (night)
      return "❄️";

    // Ice / Sleet
    case 24: // Ice
    case 25: // Sleet
    case 29: // Rain and Snow
      return "🌨️";

    // Windy / Extreme
    case 30: // Hot
    case 31: // Cold
    case 32: // Windy
      return "💨";

    // Default fallback for unknown codes
    default:
      return "🌤️";
  }
}
