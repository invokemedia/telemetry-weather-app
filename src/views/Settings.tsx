import "./Settings.css";

import { useEffect, useState } from "react";
import { store } from "@telemetryos/sdk";
import type { WeatherConfig, Location } from "@/types/weather";

export function Settings() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [displayDuration, setDisplayDuration] = useState(10);
  const [newCity, setNewCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    store()
      .instance.get<WeatherConfig>("config")
      .then((config) => {
        if (config?.locations && config.locations.length > 0) {
          setLocations(config.locations);
          setDisplayDuration(config.displayDuration || 10);
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
          };
          store().instance.set("config", defaultConfig).catch(console.error);
          setLocations([defaultLocation]);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const saveConfig = (newLocations: Location[], newDuration?: number) => {
    const config: WeatherConfig = {
      locations: newLocations,
      displayDuration: newDuration ?? displayDuration,
      showForecast: true,
    };
    store().instance.set("config", config).catch(console.error);
  };

  const handleAddLocation = () => {
    if (!newCity.trim()) return;

    const location: Location = {
      id: Date.now().toString(),
      city: newCity.trim(),
      displayName: newCity.trim(),
    };

    const updatedLocations = [...locations, location];
    setLocations(updatedLocations);
    saveConfig(updatedLocations);
    setNewCity("");
  };

  const handleRemoveLocation = (id: string) => {
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    saveConfig(updatedLocations);
  };

  const handleUpdateDisplayName = (id: string, newDisplayName: string) => {
    const updatedLocations = locations.map((loc) =>
      loc.id === id ? { ...loc, displayName: newDisplayName } : loc
    );
    setLocations(updatedLocations);
    saveConfig(updatedLocations);
  };

  const handleDurationChange = (newDuration: number) => {
    setDisplayDuration(newDuration);
    saveConfig(locations, newDuration);
  };

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
        <div className="settings__field settings__field--horizontal">
          <input
            className="settings__input"
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
            placeholder="Enter city name (e.g., Vancouver)"
            disabled={isLoading}
          />
          <button
            className="settings__button settings__button--add"
            onClick={handleAddLocation}
            disabled={isLoading || !newCity.trim()}
          >
            +
          </button>
        </div>

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
                <input
                  className="settings__input settings__input--small"
                  type="text"
                  value={location.displayName || location.city}
                  onChange={(e) =>
                    handleUpdateDisplayName(location.id, e.target.value)
                  }
                  placeholder="Display name"
                />
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
        </div>
      </div>
    </div>
  );
}
