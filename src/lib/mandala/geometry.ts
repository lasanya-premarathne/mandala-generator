import type { MotifBox, RingGeometry } from "@/types/mandala";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface RingRadiiParams {
  ringCount: number;
  /** Normalized 0..1 spacing control: 0 = rings touch, 1 = widest gaps. */
  ringSpacing: number;
  minRadius: number;
  maxRadius: number;
  /** Relative radial width per ring (defaults to 1 each). */
  weights?: number[];
}

/** Largest share of a ring's radial step that can become empty gap. */
const MAX_GAP_RATIO = 0.7;

const MAX_REPETITIONS = 360;

/**
 * Splits the annulus [minRadius, maxRadius] into one radial step per ring
 * (proportional to its weight), then carves a gap out of each step. Because
 * the steps always sum to the available space, the mandala fills its canvas
 * and can never overflow it, whatever the spacing or ring count.
 */
export function calculateRingRadii({
  ringCount,
  ringSpacing,
  minRadius,
  maxRadius,
  weights,
}: RingRadiiParams): RingGeometry[] {
  if (ringCount <= 0 || maxRadius <= minRadius) return [];

  const available = maxRadius - minRadius;
  const ringWeights = Array.from({ length: ringCount }, (_, i) => Math.max(0.1, weights?.[i] ?? 1));
  const totalWeight = ringWeights.reduce((sum, weight) => sum + weight, 0);
  const gapRatio = clamp(ringSpacing, 0, 1) * MAX_GAP_RATIO;

  let stepStart = minRadius;
  return ringWeights.map((weight, index) => {
    const step = (available * weight) / totalWeight;
    const thickness = step * (1 - gapRatio);
    const radius = stepStart + step / 2;
    stepStart += step;
    return {
      index,
      radius,
      thickness,
      innerRadius: radius - thickness / 2,
      outerRadius: radius + thickness / 2,
    };
  });
}

interface PatternCountParams {
  radius: number;
  thickness: number;
  aspect: number;
  symmetry: number;
  density: number;
}

/**
 * How many motifs fit around a ring: circumference / motifWidth, where
 * motifWidth = thickness * aspect. The result is snapped to a multiple of the
 * global symmetry fold so spokes still line up across rings.
 */
export function calculatePatternCount({
  radius,
  thickness,
  aspect,
  symmetry,
  density,
}: PatternCountParams): number {
  const fold = Math.max(1, Math.round(symmetry));
  const motifWidth = Math.max(thickness * aspect, 1e-3);
  const ideal = ((2 * Math.PI * radius) / motifWidth) * density;
  const folds = clamp(Math.round(ideal / fold), 1, Math.floor(MAX_REPETITIONS / fold));
  return folds * fold;
}

/** Square footprint a motif should scale itself to: as tall as the band, unless the cell is too narrow for its aspect. */
export function calculateMotifSize(box: MotifBox, aspect: number): number {
  return Math.max(2, Math.min(box.height, box.width / aspect));
}
