import type { MandalaConfig, PatternType, RingConfig } from "@/types/mandala";
import { PATTERNS } from "./patterns";

export interface Palette {
  name: string;
  pattern: string;
  background: string;
}

export const PALETTES: readonly Palette[] = [
  { name: "Chalk", pattern: "#f5f1e8", background: "#1c1c1c" },
  { name: "Classic", pattern: "#1f2937", background: "#ffffff" },
  { name: "Indigo Night", pattern: "#e0e7ff", background: "#1e1b4b" },
  { name: "Sunset", pattern: "#7c2d12", background: "#fed7aa" },
  { name: "Forest", pattern: "#f0fdf4", background: "#14532d" },
  { name: "Rose Gold", pattern: "#881337", background: "#ffe4e6" },
];

function ring(pattern: PatternType, options: Partial<Omit<RingConfig, "pattern">> = {}): RingConfig {
  return { pattern, color: null, filled: false, weight: 1, ...options };
}

export interface MandalaPreset {
  id: string;
  name: string;
  config: MandalaConfig;
}

/** Deep-ish copy so store mutations (which are immutable anyway) can never alias a shared preset. */
export function cloneConfig(config: MandalaConfig): MandalaConfig {
  return { ...config, rings: config.rings.map((r) => ({ ...r })) };
}

export const PRESETS: readonly MandalaPreset[] = [
  {
    // Modelled on a hand-inked ring mandala: tight bands of radial teeth,
    // notched blocks, scale arches and spirals around an empty center.
    id: "temple-ring",
    name: "Temple Ring",
    config: {
      ringCount: 8,
      ringSpacing: 0.08,
      symmetry: 8,
      density: 1,
      centerSize: 0.2,
      rings: [
        ring("teeth", { weight: 1.3 }),
        ring("scales", { filled: true }),
        ring("molars", { weight: 1.1 }),
        ring("spirals", { filled: true, weight: 0.9 }),
        ring("teeth", { weight: 1.3 }),
        ring("scales", { filled: true }),
        ring("molars", { weight: 1.1 }),
        ring("spirals", { filled: true, weight: 0.9 }),
      ],
      patternColor: PALETTES[0].pattern,
      backgroundColor: PALETTES[0].background,
    },
  },
  {
    id: "classic-bloom",
    name: "Classic Bloom",
    config: {
      ringCount: 6,
      ringSpacing: 0.55,
      symmetry: 12,
      density: 0.7,
      centerSize: 0.1,
      rings: [
        ring("petals"),
        ring("dots"),
        ring("leaves"),
        ring("diamonds"),
        ring("scallops"),
        ring("stars"),
      ],
      patternColor: PALETTES[1].pattern,
      backgroundColor: PALETTES[1].background,
    },
  },
  {
    id: "midnight-lace",
    name: "Midnight Lace",
    config: {
      ringCount: 7,
      ringSpacing: 0.15,
      symmetry: 6,
      density: 1,
      centerSize: 0.15,
      rings: [
        ring("petals"),
        ring("scales", { filled: true }),
        ring("triangles", { weight: 0.8 }),
        ring("spirals", { filled: true }),
        ring("waves", { weight: 0.7 }),
        ring("molars"),
        ring("teardrops", { weight: 1.2 }),
      ],
      patternColor: PALETTES[2].pattern,
      backgroundColor: PALETTES[2].background,
    },
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    config: {
      ringCount: 5,
      ringSpacing: 0.1,
      symmetry: 12,
      density: 1,
      centerSize: 0.25,
      rings: [
        ring("teeth", { weight: 1.4 }),
        ring("circles", { weight: 0.8 }),
        ring("triangles"),
        ring("scallops", { weight: 0.9 }),
        ring("teeth", { weight: 1.2 }),
      ],
      patternColor: PALETTES[3].pattern,
      backgroundColor: PALETTES[3].background,
    },
  },
];

export const DEFAULT_CONFIG: MandalaConfig = PRESETS[0].config;

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomBetween(min: number, max: number, decimals = 2): number {
  const value = min + Math.random() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** A random but structured design: adjacent rings never repeat a pattern, and line-art patterns default to knocked-out bands. */
export function generateRandomConfig(): MandalaConfig {
  const palette = pick(PALETTES);
  const ringCount = 6 + Math.floor(Math.random() * 5);

  const rings: RingConfig[] = [];
  let previous: PatternType | undefined;
  for (let i = 0; i < ringCount; i++) {
    const definition = pick(PATTERNS.filter((pattern) => pattern.id !== previous));
    previous = definition.id;
    rings.push(ring(definition.id, { filled: definition.preferFilled ?? false, weight: randomBetween(0.8, 1.5) }));
  }

  return {
    ringCount,
    ringSpacing: randomBetween(0.04, 0.3),
    symmetry: pick([6, 8, 12]),
    density: 1,
    centerSize: randomBetween(0.1, 0.25),
    rings,
    patternColor: palette.pattern,
    backgroundColor: palette.background,
  };
}
