import { coordKey } from "./grid";
import { ElementDefinition } from "./types";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface CellInfluence {
  hasSelectInfluence: boolean;
  hasTextInfluence: boolean;
}

const SELECT_OFFSETS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const TEXT_INPUT_OFFSETS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function normalizeHex(hex: string) {
  const value = hex.trim().replace("#", "");

  if (value.length === 3) {
    return `#${value
      .split("")
      .map((symbol) => `${symbol}${symbol}`)
      .join("")}`.toUpperCase();
  }

  return `#${value}`.toUpperCase();
}

function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex).slice(1);

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function toHexPart(value: number) {
  return Math.round(value).toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(rgb: RgbColor) {
  return `#${toHexPart(rgb.r)}${toHexPart(rgb.g)}${toHexPart(rgb.b)}`;
}

function srgbToLinear(value: number) {
  const normalized = value / 255;

  if (normalized <= 0.04045) {
    return normalized / 12.92;
  }

  return Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function linearToSrgb(value: number) {
  if (value <= 0.0031308) {
    return value * 12.92 * 255;
  }

  return (1.055 * Math.pow(value, 1 / 2.4) - 0.055) * 255;
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(background: string, foreground: string) {
  const backgroundLuminance = relativeLuminance(background);
  const foregroundLuminance = relativeLuminance(foreground);
  const lighter = Math.max(backgroundLuminance, foregroundLuminance);
  const darker = Math.min(backgroundLuminance, foregroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibleTextColor(background: string) {
  const dark = "#111111";
  const light = "#FFFFFF";
  const darkRatio = getContrastRatio(background, dark);
  const lightRatio = getContrastRatio(background, light);

  return darkRatio >= lightRatio ? dark : light;
}

export function blendColors(colors: string[]) {
  if (colors.length === 0) {
    return "transparent";
  }

  if (colors.length === 1) {
    return normalizeHex(colors[0]);
  }

  const linear = colors.map((color) => {
    const rgb = hexToRgb(color);

    return {
      r: srgbToLinear(rgb.r),
      g: srgbToLinear(rgb.g),
      b: srgbToLinear(rgb.b),
    };
  });

  const average = linear.reduce(
    (accumulator, color) => ({
      r: accumulator.r + color.r / linear.length,
      g: accumulator.g + color.g / linear.length,
      b: accumulator.b + color.b / linear.length,
    }),
    { r: 0, g: 0, b: 0 }
  );

  return rgbToHex({
    r: linearToSrgb(average.r),
    g: linearToSrgb(average.g),
    b: linearToSrgb(average.b),
  });
}

export function getCellBackgrounds(
  elements: ElementDefinition[],
  selectColor: string,
  textInputColor: string
) {
  const influences = new Map<string, CellInfluence>();

  const markInfluence = (key: string, field: keyof CellInfluence) => {
    const current = influences.get(key) ?? {
      hasSelectInfluence: false,
      hasTextInfluence: false,
    };

    current[field] = true;
    influences.set(key, current);
  };

  elements.forEach((element) => {
    const offsets =
      element.type === "SELECT" ? SELECT_OFFSETS : TEXT_INPUT_OFFSETS;
    const field =
      element.type === "SELECT" ? "hasSelectInfluence" : "hasTextInfluence";

    offsets.forEach(([rowOffset, colOffset]) => {
      markInfluence(
        coordKey(element.row + rowOffset, element.col + colOffset),
        field
      );
    });
  });

  const backgrounds = new Map<string, string>();

  influences.forEach((influence, key) => {
    const colors: string[] = [];

    if (influence.hasSelectInfluence) {
      colors.push(selectColor);
    }

    if (influence.hasTextInfluence) {
      colors.push(textInputColor);
    }

    backgrounds.set(key, blendColors(colors));
  });

  return backgrounds;
}
