interface SettingsTitleProps {
  children: React.ReactNode;
}

export default function SettingsTitle({ children }: SettingsTitleProps) {
  return <h3 style={{ margin: 0 }}>{children}</h3>;
}
