interface SettingsNoteProps {
  children: React.ReactNode;
}

export default function SettingsNote({ children }: SettingsNoteProps) {
  return (
    <div
      style={{
        color: "#666",
        fontSize: "0.875rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </div>
  );
}
