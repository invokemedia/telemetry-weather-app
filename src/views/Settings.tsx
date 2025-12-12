import "./Settings.css";

import { useEffect, useState } from "react";
import { store, weather } from "@telemetryos/sdk";
import type { WeatherConfig, Location } from "@/types/weather";

export function Settings() {
  // State: List of weather locations, display duration, theme, and input for adding new city
  const [locations, setLocations] = useState<Location[]>([]);
  const [displayDuration, setDisplayDuration] = useState(10);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [newCity, setNewCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [durationError, setDurationError] = useState("");
  const [displayNameErrors, setDisplayNameErrors] = useState<
    Record<string, string>
  >({});
  const [addingLocation, setAddingLocation] = useState(false);
  const [addLocationError, setAddLocationError] = useState("");

  // Load saved config from storage on mount, or create default config
  useEffect(() => {
    store()
      .instance.get<WeatherConfig>("config")
      .then((config) => {
        if (config?.locations && config.locations.length > 0) {
          setLocations(config.locations);
          setDisplayDuration(config.displayDuration || 10);
          setTheme(config.theme || "light");
        } else {
          const defaultLocation: Location = {
            id: Date.now().toString(),
            city: "Vancouver",
            displayName: "Vancouver",
          };
          const defaultConfig: WeatherConfig = {
            locations: [defaultLocation],
            displayDuration: 10,
            showForecast: true,
            theme: "light",
          };
          store().instance.set("config", defaultConfig).catch(console.error);
          setLocations([defaultLocation]);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  // Save config to instance storage (syncs to Render component)
  const saveConfig = (
    newLocations: Location[],
    newDuration?: number,
    newTheme?: "light" | "dark"
  ) => {
    const config: WeatherConfig = {
      locations: newLocations,
      displayDuration: newDuration ?? displayDuration,
      showForecast: true,
      theme: newTheme ?? theme,
    };
    store().instance.set("config", config).catch(console.error);
  };

  // Add a new location to the list (max 5) - validate city exists first
  const handleAddLocation = async () => {
    if (!newCity.trim()) return;

    setAddingLocation(true);
    setAddLocationError("");

    try {
      // Test if the city exists by fetching weather data
      const cityName = newCity.trim();
      await weather().getConditions({
        city: cityName,
        units: "metric",
      });

      // If successful, add the location
      const location: Location = {
        id: Date.now().toString(),
        city: cityName,
        displayName: cityName,
      };

      const updatedLocations = [...locations, location];
      setLocations(updatedLocations);
      saveConfig(updatedLocations);
      setNewCity("");
    } catch (error) {
      // City not found or API error
      setAddLocationError(
        `Could not find weather data for "${newCity.trim()}". Please check the city name.`
      );
    } finally {
      setAddingLocation(false);
    }
  };

  // Remove a location from the list (min 1)
  const handleRemoveLocation = (id: string) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    saveConfig(updatedLocations);
  };

  // Validate display name
  const validateDisplayName = (name: string): string => {
    const trimmedName = name.trim();
    const MAX_LENGTH = 25;

    if (trimmedName.length === 0) {
      return "Display name cannot be empty";
    }
    if (trimmedName.length > MAX_LENGTH) {
      return `Display name must be ${MAX_LENGTH} characters or less`;
    }
    return "";
  };

  // Update the custom display name for a location
  const handleUpdateDisplayName = (id: string, newDisplayName: string) => {
    // Validate the display name
    const error = validateDisplayName(newDisplayName);

    // Update error state
    setDisplayNameErrors((prev) => {
      if (error) {
        return { ...prev, [id]: error };
      } else {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
    });

    // Update location state regardless (allows user to type)
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, displayName: newDisplayName } : loc
    );
    setLocations(updatedLocations);

    // Only save to config if valid
    if (!error) {
      saveConfig(updatedLocations);
    }
  };

  // Update how long each location displays on screen (5-60 seconds)
  const handleDurationChange = (newDuration: number) => {
    setDisplayDuration(newDuration);

    // Validate range: 5-60 seconds
    if (newDuration < 5 || newDuration > 60) {
      setDurationError("Display duration must be between 5 and 60 seconds");
      return;
    }

    setDurationError("");
    saveConfig(locations, newDuration);
  };

  // Toggle between light and dark theme
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    saveConfig(locations, displayDuration, newTheme);
  };

  // Reorder locations (controls rotation sequence on device)
  const moveLocation = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= locations.length) return;

    const updatedLocations = [...locations];
    [updatedLocations[index], updatedLocations[newIndex]] = [
      updatedLocations[newIndex],
      updatedLocations[index],
    ];

    setLocations(updatedLocations);
    saveConfig(updatedLocations);
  };

  return (
    <div className="settings">
      <div className="settings__section">
        <h3 className="settings__section-title">Locations</h3>

        {/* Add new location */}
        <div className="settings__field">
          <div className="settings__label">Add location (up to 5)</div>
          <div className="settings__input-group">
            <input
              className={`settings__input ${
                addLocationError ? "settings__input--error" : ""
              }`}
              type="text"
              value={newCity}
              onChange={(e) => {
                setNewCity(e.target.value);
                setAddLocationError(""); // Clear error when user types
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
              placeholder="Enter city name (e.g., Vancouver)"
              disabled={isLoading || locations.length >= 5 || addingLocation}
            />
            <button
              className="settings__button settings__button--add"
              onClick={handleAddLocation}
              disabled={
                isLoading ||
                !newCity.trim() ||
                locations.length >= 5 ||
                addingLocation
              }
              title={
                locations.length >= 5
                  ? "Maximum 5 locations allowed"
                  : "Add location"
              }
            >
              {addingLocation ? "..." : "+"}
            </button>
          </div>
          {addLocationError && (
            <div className="settings__error settings__error--small">
              {addLocationError}
            </div>
          )}
        </div>
        {locations.length >= 5 && (
          <div className="settings__info">Maximum of 5 locations reached</div>
        )}

        {/* Location list */}
        <div className="settings__locations">
          {locations.map((location, index) => (
            <div key={location.id} className="settings__location-item">
              <div className="settings__location-controls">
                <button
                  className="settings__button settings__button--small"
                  onClick={() => moveLocation(index, "up")}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="settings__button settings__button--small"
                  onClick={() => moveLocation(index, "down")}
                  disabled={index === locations.length - 1}
                >
                  ↓
                </button>
              </div>
              <div className="settings__location-info">
                <div className="settings__location-city-label">
                  {location.city}
                </div>
                <input
                  className={`settings__input settings__input--small ${
                    displayNameErrors[location.id]
                      ? "settings__input--error"
                      : ""
                  }`}
                  type="text"
                  value={location.displayName || ""}
                  onChange={(e) =>
                    handleUpdateDisplayName(location.id, e.target.value)
                  }
                  placeholder="Display name"
                />
                {displayNameErrors[location.id] && (
                  <div className="settings__error settings__error--small">
                    {displayNameErrors[location.id]}
                  </div>
                )}
              </div>
              <button
                className="settings__button settings__button--remove"
                onClick={() => handleRemoveLocation(location.id)}
                disabled={locations.length === 1}
                title="Remove location"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="settings__section">
        <h3 className="settings__section-title">Display Options</h3>

        <div className="settings__field">
          <div className="settings__label">
            Display Duration (5-60 seconds per location)
          </div>
          <input
            className="settings__input"
            type="number"
            min="5"
            max="60"
            value={displayDuration}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
            disabled={isLoading || locations.length <= 1}
          />
          {durationError && (
            <div className="settings__error">{durationError}</div>
          )}
        </div>

        <div className="settings__field">
          <div className="settings__label">Theme</div>
          <div className="settings__theme-toggle">
            <button
              className={`settings__theme-button ${
                theme === "light" ? "settings__theme-button--active" : ""
              }`}
              onClick={() => handleThemeChange("light")}
              disabled={isLoading}
            >
              ☀️ Light
            </button>
            <button
              className={`settings__theme-button ${
                theme === "dark" ? "settings__theme-button--active" : ""
              }`}
              onClick={() => handleThemeChange("dark")}
              disabled={isLoading}
            >
              🌙 Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
