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
import { LAYOUT_FEATURES, type AspectRatioType } from "@/types/layout";

export function Settings() {
  // Use SDK hook for config state - automatically syncs with Render
  const [isLoadingConfig, config, setConfig] = useWeatherConfigState();

  // Local state for form inputs and validation
  const [newCity, setNewCity] = useState("");
  const [searchType, setSearchType] = useState<"city" | "postalCode">("city");
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
  const layout1x1Variant = config.layout1x1Variant || "location";
  const layout10x1Variant =
    config.layout10x1Variant || "current-condition-only";
  const layout3x1Variant = config.layout3x1Variant || "weather-text";

  // Get current layout features (what settings are relevant)
  const currentAspectRatio = (config.currentAspectRatio ||
    "16x9") as AspectRatioType;
  const layoutFeatures = LAYOUT_FEATURES[currentAspectRatio];
  const showsForecast = layoutFeatures?.showsForecast ?? true;

  // Update config helper
  const updateConfig = (updates: Partial<typeof config>) => {
    setConfig({ ...config, ...updates });
  };

  // Add a new location to the list (max 5) - validate city/postal code exists first
  const handleAddLocation = async () => {
    if (!newCity.trim()) return;

    setAddingLocation(true);
    setAddLocationError("");

    try {
      const input = newCity.trim();

      // Fetch weather data using the explicitly selected search type
      const weatherData = await weather().getConditions(
        searchType === "postalCode"
          ? { postalCode: input, units: config.units || "imperial" }
          : { city: input, units: config.units || "imperial" }
      );

      // If successful, add the location with original input as display name
      const location: Location = {
        id: Date.now().toString(),
        ...(searchType === "postalCode"
          ? { postalCode: input }
          : { city: input }),
        cityEnglish: weatherData.CityEnglish,
        state: weatherData.State,
        displayName: input, // Keep the original input as the display name
      };

      const updatedLocations = [...locations, location];

      // If adding a second location and current variant is "current-condition-label",
      // force it back to "location" since the label variant doesn't show location names
      const updates: Partial<typeof config> = { locations: updatedLocations };
      if (
        updatedLocations.length > 1 &&
        layout1x1Variant === "current-condition-label"
      ) {
        updates.layout1x1Variant = "location";
      }

      // If adding a second location for 10x1 layout, force "current-condition-location"
      // since it's the only variant that shows location names
      if (
        updatedLocations.length > 1 &&
        (layout10x1Variant === "current-condition-only" ||
          layout10x1Variant === "current-condition-forecast")
      ) {
        updates.layout10x1Variant = "current-condition-location";
      }

      updateConfig(updates);
      setNewCity("");
    } catch (error) {
      // City/postal code not found or API error
      setAddLocationError(
        `Could not find weather data for "${newCity.trim()}". Please check the location.`
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
    const MAX_LENGTH = 50;

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

          {/* Search type selection */}
          <div style={{ marginBottom: "0.75rem" }}>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="searchType"
                value="city"
                checked={searchType === "city"}
                onChange={(e) =>
                  setSearchType(e.target.value as "city" | "postalCode")
                }
                disabled={isLoadingConfig || addingLocation}
              />
              <SettingsRadioLabel>
                🏙️ City Name (e.g., London, UK)
              </SettingsRadioLabel>
            </SettingsRadioFrame>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="searchType"
                value="postalCode"
                checked={searchType === "postalCode"}
                onChange={(e) =>
                  setSearchType(e.target.value as "city" | "postalCode")
                }
                disabled={isLoadingConfig || addingLocation}
              />
              <SettingsRadioLabel>
                📮 Postal Code (e.g., 10001, M5H 2N2)
              </SettingsRadioLabel>
            </SettingsRadioFrame>
          </div>

          {searchType === "city" && (
            <div
              style={{
                color: "#666",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Note: Specify the state name after a city name if needed. e.g.
              Springfield, IL
            </div>
          )}

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
                  placeholder={
                    searchType === "city"
                      ? "Enter city name (e.g., Vancouver, BC)"
                      : "Enter postal code (e.g., V6B 1A1)"
                  }
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
                {location.cityEnglish || location.city}
                {location.state && `, ${location.state}`}
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
          {locations.length <= 1 && (
            <div
              style={{
                color: "#666",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                fontStyle: "italic",
              }}
            >
              Note: Display duration only applies when multiple locations are
              configured.
            </div>
          )}
        </SettingsField>

        {(showsForecast ||
          (currentAspectRatio === "10x1" &&
            layout10x1Variant === "current-condition-forecast")) && (
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
              <SettingsRadioLabel>📅 Daily</SettingsRadioLabel>
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
              <SettingsRadioLabel>🕐 Hourly</SettingsRadioLabel>
            </SettingsRadioFrame>
          </SettingsField>
        )}

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
          <SettingsLabel>Temperature Units</SettingsLabel>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="units"
              value="imperial"
              checked={(config.units || "imperial") === "imperial"}
              onChange={(e) =>
                updateConfig({
                  units: e.target.value as "imperial" | "metric",
                })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>°F Fahrenheit</SettingsRadioLabel>
          </SettingsRadioFrame>
          <SettingsRadioFrame>
            <input
              type="radio"
              name="units"
              value="metric"
              checked={config.units === "metric"}
              onChange={(e) =>
                updateConfig({
                  units: e.target.value as "imperial" | "metric",
                })
              }
              disabled={isLoadingConfig}
            />
            <SettingsRadioLabel>°C Celsius</SettingsRadioLabel>
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

        {currentAspectRatio === "1x1" && (
          <SettingsField>
            <SettingsLabel>1×1 Layout Style</SettingsLabel>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout1x1Variant"
                value="location"
                checked={layout1x1Variant === "location"}
                onChange={(e) =>
                  updateConfig({
                    layout1x1Variant: e.target.value as
                      | "location"
                      | "current-condition-label",
                  })
                }
                disabled={isLoadingConfig}
              />
              <SettingsRadioLabel>📍 Location</SettingsRadioLabel>
            </SettingsRadioFrame>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout1x1Variant"
                value="current-condition-label"
                checked={layout1x1Variant === "current-condition-label"}
                onChange={(e) =>
                  updateConfig({
                    layout1x1Variant: e.target.value as
                      | "location"
                      | "current-condition-label",
                  })
                }
                disabled={isLoadingConfig || locations.length > 1}
              />
              <SettingsRadioLabel>
                🌤️ Current Condition Label
              </SettingsRadioLabel>
            </SettingsRadioFrame>
            {locations.length > 1 && (
              <div
                style={{
                  color: "#666",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                }}
              >
                Note: Current Condition Label style is only available with a
                single location since it doesn't display the location name.
              </div>
            )}
          </SettingsField>
        )}

        {currentAspectRatio === "3x1" && (
          <SettingsField>
            <SettingsLabel>3×1 Layout Variant</SettingsLabel>

            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout3x1Variant"
                value="weather-text"
                checked={layout3x1Variant === "weather-text"}
                onChange={(e) =>
                  updateConfig({
                    layout3x1Variant: e.target.value as
                      | "weather-text"
                      | "temp-range",
                  })
                }
                disabled={isLoadingConfig}
              />
              <SettingsRadioLabel>🌤️ Weather Text</SettingsRadioLabel>
            </SettingsRadioFrame>

            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout3x1Variant"
                value="temp-range"
                checked={layout3x1Variant === "temp-range"}
                onChange={(e) =>
                  updateConfig({
                    layout3x1Variant: e.target.value as
                      | "weather-text"
                      | "temp-range",
                  })
                }
                disabled={isLoadingConfig}
              />
              <SettingsRadioLabel>🌡️ Temp Range</SettingsRadioLabel>
            </SettingsRadioFrame>
          </SettingsField>
        )}

        {currentAspectRatio === "10x1" && (
          <SettingsField>
            <SettingsLabel>10×1 Layout Variant</SettingsLabel>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout10x1Variant"
                value="current-condition-only"
                checked={layout10x1Variant === "current-condition-only"}
                onChange={(e) =>
                  updateConfig({
                    layout10x1Variant: e.target.value as
                      | "current-condition-only"
                      | "current-condition-location"
                      | "current-condition-forecast",
                  })
                }
                disabled={isLoadingConfig || locations.length > 1}
              />
              <SettingsRadioLabel>Current Condition Only</SettingsRadioLabel>
            </SettingsRadioFrame>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout10x1Variant"
                value="current-condition-location"
                checked={layout10x1Variant === "current-condition-location"}
                onChange={(e) =>
                  updateConfig({
                    layout10x1Variant: e.target.value as
                      | "current-condition-only"
                      | "current-condition-location"
                      | "current-condition-forecast",
                  })
                }
                disabled={isLoadingConfig}
              />
              <SettingsRadioLabel>
                Current Condition + Location
              </SettingsRadioLabel>
            </SettingsRadioFrame>
            <SettingsRadioFrame>
              <input
                type="radio"
                name="layout10x1Variant"
                value="current-condition-forecast"
                checked={layout10x1Variant === "current-condition-forecast"}
                onChange={(e) =>
                  updateConfig({
                    layout10x1Variant: e.target.value as
                      | "current-condition-only"
                      | "current-condition-location"
                      | "current-condition-forecast",
                  })
                }
                disabled={isLoadingConfig || locations.length > 1}
              />
              <SettingsRadioLabel>
                Current Condition + Forecast
              </SettingsRadioLabel>
            </SettingsRadioFrame>
            {locations.length > 1 && (
              <div
                style={{
                  color: "#666",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                  fontStyle: "italic",
                }}
              >
                Note: Only the Current Condition + Location variant is available
                with multiple locations since it's the only one that displays
                location names.
              </div>
            )}
          </SettingsField>
        )}

        <SettingsField>
          <SettingsLabel>Primary Text Color</SettingsLabel>
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
          <SettingsLabel>
            Primary Text Color Opacity: {textOpacity}%
          </SettingsLabel>
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
          <SettingsLabel>Secondary Text Color</SettingsLabel>
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
          <SettingsLabel>
            Secondary Text Color Opacity: {accentOpacity}%
          </SettingsLabel>
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
