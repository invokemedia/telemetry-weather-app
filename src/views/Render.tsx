import { useEffect, useState, useMemo, useRef } from "react";
import { store, weather } from "@telemetryos/sdk";
import { useUiAspectRatio, useUiScaleToSetRem } from "@telemetryos/sdk/react";
import "./Render.css";

// Layouts (ordered by CSS variable definition)
import { Layout1x1 } from "@/components/layouts/Layout1x1";
import { Layout16x9 } from "@/components/layouts/Layout16x9";
import { Layout3x1 } from "@/components/layouts/Layout3x1";
import { Layout10x1 } from "@/components/layouts/Layout10x1";
import { Layout9x16 } from "@/components/layouts/Layout9x16";
import { Layout4x5 } from "@/components/layouts/Layout4x5";
import { Layout1x3 } from "@/components/layouts/Layout1x3";
import { Layout1x10 } from "@/components/layouts/Layout1x10";

// State / types
import { useWeatherConfigState } from "@/hooks/store";
import type {
  WeatherConditions,
  WeatherForecast,
  Location,
  CachedWeatherData,
} from "@/types/weather";
import {
  ASPECT_RATIOS,
  ASPECT_RATIO_VALUES,
  type AspectRatioType,
} from "@/types/layout";

/**
 * Weather data associated with a single configured location
 */
interface LocationWeatherData {
  location: Location;
  currentWeather: WeatherConditions | null;
  forecast: WeatherForecast[];
}

