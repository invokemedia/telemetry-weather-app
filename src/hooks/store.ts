import { createUseStoreState } from "@telemetryos/sdk/react";
import type { WeatherConfig, Location } from "@/types/weather";

// Create typed hooks for each store key
// These hooks handle subscription/unsubscription automatically
// and provide loading states out of the box

// Main config object (contains all settings)
export const useWeatherConfigStoreState = createUseStoreState<WeatherConfig>(
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
    theme: "light",
    textColor: "#ffffff",
  }
);

// Individual config fields (alternative pattern for granular control)
export const useLocationsStoreState = createUseStoreState<Location[]>(
  "locations",
  [
    {
      id: Date.now().toString(),
      city: "Vancouver",
      displayName: "Vancouver",
    },
  ]
);

export const useDisplayDurationStoreState = createUseStoreState<number>(
  "displayDuration",
  10
);

export const useThemeStoreState = createUseStoreState<"light" | "dark">(
  "theme",
  "light"
);

export const useTextColorStoreState = createUseStoreState<string>(
  "textColor",
  "#ffffff"
);
