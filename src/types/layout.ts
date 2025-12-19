// Supported aspect ratio layouts (grouped by orientation)
export const ASPECT_RATIOS = {
  // Square layout
  SQUARE_1x1: "1x1",

  // Horizontal layouts
  FULL_SCREEN_16x9: "16x9",
  SHORT_LONG_3x1: "3x1",
  SUPER_WIDE_10x1: "10x1",

  // Vertical layouts
  FULL_SCREEN_9x16: "9x16",
  LARGE_4x5: "4x5",
  TALL_SHORT_1x3: "1x3",
  SUPER_TALL_1x10: "1x10",
} as const;

// Type derived from the constant values
export type AspectRatioType =
  (typeof ASPECT_RATIOS)[keyof typeof ASPECT_RATIOS];

// Aspect ratio numerical values (for auto-detection)
export const ASPECT_RATIO_VALUES: Record<AspectRatioType, number> = {
  // Square layout
  "1x1": 1 / 1,

  // Horizontal layouts
  "16x9": 16 / 9,
  "3x1": 3 / 1,
  "10x1": 10 / 1,

  // Vertical layouts
  "9x16": 9 / 16,
  "4x5": 4 / 5,
  "1x3": 1 / 3,
  "1x10": 1 / 10,
};

// Layout patterns available for each aspect ratio
export const LAYOUT_PATTERNS = {
  "16x9": ["full", "with-forecast"],
  "9x16": ["centered", "with-forecast"],
  "10x1": ["time-weather", "time-weather-forecast"],
  "1x10": ["vertical-stack", "vertical-forecast"],
  "1x1": ["with-location", "minimal"],
  "3x1": ["time-left", "time-left-high-low"],
  "1x3": ["vertical-list"],
  "4x5": ["centered-large"],
} as const;

export type LayoutPattern<T extends AspectRatioType> =
  T extends keyof typeof LAYOUT_PATTERNS
    ? (typeof LAYOUT_PATTERNS)[T][number]
    : string;
