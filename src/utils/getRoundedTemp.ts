export function getRoundedTemp(value?: number | null): number | undefined {
  if (value == null) return undefined;
  return Math.round(value);
}
