import { create } from "zustand";
import type { MandalaConfig, RingConfig, RingPatternValue } from "@/types/mandala";
import { clamp } from "@/lib/mandala/geometry";
import { DEFAULT_CONFIG, cloneConfig, generateRandomConfig } from "@/lib/mandala/presets";

const MIN_RINGS = 1;
const MAX_RINGS = 12;

export const RING_COUNT_RANGE = { min: MIN_RINGS, max: MAX_RINGS };
export const RING_WEIGHT_RANGE = { min: 0.4, max: 2.5 };

/** New rings (when the count grows) cycle through the default design's rings. */
function resizeRings(count: number, previous: RingConfig[]): RingConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const existing = previous[i];
    if (existing) return existing;
    return { ...DEFAULT_CONFIG.rings[i % DEFAULT_CONFIG.rings.length] };
  });
}

interface MandalaState extends MandalaConfig {
  /** UI-only: which ring the pattern library currently applies to. Not part of the serializable config. */
  selectedRing: number;

  setRingCount: (count: number) => void;
  setRingSpacing: (spacing: number) => void;
  setSymmetry: (symmetry: number) => void;
  setDensity: (density: number) => void;
  setCenterSize: (size: number) => void;
  setRingPattern: (ring: number, pattern: RingPatternValue) => void;
  setRingColor: (ring: number, color: string | null) => void;
  setRingFilled: (ring: number, filled: boolean) => void;
  setRingWeight: (ring: number, weight: number) => void;
  setPatternColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setSelectedRing: (ring: number) => void;
  applyPalette: (patternColor: string, backgroundColor: string) => void;
  loadConfig: (config: MandalaConfig) => void;
  randomize: () => void;
  reset: () => void;
  clearPatterns: () => void;
  getConfig: () => MandalaConfig;
}

export const useMandalaStore = create<MandalaState>((set, get) => {
  const updateRing = (ring: number, patch: Partial<RingConfig>) =>
    set((state) => {
      if (ring < 0 || ring >= state.rings.length) return state;
      return { rings: state.rings.map((r, i) => (i === ring ? { ...r, ...patch } : r)) };
    });

  return {
    ...cloneConfig(DEFAULT_CONFIG),
    selectedRing: 0,

    setRingCount: (count) =>
      set((state) => {
        const ringCount = clamp(Math.round(count), MIN_RINGS, MAX_RINGS);
        return {
          ringCount,
          rings: resizeRings(ringCount, state.rings),
          selectedRing: Math.min(state.selectedRing, ringCount - 1),
        };
      }),

    setRingSpacing: (spacing) => set({ ringSpacing: clamp(spacing, 0, 1) }),
    setSymmetry: (symmetry) => set({ symmetry: clamp(Math.round(symmetry), 4, 36) }),
    setDensity: (density) => set({ density: clamp(density, 0.5, 2) }),
    setCenterSize: (centerSize) => set({ centerSize: clamp(centerSize, 0, 0.6) }),

    setRingPattern: (ring, pattern) => updateRing(ring, { pattern }),
    setRingColor: (ring, color) => updateRing(ring, { color }),
    setRingFilled: (ring, filled) => updateRing(ring, { filled }),
    setRingWeight: (ring, weight) =>
      updateRing(ring, { weight: clamp(weight, RING_WEIGHT_RANGE.min, RING_WEIGHT_RANGE.max) }),

    setPatternColor: (patternColor) => set({ patternColor }),
    setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
    setSelectedRing: (ring) => set({ selectedRing: clamp(ring, 0, get().ringCount - 1) }),
    applyPalette: (patternColor, backgroundColor) => set({ patternColor, backgroundColor }),

    loadConfig: (config) => set({ ...cloneConfig(config), selectedRing: 0 }),
    randomize: () => set({ ...generateRandomConfig(), selectedRing: 0 }),
    reset: () => set({ ...cloneConfig(DEFAULT_CONFIG), selectedRing: 0 }),

    clearPatterns: () =>
      set((state) => ({
        rings: state.rings.map((r) => ({ ...r, pattern: "none" as const, filled: false })),
      })),

    getConfig: () => {
      const state = get();
      return {
        ringCount: state.ringCount,
        ringSpacing: state.ringSpacing,
        symmetry: state.symmetry,
        density: state.density,
        centerSize: state.centerSize,
        rings: state.rings,
        patternColor: state.patternColor,
        backgroundColor: state.backgroundColor,
      };
    },
  };
});
