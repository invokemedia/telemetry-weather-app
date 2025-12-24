interface SettingsMessageProps {
  variant?: "info" | "error" | "warning" | "success";
  children: React.ReactNode;
}

const variantConfig = {
  info: {
    icon: "ℹ️",
    color: "#666",
  },
  error: {
    icon: "❌",
    color: "#ff4444",
  },
  warning: {
    icon: "⚠️",
    color: "#ff9800",
  },
  success: {
    icon: "✅",
    color: "#4caf50",
  },
};

export default function SettingsMessage({
  variant = "info",
  children,
}: SettingsMessageProps) {
  const config = variantConfig[variant];

  return (
    <div
      style={{
        color: config.color,
        fontSize: "0.875rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          lineHeight: 1,
          marginTop: "0.1rem",
        }}
      >
        {config.icon}
      </span>
      <span>{children}</span>
    </div>
  );
}
