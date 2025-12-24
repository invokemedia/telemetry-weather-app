import { createUseInstanceStoreState } from "@telemetryos/sdk/react";
import type { WeatherConfig } from "@/types/weather";

// Create typed hook for weather config
// This hook handles subscription/unsubscription automatically
// and provides loading states out of the box

export const useWeatherConfigState = createUseInstanceStoreState<WeatherConfig>(
  "config",
  {
    locations: [
      {
        id: Date.now().toString(),
        city: "New York",
        state: "NY",
        displayName: "New York",
      },
    ],
    displayDuration: 10,
    showForecast: true,
    forecastType: "daily",
    timeFormat: "12h",
    theme: "light",
    textColor: "#ffffff",
    textOpacity: 100,
    accentColor: "#ffffff",
    accentOpacity: 68,
    layoutPattern: "full",
    layout1x1Variant: "location",
    layout3x1Variant: "weather-text",
    layout10x1Variant: "current-condition-only",
  }
);
