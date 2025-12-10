import { useEffect, useState } from "react";
import { store, weather } from "@telemetryos/sdk";
import "./Render.css";
import { Layout16x9 } from "@/components/layouts/Layout16x9";
import { Layout1x1 } from "@/components/layouts/Layout1x1";
import { Layout1x10 } from "@/components/layouts/Layout1x10";
import type {
  WeatherConditions,
  WeatherForecast,
  WeatherConfig,
} from "@/types/weather";
import { ASPECT_RATIOS, type AspectRatioType } from "@/types/layout";

export function Render() {
  const [config, setConfig] = useState<WeatherConfig | null>(null);
  const [currentWeather, setCurrentWeather] =
    useState<WeatherConditions | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(
    ASPECT_RATIOS.FULL_SCREEN_16x9
  );

  // Detect aspect ratio on mount and window resize
  useEffect(() => {
    const detectAspectRatio = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;

      console.log(
        `📐 [Render] Aspect ratio: ${ratio.toFixed(2)} (${width}x${height})`
      );

      // Determine layout type based on aspect ratio
      if (ratio >= 1.5) {
        // Landscape/wide (16:9 is ~1.78)
        setAspectRatio(ASPECT_RATIOS.FULL_SCREEN_16x9);
      } else if (ratio >= 0.7 && ratio < 1.3) {
        // Square (1:1)
        setAspectRatio(ASPECT_RATIOS.SQUARE_1x1);
      } else if (ratio < 0.7) {
        // Tall/portrait (1:10 is 0.1)
        setAspectRatio(ASPECT_RATIOS.SUPER_TALL_1x10);
      } else {
        setAspectRatio(ASPECT_RATIOS.FULL_SCREEN_16x9);
      }
    };

    detectAspectRatio();
    window.addEventListener("resize", detectAspectRatio);

    return () => window.removeEventListener("resize", detectAspectRatio);
  }, []);

  // Subscribe to config changes from Settings
  useEffect(() => {
    const handler = (newConfig?: WeatherConfig) => {
      if (newConfig) {
        setConfig(newConfig);
      }
    };

    store()
      .instance.get<WeatherConfig>("config")
      .then((savedConfig) => {
        if (savedConfig) setConfig(savedConfig);
      })
      .catch(console.error);

    store()
      .instance.subscribe<WeatherConfig>("config", handler)
      .catch(console.error);

    return () => {
      store().instance.unsubscribe("config", handler).catch(console.error);
    };
  }, []);

  // Render the appropriate layout based on detected aspect ratio
  return (
    <div className={`weather-app-container weather-app--${aspectRatio}`}>
      {aspectRatio === ASPECT_RATIOS.FULL_SCREEN_16x9 && (
        <Layout16x9 currentWeather={currentWeather} forecast={forecast} />
      )}
      {aspectRatio === ASPECT_RATIOS.SQUARE_1x1 && (
        <Layout1x1 currentWeather={currentWeather} forecast={forecast} />
      )}
      {aspectRatio === ASPECT_RATIOS.SUPER_TALL_1x10 && (
        <Layout1x10 currentWeather={currentWeather} forecast={forecast} />
      )}
    </div>
  );
}
