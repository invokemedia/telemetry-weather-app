import { createUseInstanceStoreState } from "@telemetryos/sdk/react";
import type { WeatherConfig, Location } from "@/types/weather";

// Create typed hooks for each store key
// These hooks handle subscription/unsubscription automatically
// and provide loading states out of the box

// Main config object (contains all settings)
export const useWeatherConfigState = createUseInstanceStoreState<WeatherConfig>(
  "config",
  {
    locations: [
      {
        id: Date.now().toString(),
        city: "Vancouver",
        displayName: "Vancouver",
      },
    ],
    displayDuration: 10,
    showForecast: true,
    forecastType: "daily",
    theme: "light",
    textColor: "#ffffff",
    textOpacity: 100,
    accentColor: "#ffffff",
    accentOpacity: 68,
    timeFormat: "12h",
    layoutPattern: "full",
  }
);

// Individual config fields (alternative pattern for granular control)
export const useLocationsState = createUseInstanceStoreState<Location[]>(
  "locations",
  [
    {
      id: Date.now().toString(),
      city: "Vancouver",
      displayName: "Vancouver",
    },
  ]
);

export const useDisplayDurationState = createUseInstanceStoreState<number>(
  "displayDuration",
  10
);

export const useThemeState = createUseInstanceStoreState<"light" | "dark">(
  "theme",
  "light"
);

export const useTextColorState = createUseInstanceStoreState<string>(
  "textColor",
  "#ffffff"
);
