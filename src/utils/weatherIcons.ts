/**
 * Maps AccuWeather weather codes to custom SVG icons
 *
 * Uses official AccuWeather icon codes (1-44)
 * Reference: https://apidev.accuweather.com/developers/weatherIcons
 */

// Import all weather icons
import clearIcon from "@/assets/clear-icon.svg";
import mostlyCloudyIcon from "@/assets/mostlycloudy-icon.svg";
import ntChanceFlurriesIcon from "@/assets/nt_chanceflurries-icon.svg";
import ntChanceRainIcon from "@/assets/nt_chancerain-icon.svg";
import ntClearIcon from "@/assets/nt_clear-icon.svg";
import ntCloudyIcon from "@/assets/nt_cloudy-icon.svg";
import ntFogIcon from "@/assets/nt_fog-icon.svg";
import ntMostlyCloudyIcon from "@/assets/nt_mostlycloudy-icon.svg";
import ntPartlyCloudyIcon from "@/assets/nt_partlycloudy-icon.svg";
import ntRainIcon from "@/assets/nt_rain-icon.svg";
import ntSleetIcon from "@/assets/nt_sleet-icon.svg";
import ntTstorms1Icon from "@/assets/nt_tstorms-icon-1.svg";
import ntTstormsIcon from "@/assets/nt_tstorms-icon.svg";
import partlySunnyIcon from "@/assets/partlysunny-icon.svg";

export function getWeatherIcon(weatherCode: string): string {
  if (!weatherCode) return partlySunnyIcon;

  const code = parseInt(weatherCode, 10);

  switch (code) {
    // Sunny / Clear (day)
    case 1: // Sunny
    case 2: // Mostly Sunny
      return clearIcon;

    // Clear (night)
    case 33: // Clear (night)
    case 34: // Mostly Clear (night)
      return ntClearIcon;

    // Partly Cloudy / Partly Sunny (day)
    case 3: // Partly Sunny
    case 4: // Intermittent Clouds
    case 5: // Hazy Sunshine
      return partlySunnyIcon;

    // Partly Cloudy (night)
    case 35: // Partly Cloudy (night)
    case 36: // Intermittent Clouds (night)
    case 37: // Hazy Moonlight (night)
      return ntPartlyCloudyIcon;

    // Mostly Cloudy / Cloudy (day)
    case 6: // Mostly Cloudy
    case 7: // Cloudy
    case 8: // Dreary (Overcast)
      return mostlyCloudyIcon;

    // Mostly Cloudy (night)
    case 38: // Mostly Cloudy (night)
      return ntMostlyCloudyIcon;

    // Fog
    case 11: // Fog
      return ntFogIcon;

    // Rain / Showers (day)
    case 12: // Showers
    case 13: // Mostly Cloudy w/ Showers
    case 14: // Partly Sunny w/ Showers
    case 18: // Rain
      return ntChanceRainIcon;

    // Rain / Showers (night)
    case 26: // Freezing Rain
    case 39: // Partly Cloudy w/ Showers (night)
    case 40: // Mostly Cloudy w/ Showers (night)
      return ntRainIcon;

    // Thunderstorms (day)
    case 15: // Thunderstorms
    case 16: // Mostly Cloudy w/ Thunderstorms
    case 17: // Partly Sunny w/ Thunderstorms
      return ntTstormsIcon;

    // Thunderstorms (night)
    case 41: // Partly Cloudy w/ Thunderstorms (night)
    case 42: // Mostly Cloudy w/ Thunderstorms (night)
      return ntTstorms1Icon;

    // Snow / Flurries (day)
    case 19: // Flurries
    case 20: // Mostly Cloudy w/ Flurries
    case 21: // Partly Sunny w/ Flurries
    case 22: // Snow
    case 23: // Mostly Cloudy w/ Snow
      return ntChanceFlurriesIcon;

    // Snow / Flurries (night)
    case 43: // Mostly Cloudy w/ Flurries (night)
    case 44: // Mostly Cloudy w/ Snow (night)
      return ntChanceFlurriesIcon;

    // Ice / Sleet
    case 24: // Ice
    case 25: // Sleet
    case 29: // Rain and Snow
      return ntSleetIcon;

    // Windy / Extreme (using cloudy as placeholder)
    case 30: // Hot
    case 31: // Cold
    case 32: // Windy
      return ntCloudyIcon;

    // Default fallback for unknown codes
    default:
      return partlySunnyIcon;
  }
}
