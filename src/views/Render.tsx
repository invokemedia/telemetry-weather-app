import { useEffect, useState, useMemo, useRef } from "react";
import { store, weather } from "@telemetryos/sdk";
import "./Render.css";
import { Layout16x9 } from "@/components/layouts/Layout16x9";
import { Layout1x1 } from "@/components/layouts/Layout1x1";
import { Layout1x10 } from "@/components/layouts/Layout1x10";
import { useWeatherConfigStoreState } from "@/hooks/store";
import type {
  WeatherConditions,
  WeatherForecast,
  Location,
  CachedWeatherData,
} from "@/types/weather";
import { ASPECT_RATIOS, type AspectRatioType } from "@/types/layout";

interface LocationWeatherData {
  location: Location;
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Render() {
  // Use SDK hook for config state - automatically syncs with Settings
  const [isLoadingConfig, config] = useWeatherConfigStoreState(
    store().instance
  );

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

  const theme = config.theme || "light";

  // Memoize locations to prevent infinite loops in useEffect dependencies
  const locations = useMemo(() => config.locations || [], [config.locations]);

  // Track location IDs to detect actual changes (not just reference changes)
  const locationIdsRef = useRef<string>("");
  const cacheLoadedForIdsRef = useRef<string>("");
  const currentLocationIds = useMemo(
    () => locations.map((loc: Location) => loc.id).join(","),
    [locations]
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

  // Apply custom text color via CSS custom property
  useEffect(() => {
    if (config.textColor) {
      document.documentElement.style.setProperty(
        "--custom-text-color",
        config.textColor
      );
    } else {
      document.documentElement.style.removeProperty("--custom-text-color");
    }
  }, [config.textColor]);

  // Load cached weather data on mount (for instant display)
  useEffect(() => {
    if (!locations || locations.length === 0) return;

    // Only load cache if location IDs have actually changed
    if (cacheLoadedForIdsRef.current === currentLocationIds) {
      return;
    }
    cacheLoadedForIdsRef.current = currentLocationIds;

    const loadCachedData = async () => {
      for (const location of locations) {
        try {
          // Try to load cached data from device storage
          const cached = await store().device.get<CachedWeatherData>(
            `weather_${location.id}`
          );

          if (cached) {
            console.log(`📦 [Render] Loaded cached data for ${location.city}`);
            setWeatherData((prev) => {
              const newData = new Map(prev);
              newData.set(location.id, {
                location,
                currentWeather: cached.currentWeather,
                forecast: cached.forecast,
              });
              return newData;
            });
          }
        } catch (err) {
          console.error(
            `❌ [Render] Failed to load cache for ${location.city}:`,
            err
          );
        }
      }
      setLoading(false);
    };

    loadCachedData();
  }, [currentLocationIds, locations]);

  // Fetch weather data for all locations
  useEffect(() => {
    if (!locations || locations.length === 0) return;

    // Only fetch if location IDs have actually changed
    if (locationIdsRef.current === currentLocationIds) {
      return;
    }
    locationIdsRef.current = currentLocationIds;

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

        // Update state with fresh data
        setWeatherData((prev) => {
          const newData = new Map(prev);
          newData.set(location.id, {
            location,
            currentWeather: currentConditions,
            forecast: dailyForecast,
          });
          return newData;
        });

        // Cache the data to device storage
        const cacheData: CachedWeatherData = {
          currentWeather: currentConditions,
          forecast: dailyForecast,
          cachedAt: Date.now(),
        };

        await store().device.set(`weather_${location.id}`, cacheData);
        console.log(`💾 [Render] Cached weather data for ${location.city}`);

        setError(null);
      } catch (err) {
        console.error("❌ [Render] Weather fetch error:", err);
        // Don't update error state - keep showing cached data if available
        console.log("📦 [Render] Keeping cached data due to fetch failure");
      }
    };

    // Fetch weather for all locations
    const fetchAllWeather = async () => {
      await Promise.all(locations.map(fetchWeatherForLocation));
    };

    // Fetch immediately
    fetchAllWeather();

    // Refresh weather data every 10 minutes
    const refreshInterval = setInterval(fetchAllWeather, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [currentLocationIds, locations]);

  // Cycle through locations
  useEffect(() => {
    if (!locations || locations.length <= 1 || !config.displayDuration) return;

    const cycleDuration = config.displayDuration * 1000; // Convert to ms
    const fadeDuration = 300; // Fade transition duration in ms

    const cycleTimer = setInterval(() => {
      // Fade out
      setFadeState("out");

      // After fade out, change location and fade in
      setTimeout(() => {
        setCurrentLocationIndex((prev) =>
          prev >= locations.length - 1 ? 0 : prev + 1
        );
        setFadeState("in");
      }, fadeDuration);
    }, cycleDuration);

    return () => clearInterval(cycleTimer);
  }, [locations, config.displayDuration]);

  // Get current location's weather data
  const currentLocation = locations?.[currentLocationIndex];
  const currentData = currentLocation
    ? weatherData.get(currentLocation.id)
    : null;

  const currentWeather = currentData?.currentWeather || null;
  const forecast = currentData?.forecast || [];

  // Render the appropriate layout based on detected aspect ratio
  return (
    <div
      className={`weather-app-container weather-app--${aspectRatio} weather-app--fade-${fadeState} ${
        theme === "dark" ? "weather-app-container--dark" : ""
      }`}
    >
      {aspectRatio === ASPECT_RATIOS.FULL_SCREEN_16x9 && (
        <Layout16x9
          currentWeather={currentWeather}
          forecast={forecast}
          locationName={currentLocation?.displayName || currentLocation?.city}
        />
      )}
      {aspectRatio === ASPECT_RATIOS.SQUARE_1x1 && (
        <Layout1x1
          currentWeather={currentWeather}
          forecast={forecast}
          locationName={currentLocation?.displayName || currentLocation?.city}
        />
      )}
      {aspectRatio === ASPECT_RATIOS.SUPER_TALL_1x10 && (
        <Layout1x10
          currentWeather={currentWeather}
          forecast={forecast}
          locationName={currentLocation?.displayName || currentLocation?.city}
        />
      )}
    </div>
  );
}