export function Render() {
  /**
   * App configuration shared with Settings
   */
  const [, config, setConfig] = useWeatherConfigState();

  /**
   * Weather data indexed by location ID
   * Map is used to preserve order stability and fast lookups
   */
  const [weatherData, setWeatherData] = useState<
    Map<string, LocationWeatherData>
  >(new Map());

  /**
   * Rotation / transition state
   */
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  /**
   * Get aspect ratio from SDK hook (handles resize automatically)
   */
  const numericAspectRatio = useUiAspectRatio();

  /**
   * Set root font-size based on viewport (1rem = 1% of longest dimension)
   * Using uiScale of 1.0 as baseline for testing
   */
  useUiScaleToSetRem(1.0);

  /**
   * Detected screen aspect ratio (classified into layout types)
   */
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(
    ASPECT_RATIOS.FULL_SCREEN_16x9
  );

  const theme = config.theme || "light";

  /**
   * Memoized locations to prevent unnecessary effect re-runs
   */
  const locations = useMemo(() => config.locations || [], [config.locations]);

  /**
   * Refs used to prevent duplicate cache loads and fetch loops
   */
  const locationIdsRef = useRef<string>("");
  const cacheLoadedForIdsRef = useRef<string>("");

  /**
   * Stable string representing the current set of locations
   */
  const currentLocationIds = useMemo(
    () => locations.map((loc: Location) => loc.id).join(","),
    [locations]
  );

  /**
   * Classify numeric aspect ratio into a layout type.
   *
   * - Portrait / very tall layouts are handled with explicit thresholds
   *   to switch early to vertical-safe layouts.
   * - Landscape and near-square layouts use a biased closest-match strategy
   *   that prefers smaller layouts to avoid overflow.
   */
  useEffect(() => {
    // Aspect ratio thresholds for early layout switching.
    // These values are intentionally aggressive to prevent content overflow.
    // Adjust these numbers to fine-tune when layouts downgrade.

    const SUPER_TALL_THRESHOLD = 0.3; // switch to 1x10 very early (extremely narrow)
    const TALL_THRESHOLD = 0.4; // switch to 1x3 when vertical space is tight
    const LANDSCAPE_BIAS = 0.1; // lower = switch to smaller layouts sooner

    // --- Portrait / tall layouts: explicit early switching ---
    if (numericAspectRatio < SUPER_TALL_THRESHOLD) {
      setAspectRatio(ASPECT_RATIOS.SUPER_TALL_1x10);
      return;
    }

    if (numericAspectRatio < TALL_THRESHOLD) {
      setAspectRatio(ASPECT_RATIOS.TALL_SHORT_1x3);
      return;
    }

    // --- Landscape / near-square (non-tall) layouts: biased closest match ---
    let closestRatio: AspectRatioType = ASPECT_RATIOS.FULL_SCREEN_16x9;
    let smallestScore = Infinity;

    Object.entries(ASPECT_RATIO_VALUES).forEach(([key, value]) => {
      const rawDiff = numericAspectRatio - value;
      const score =
        rawDiff < 0 ? Math.abs(rawDiff) * LANDSCAPE_BIAS : Math.abs(rawDiff);

      if (score < smallestScore) {
        smallestScore = score;
        closestRatio = key as AspectRatioType;
      }
    });

    setAspectRatio(closestRatio);

    if (config.currentAspectRatio !== closestRatio) {
      setConfig({ ...config, currentAspectRatio: closestRatio });
    }
  }, [numericAspectRatio, config, setConfig]);

  /**
   * Apply user-defined colors via CSS variables
   */
  useEffect(() => {
    const hexToRgba = (hex: string, opacity: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };

    document.documentElement.style.setProperty(
      "--custom-text-color",
      hexToRgba(config.textColor || "#ffffff", config.textOpacity ?? 100)
    );

    document.documentElement.style.setProperty(
      "--custom-accent-color",
      hexToRgba(config.accentColor || "#ffffff", config.accentOpacity ?? 68)
    );
  }, [
    config.textColor,
    config.textOpacity,
    config.accentColor,
    config.accentOpacity,
  ]);

  /**
   * Load cached weather data from device storage
   * Allows instant display while fresh data is fetched
   */
  useEffect(() => {
    if (locations.length === 0) return;
    if (cacheLoadedForIdsRef.current === currentLocationIds) return;

    cacheLoadedForIdsRef.current = currentLocationIds;

    const loadCachedData = async () => {
      for (const location of locations) {
        try {
          const cached = await store().device.get<CachedWeatherData>(
            `weather_${location.id}`
          );

          if (cached) {
            console.log(`📦 [Render] Loaded cached data for ${location.city}`);
            setWeatherData((prev) => {
              const next = new Map(prev);
              next.set(location.id, {
                location,
                currentWeather: cached.currentWeather,
                forecast: cached.forecast,
              });
              return next;
            });
          }
        } catch (err) {
          console.error(
            `❌ [Render] Failed to load cache for ${location.city}:`,
            err
          );
        }
      }
    };

    loadCachedData();
  }, [currentLocationIds, locations]);

  /**
   * Fetch live weather data for all locations
   * Refreshes periodically and updates cache
   */
  useEffect(() => {
    if (locations.length === 0) return;

    const fetchKey = `${currentLocationIds}_${config.forecastType || "daily"}_${
      config.units || "imperial"
    }`;
    if (locationIdsRef.current === fetchKey) return;
    locationIdsRef.current = fetchKey;

    const fetchWeatherForLocation = async (location: Location) => {
      try {
        console.log(
          "🌤️ [Render] Fetching weather for:",
          location.city || location.postalCode
        );

        // Build weather request params based on what's available
        const units = config.units || "imperial";
        const weatherParams = location.postalCode
          ? {
              postalCode: location.postalCode,
              units: units,
            }
          : { city: location.city!, units: units };

        const currentConditions = await weather().getConditions(weatherParams);

        console.log("✅ [Render] Current weather:", currentConditions);

        const forecast =
          config.forecastType === "hourly"
            ? await weather().getHourlyForecast({
                ...weatherParams,
                hours: 24,
              })
            : await weather().getDailyForecast({
                ...weatherParams,
                days: 7,
              });

        console.log(
          config.forecastType === "hourly"
            ? "✅ [Render] Hourly forecast:"
            : "✅ [Render] Daily forecast:",
          forecast
        );

        setWeatherData((prev) => {
          const next = new Map(prev);
          next.set(location.id, {
            location,
            currentWeather: currentConditions,
            forecast,
          });
          return next;
        });

        await store().device.set(`weather_${location.id}`, {
          currentWeather: currentConditions,
          forecast,
          cachedAt: Date.now(),
        });

        console.log(`💾 [Render] Cached weather data for ${location.city}`);
      } catch (err) {
        console.error("❌ [Render] Weather fetch error:", err);
        console.log("📦 [Render] Keeping cached data due to fetch failure");
        // Keep cached data visible on failure
      }
    };

    const fetchAll = async () => {
      await Promise.all(locations.map(fetchWeatherForLocation));
    };

    fetchAll();
    const interval = setInterval(fetchAll, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocationIds, locations, config.forecastType]);

  /**
   * Rotate between multiple locations with fade transition
   */
  useEffect(() => {
    if (locations.length <= 1 || !config.displayDuration) return;

    const cycleMs = config.displayDuration * 1000;
    const fadeMs = 300;

    const timer = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setCurrentLocationIndex((i) => (i >= locations.length - 1 ? 0 : i + 1));
        setFadeState("in");
      }, fadeMs);
    }, cycleMs);

    return () => clearInterval(timer);
  }, [locations, config.displayDuration]);

  /**
   * Resolve currently active location data
   */
  const currentLocation = locations[currentLocationIndex];
  const currentData = currentLocation
    ? weatherData.get(currentLocation.id)
    : null;

  const currentWeather = currentData?.currentWeather || null;
  const forecast = currentData?.forecast || [];

  /**
   * HARD GUARD:
   * Do not render any layout unless valid weather data exists.
   * Layouts must NEVER handle null or fake data.
   */
  if (!currentWeather) {
    return (
      <div
        className={`weather-app-container weather-app--${aspectRatio} weather-app--fade-${fadeState} ${
          theme === "dark" ? "weather-app-container--dark" : ""
        }`}
      >
        <div className="weather-widget__loading">Loading…</div>
      </div>
    );
  }

  /**
   * Common props passed to all layouts
   */
  const commonProps = {
    currentWeather,
    forecast,
    locationName: currentLocation?.displayName || currentLocation?.city,
    timeFormat: (config.timeFormat || "12h") as "12h" | "24h",
    forecastType: (config.forecastType || "daily") as "hourly" | "daily",
  };

  /**
   * Layout selection based on detected aspect ratio
   * Ordered by CSS variable definition
   */
  return (
    <div
      className={`weather-app-container weather-app--${aspectRatio} weather-app--fade-${fadeState} ${
        theme === "dark" ? "weather-app-container--dark" : ""
      }`}
    >
      {aspectRatio === ASPECT_RATIOS.SQUARE_1x1 && (
        <Layout1x1
          {...commonProps}
          variant={config.layout1x1Variant || "location"}
        />
      )}
      {aspectRatio === ASPECT_RATIOS.FULL_SCREEN_16x9 && (
        <Layout16x9 {...commonProps} />
      )}
      {aspectRatio === ASPECT_RATIOS.SHORT_LONG_3x1 && (
        <Layout3x1
          {...commonProps}
          variant={config.layout3x1Variant || "weather-text"}
        />
      )}
      {aspectRatio === ASPECT_RATIOS.SUPER_WIDE_10x1 && (
        <Layout10x1
          {...commonProps}
          variant={config.layout10x1Variant || "current-condition-only"}
        />
      )}
      {aspectRatio === ASPECT_RATIOS.FULL_SCREEN_9x16 && (
        <Layout9x16 {...commonProps} />
      )}
      {aspectRatio === ASPECT_RATIOS.LARGE_4x5 && (
        <Layout4x5 {...commonProps} />
      )}
      {aspectRatio === ASPECT_RATIOS.TALL_SHORT_1x3 && (
        <Layout1x3 {...commonProps} />
      )}
      {aspectRatio === ASPECT_RATIOS.SUPER_TALL_1x10 && (
        <Layout1x10 {...commonProps} />
      )}
    </div>
  );
}
