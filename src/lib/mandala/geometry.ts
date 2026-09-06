import type { RingGeometry } from "@/types/mandala";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface RingRadiiParams {
  ringCount: number;
  /** Normalized 0..1 spacing control ("small" .. "large" gap between rings). */
  ringSpacing: number;
  minRadius: number;
  maxRadius: number;
}

/**
 * The floor a ring's step can shrink to at ringSpacing=0. Keeping this above
 * zero (rather than letting rings collapse on top of each other) keeps the
 * densest setting still legible, while ringSpacing=1 spreads rings across the
 * full available radius — so the whole mandala always stays within
 * [minRadius, maxRadius] no matter what the user picks.
 */
const MIN_STEP_RATIO = 0.4;

/** Portion of each ring's radial step given to the decorative band itself
 * (the remainder becomes the visual gap to the next ring). */
const THICKNESS_RATIO = 0.62;

/**
 * Computes the centerline radius, band thickness, and inner/outer bounds for
 * every ring, purely from center-relative inputs. Never hardcodes pixel
 * positions — everything derives from ringCount, ringSpacing, and the
 * min/max radius the canvas has available.
 */
export function calculateRingRadii({
  ringCount,
  ringSpacing,
  minRadius,
  maxRadius,
}: RingRadiiParams): RingGeometry[] {
  if (ringCount <= 0 || maxRadius <= minRadius) return [];

  const available = maxRadius - minRadius;
  const maxStep = available / ringCount;
  const minStep = maxStep * MIN_STEP_RATIO;
  const step = minStep + (maxStep - minStep) * clamp(ringSpacing, 0, 1);
  const thickness = step * THICKNESS_RATIO;

  const rings: RingGeometry[] = [];
  for (let index = 0; index < ringCount; index++) {
    const radius = minRadius + step * (index + 0.5);
    rings.push({
      index,
      radius,
      thickness,
      innerRadius: radius - thickness / 2,
      outerRadius: radius + thickness / 2,
    });
  }
  return rings;
}

/** Clamps the shared rotational-symmetry control to a sane repetition count. */
export function calculatePatternCount(symmetry: number): number {
  return Math.max(3, Math.round(symmetry));
}

/**
 * Derives how large a single motif should be drawn so that `count` evenly
 * spaced repetitions fill the ring's circumference without overlapping or
 * looking sparse — i.e. patternWidth = circumference / count, capped by the
 * ring's radial thickness so tall motifs don't bleed into neighboring rings.
 */
export function calculateMotifSize(ring: RingGeometry, count: number): number {
  const circumference = 2 * Math.PI * ring.radius;
  const arcLength = circumference / count;
  return Math.max(2, Math.min(arcLength * 0.86, ring.thickness * 1.5));
}
