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
  Location,
} from "@/types/weather";
import { ASPECT_RATIOS, type AspectRatioType } from "@/types/layout";

interface LocationWeatherData {
  location: Location;
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Render() {
  const [config, setConfig] = useState<WeatherConfig | null>(null);
  const [weatherData, setWeatherData] = useState<
    Map<string, LocationWeatherData>
  >(new Map());
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
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

  // Fetch weather data for all locations
  useEffect(() => {
    if (!config?.locations || config.locations.length === 0) return;

    const fetchWeatherForLocation = async (location: Location) => {
      try {
        console.log("🌤️ [Render] Fetching weather for:", location.city);

        // Fetch current weather conditions
        const currentConditions = await weather().getConditions({
          city: location.city,
          units: "metric",
        });

        console.log("✅ [Render] Current weather:", currentConditions);

        // Fetch 7-day forecast
        const dailyForecast = await weather().getDailyForecast({
          city: location.city,
          units: "metric",
          days: 7,
        });

        console.log("✅ [Render] Forecast:", dailyForecast);

        setWeatherData((prev) => {
          const newData = new Map(prev);
          newData.set(location.id, {
            location,
            currentWeather: currentConditions,
            forecast: dailyForecast,
          });
          return newData;
        });

        setError(null);
      } catch (err) {
        console.error("❌ [Render] Weather fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather"
        );
      }
    };

    // Fetch weather for all locations
    const fetchAllWeather = async () => {
      setLoading(true);
      await Promise.all(config.locations.map(fetchWeatherForLocation));
      setLoading(false);
    };

    fetchAllWeather();

    // Refresh weather data every 10 minutes
    const refreshInterval = setInterval(fetchAllWeather, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [config]);

  // Cycle through locations
  useEffect(() => {
    if (
      !config?.locations ||
      config.locations.length <= 1 ||
      !config.displayDuration
    )
      return;

    const cycleDuration = config.displayDuration * 1000; // Convert to ms
    const fadeDuration = 500; // Fade transition duration in ms

    const cycleTimer = setInterval(() => {
      // Fade out
      setFadeState("out");

      // After fade out, change location and fade in
      setTimeout(() => {
        setCurrentLocationIndex((prev) =>
          prev >= config.locations.length - 1 ? 0 : prev + 1
        );
        setFadeState("in");
      }, fadeDuration);
    }, cycleDuration);

    return () => clearInterval(cycleTimer);
  }, [config]);

  // Get current location's weather data
  const currentLocation = config?.locations?.[currentLocationIndex];
  const currentData = currentLocation
    ? weatherData.get(currentLocation.id)
    : null;

  const currentWeather = currentData?.currentWeather || null;
  const forecast = currentData?.forecast || [];

  // Render the appropriate layout based on detected aspect ratio
  return (
    <div
      className={`weather-app-container weather-app--${aspectRatio} weather-app--fade-${fadeState}`}
    >
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
