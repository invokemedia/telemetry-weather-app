/**
 * Maps AccuWeather weather codes to custom SVG icons
 *
 * Uses official AccuWeather icon codes (1-44)
 * Reference: https://apidev.accuweather.com/developers/weatherIcons
 */

// Import all weather icons
// Day icons (with sun imagery)
import clearIcon from "@/assets/weather/clear-icon.svg";
import partlySunnyIcon from "@/assets/weather/partlysunny-icon.svg";
import mostlyCloudyIcon from "@/assets/weather/mostlycloudy-icon.svg";

// Night-specific icons (with moon imagery)
import ntClearIcon from "@/assets/weather/nt_clear-icon.svg";
import ntPartlyCloudyIcon from "@/assets/weather/nt_partlycloudy-icon.svg";
import ntMostlyCloudyIcon from "@/assets/weather/nt_mostlycloudy-icon.svg";

// Generic weather icons (work for both day and night)
import chanceFlurriesIcon from "@/assets/weather/chanceflurries-icon.svg";
import chanceRainIcon from "@/assets/weather/chancerain-icon.svg";
import chanceSleetIcon from "@/assets/weather/chancesleet-icon.svg";
import cloudIcon from "@/assets/weather/cloud-icon.svg";
import fogIcon from "@/assets/weather/fog-icon.svg";
import rainIcon from "@/assets/weather/rain-icon.svg";
import sleetIcon from "@/assets/weather/sleet-icon.svg";
import thunderIcon from "@/assets/weather/thunder-icon.svg";
import tstormsIcon from "@/assets/weather/tstorms-icon.svg";

// Converts AccuWeather numeric code (1-44) to corresponding icon path
export function getWeatherIcon(weatherCode: string): string {
  if (!weatherCode) return partlySunnyIcon;

  const code = parseInt(weatherCode, 10);

  switch (code) {
    // Sunny / Clear
    case 1: // Sunny
    case 2: // Mostly Sunny
      return clearIcon;

    // Partly Cloudy / Partly Sunny
    case 3: // Partly Sunny
    case 4: // Intermittent Clouds
    case 5: // Hazy Sunshine
      return partlySunnyIcon;

    // Mostly Cloudy / Cloudy
    case 6: // Mostly Cloudy
    case 7: // Cloudy
    case 8: // Dreary (Overcast)
      return mostlyCloudyIcon;

    // Fog
    case 11: // Fog
      return fogIcon;

    // Rain / Showers
    case 12: // Showers
    case 13: // Mostly Cloudy w/ Showers
    case 14: // Partly Sunny w/ Showers
      return chanceRainIcon;

    case 18: // Rain
    case 26: // Freezing Rain
      return rainIcon;

    // Thunderstorms
    case 15: // Thunderstorms
    case 16: // Mostly Cloudy w/ Thunderstorms
    case 17: // Partly Sunny w/ Thunderstorms
      return tstormsIcon;

    // Snow / Flurries
    case 19: // Flurries
    case 20: // Mostly Cloudy w/ Flurries
    case 21: // Partly Sunny w/ Flurries
    case 22: // Snow
    case 23: // Mostly Cloudy w/ Snow
      return chanceFlurriesIcon;

    // Ice / Sleet
    case 24: // Ice
    case 25: // Sleet
      return chanceSleetIcon;

    // Rain and Snow mix
    case 29: // Rain and Snow
      return sleetIcon;

    // Windy / Extreme
    case 30: // Hot
    case 31: // Cold
    case 32: // Windy
      return cloudIcon;

    // ==================== NIGHT ====================
    // Clear
    case 33: // Clear
    case 34: // Mostly Clear
      return ntClearIcon;

    // Partly Cloudy
    case 35: // Partly Cloudy
    case 36: // Intermittent Clouds
    case 37: // Hazy Moonlight
      return ntPartlyCloudyIcon;

    // Mostly Cloudy / Cloudy
    case 38: // Mostly Cloudy
      return ntMostlyCloudyIcon;

    // Rain / Showers
    case 39: // Partly Cloudy w/ Showers
    case 40: // Mostly Cloudy w/ Showers
      return rainIcon;

    // Thunderstorms
    case 41: // Partly Cloudy w/ Thunderstorms
    case 42: // Mostly Cloudy w/ Thunderstorms
      return thunderIcon;

    // Snow / Flurries
    case 43: // Mostly Cloudy w/ Flurries
    case 44: // Mostly Cloudy w/ Snow
      return chanceFlurriesIcon;

    // Default fallback for unknown codes
    default:
      return partlySunnyIcon;
  }
}
