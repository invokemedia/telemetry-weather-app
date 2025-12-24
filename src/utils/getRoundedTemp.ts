// Rounds temperature to nearest whole number, returns undefined if value is null/undefined
export function getRoundedTemp(value?: number | null): number | undefined {
  if (value == null) return undefined;
  return Math.round(value);
}
