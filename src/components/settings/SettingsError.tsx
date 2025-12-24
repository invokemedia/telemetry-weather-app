interface SettingsErrorProps {
  children: React.ReactNode;
}

export default function SettingsError({ children }: SettingsErrorProps) {
  return (
    <div
      style={{
        color: "#ff4444",
        fontSize: "0.875rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </div>
  );
}
