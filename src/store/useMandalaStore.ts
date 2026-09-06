import { create } from "zustand";
import type { MandalaConfig, RingPatternValue } from "@/types/mandala";
import { clamp } from "@/lib/mandala/geometry";

const MIN_RINGS = 1;
const MAX_RINGS = 12;

/** An attractive out-of-the-box design (see spec §24) so the app explains
 * itself the moment it loads, without the user touching a single control. */
const DEFAULT_RING_PATTERNS: RingPatternValue[] = [
  "petals",
  "dots",
  "leaves",
  "diamonds",
  "scallops",
  "stars",
];

export const DEFAULT_CONFIG: MandalaConfig = {
  ringCount: 6,
  ringSpacing: 0.55,
  symmetry: 12,
  ringPatterns: [...DEFAULT_RING_PATTERNS],
  ringColors: new Array(6).fill(null),
  patternColor: "#1f2937",
  backgroundColor: "#ffffff",
};

function resizeRingPatterns(count: number, previous: RingPatternValue[]): RingPatternValue[] {
  return Array.from({ length: count }, (_, i) => previous[i] ?? DEFAULT_RING_PATTERNS[i % DEFAULT_RING_PATTERNS.length]);
}

function resizeRingColors(count: number, previous: Array<string | null>): Array<string | null> {
  return Array.from({ length: count }, (_, i) => previous[i] ?? null);
}

interface MandalaState extends MandalaConfig {
  /** UI-only: which ring the pattern library currently applies to. Not part of the serializable config. */
  selectedRing: number;

  setRingCount: (count: number) => void;
  setRingSpacing: (spacing: number) => void;
  setSymmetry: (symmetry: number) => void;
  setRingPattern: (ring: number, pattern: RingPatternValue) => void;
  setRingColor: (ring: number, color: string | null) => void;
  setPatternColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setSelectedRing: (ring: number) => void;
  applyPalette: (patternColor: string, backgroundColor: string) => void;
  reset: () => void;
  clearPatterns: () => void;
  getConfig: () => MandalaConfig;
}

export const RING_COUNT_RANGE = { min: MIN_RINGS, max: MAX_RINGS };

export const useMandalaStore = create<MandalaState>((set, get) => ({
  ...DEFAULT_CONFIG,
  selectedRing: 0,

  setRingCount: (count) =>
    set((state) => {
      const ringCount = clamp(Math.round(count), MIN_RINGS, MAX_RINGS);
      return {
        ringCount,
        ringPatterns: resizeRingPatterns(ringCount, state.ringPatterns),
        ringColors: resizeRingColors(ringCount, state.ringColors),
        selectedRing: Math.min(state.selectedRing, ringCount - 1),
      };
    }),

  setRingSpacing: (spacing) => set({ ringSpacing: clamp(spacing, 0, 1) }),

  setSymmetry: (symmetry) => set({ symmetry: clamp(Math.round(symmetry), 4, 36) }),

  setRingPattern: (ring, pattern) =>
    set((state) => {
      if (ring < 0 || ring >= state.ringPatterns.length) return state;
      const ringPatterns = [...state.ringPatterns];
      ringPatterns[ring] = pattern;
      return { ringPatterns };
    }),

  setRingColor: (ring, color) =>
    set((state) => {
      if (ring < 0 || ring >= state.ringColors.length) return state;
      const ringColors = [...state.ringColors];
      ringColors[ring] = color;
      return { ringColors };
    }),

  setPatternColor: (patternColor) => set({ patternColor }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setSelectedRing: (ring) => set({ selectedRing: clamp(ring, 0, get().ringCount - 1) }),
  applyPalette: (patternColor, backgroundColor) => set({ patternColor, backgroundColor }),

  reset: () =>
    set({
      ...DEFAULT_CONFIG,
      ringPatterns: [...DEFAULT_CONFIG.ringPatterns],
      ringColors: [...DEFAULT_CONFIG.ringColors],
      selectedRing: 0,
    }),

  clearPatterns: () =>
    set((state) => ({
      ringPatterns: state.ringPatterns.map(() => "none" as RingPatternValue),
    })),

  getConfig: () => {
    const state = get();
    return {
      ringCount: state.ringCount,
      ringSpacing: state.ringSpacing,
      symmetry: state.symmetry,
      ringPatterns: state.ringPatterns,
      ringColors: state.ringColors,
      patternColor: state.patternColor,
      backgroundColor: state.backgroundColor,
    };
  },
}));
