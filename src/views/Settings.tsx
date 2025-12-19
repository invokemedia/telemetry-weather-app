import { useState } from "react";
import { weather } from "@telemetryos/sdk";
import {
  SettingsContainer,
  SettingsBox,
  SettingsDivider,
  SettingsField,
  SettingsLabel,
  SettingsInputFrame,
  SettingsButtonFrame,
  SettingsSliderFrame,
  SettingsRadioFrame,
  SettingsRadioLabel,
  SettingsCheckboxFrame,
  SettingsCheckboxLabel,
  SettingsSelectFrame,
} from "@telemetryos/sdk/react";
import { useWeatherConfigState } from "@/hooks/store";
import type { Location } from "@/types/weather";
import { LAYOUT_PATTERNS } from "@/types/layout";

export function Settings() {
  // Use SDK hook for config state - automatically syncs with Render
  const [isLoadingConfig, config, setConfig] = useWeatherConfigState();

  // Local state for form inputs and validation
  const [newCity, setNewCity] = useState("");
  const [displayNameErrors, setDisplayNameErrors] = useState<
    Record<string, string>
  >({});
  const [addingLocation, setAddingLocation] = useState(false);
  const [addLocationError, setAddLocationError] = useState("");

  const locations = config.locations || [];
  const displayDuration = config.displayDuration || 10;
  const forecastType = config.forecastType || "daily";
  const theme = config.theme || "light";
  const textColor = config.textColor || "#ffffff";
  const textOpacity = config.textOpacity ?? 100;
  const accentColor = config.accentColor || "#ffffff";
  const accentOpacity = config.accentOpacity ?? 68;

  // Update config helper
  const updateConfig = (updates: Partial<typeof config>) => {
    setConfig({ ...config, ...updates });
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
      updateConfig({ locations: updatedLocations });
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
    const updatedLocations = locations.filter((loc: Location) => loc.id !== id);
    updateConfig({ locations: updatedLocations });
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
    const updatedLocations = locations.map((loc: Location) =>
      loc.id === id ? { ...loc, displayName: newDisplayName } : loc
    );

    // Only save to config if valid
    if (!error) {
      updateConfig({ locations: updatedLocations });
    } else {
      // Still update local state for immediate feedback
      setConfig({ ...config, locations: updatedLocations });
    }
  };

  // Toggle between light and dark theme
  const handleThemeChange = (newTheme: "light" | "dark") => {
    updateConfig({ theme: newTheme });
  };

  // Update text color
  const handleTextColorChange = (newColor: string) => {
    updateConfig({ textColor: newColor });
  };

  // Update accent color
  const handleAccentColorChange = (newColor: string) => {
    updateConfig({ accentColor: newColor });
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

    updateConfig({ locations: updatedLocations });
  };

  return (
    <SettingsContainer>
      <SettingsBox>
        <h3 style={{ margin: "0 0 1rem 0" }}>Locations</h3>

        {/* Add new location */}
        <SettingsField>
          <SettingsLabel>Add location (up to 5)</SettingsLabel>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <SettingsInputFrame>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => {
                    setNewCity(e.target.value);
                    setAddLocationError(""); // Clear error when user types
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
                  placeholder="Enter city name (e.g., Vancouver)"
                  disabled={
                    isLoadingConfig || locations.length >= 5 || addingLocation
                  }
                  style={{
                    border: addLocationError ? "1px solid #ff4444" : undefined,
                  }}
                />
              </SettingsInputFrame>
            </div>
            <SettingsButtonFrame>
              <button
                onClick={handleAddLocation}
                disabled={
                  isLoadingConfig ||
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
            </SettingsButtonFrame>
          </div>
          {addLocationError && (
            <div
              style={{
                color: "#ff4444",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {addLocationError}
            </div>
          )}
          {locations.length >= 5 && (
            <div
              style={{
                color: "#666",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              Maximum of 5 locations reached
            </div>
          )}
        </SettingsField>

        {/* Location list */}
        {locations.map((location: Location, index: number) => (
          <div
            key={location.id}
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-start",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <SettingsButtonFrame>
                <button
                  onClick={() => moveLocation(index, "up")}
                  disabled={index === 0}
                  style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                >
                  ↑
                </button>
              </SettingsButtonFrame>
              <SettingsButtonFrame>
                <button
                  onClick={() => moveLocation(index, "down")}
                  disabled={index === locations.length - 1}
                  style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                >
                  ↓
                </button>
              </SettingsButtonFrame>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                {location.city}
              </div>
              <SettingsInputFrame>
                <input
                  type="text"
                  value={location.displayName || ""}
                  onChange={(e) =>
                    handleUpdateDisplayName(location.id, e.target.value)
                  }
                  placeholder="Display name"
                  style={{
                    border: displayNameErrors[location.id]
                      ? "1px solid #ff4444"
                      : undefined,
                  }}
                />
              </SettingsInputFrame>
              {displayNameErrors[location.id] && (
                <div
                  style={{
                    color: "#ff4444",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {displayNameErrors[location.id]}
                </div>
              )}
            </div>
            <SettingsButtonFrame>
              <button
                onClick={() => handleRemoveLocation(location.id)}
                disabled={locations.length === 1}
                title="Remove location"
                style={{ padding: "0.5rem 0.75rem" }}
              >
                ×
              </button>
            </SettingsButtonFrame>
          </div>
        ))}
      </SettingsBox>

      <SettingsDivider />

      <SettingsBox>
        <h3 style={{ margin: "0 0 1rem 0" }}>Display Options</h3>

        <SettingsField>
          <SettingsLabel>
            Display Duration: {displayDuration} seconds
          </SettingsLabel>
          <SettingsSliderFrame>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={displayDuration}
              onChange={(e) =>
                updateConfig({ displayDuration: Number(e.target.value) })
              }
              disabled={isLoadingConfig || locations.length <= 1}
              style={{
                pointerEvents:
                  isLoadingConfig || locations.length <= 1 ? "none" : "auto",
                opacity: isLoadingConfig || locations.length <= 1 ? 0.5 : 1,
              }}
            />
            <span>{displayDuration}s</span>
          </SettingsSliderFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Forecast Type</SettingsLabel>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="forecastType"
              value="daily"
              checked={forecastType === "daily"}
              onChange={(e) =>
                updateConfig({
                  forecastType: e.target.value as "hourly" | "daily",
                })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>📅 Daily (6 days)</SettingsRadioLabel>
          </SettingsRadioFrame>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="forecastType"
              value="hourly"
              checked={forecastType === "hourly"}
              onChange={(e) =>
                updateConfig({
                  forecastType: e.target.value as "hourly" | "daily",
                })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>🕐 Hourly (today)</SettingsRadioLabel>
          </SettingsRadioFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Time Format</SettingsLabel>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="timeFormat"
              value="12h"
              checked={(config.timeFormat || "12h") === "12h"}
              onChange={(e) =>
                updateConfig({ timeFormat: e.target.value as "12h" | "24h" })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>12-hour (AM/PM)</SettingsRadioLabel>
          </SettingsRadioFrame>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="timeFormat"
              value="24h"
              checked={config.timeFormat === "24h"}
              onChange={(e) =>
                updateConfig({ timeFormat: e.target.value as "12h" | "24h" })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>24-hour</SettingsRadioLabel>
          </SettingsRadioFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Theme</SettingsLabel>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={(e) =>
                handleThemeChange(e.target.value as "light" | "dark")
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>☀️ Light</SettingsRadioLabel>
          </SettingsRadioFrame>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={(e) =>
                handleThemeChange(e.target.value as "light" | "dark")
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>🌙 Dark</SettingsRadioLabel>
          </SettingsRadioFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Text Color</SettingsLabel>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleTextColorChange(e.target.value)}
              disabled={isLoadingConfig}
              style={{ width: "60px", height: "38px", cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <SettingsInputFrame>
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  placeholder="#ffffff"
                  disabled={isLoadingConfig}
                />
              </SettingsInputFrame>
            </div>
          </div>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Text Opacity: {textOpacity}%</SettingsLabel>
          <SettingsSliderFrame>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={textOpacity}
              onChange={(e) =>
                updateConfig({ textOpacity: Number(e.target.value) })
              }
              disabled={isLoadingConfig}
            />
            <span>{textOpacity}%</span>
          </SettingsSliderFrame>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Accent Color</SettingsLabel>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => handleAccentColorChange(e.target.value)}
              disabled={isLoadingConfig}
              style={{ width: "60px", height: "38px", cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <SettingsInputFrame>
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => handleAccentColorChange(e.target.value)}
                  placeholder="#ffffff"
                  disabled={isLoadingConfig}
                />
              </SettingsInputFrame>
            </div>
          </div>
        </SettingsField>

        <SettingsField>
          <SettingsLabel>Accent Opacity: {accentOpacity}%</SettingsLabel>
          <SettingsSliderFrame>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={accentOpacity}
              onChange={(e) =>
                updateConfig({ accentOpacity: Number(e.target.value) })
              }
              disabled={isLoadingConfig}
            />
            <span>{accentOpacity}%</span>
          </SettingsSliderFrame>
        </SettingsField>
      </SettingsBox>
    </SettingsContainer>
  );
}
