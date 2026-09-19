/**
 * Serializable mandala data model. `MandalaConfig` is the single source of
 * truth for a design — it (not a rendered image) is what should eventually be
 * saved, shared, or loaded from a backend.
 */

export type PatternType =
  | "teeth"
  | "molars"
  | "scales"
  | "spirals"
  | "petals"
  | "leaves"
  | "dots"
  | "circles"
  | "diamonds"
  | "waves"
  | "scallops"
  | "teardrops"
  | "stars"
  | "triangles"
  | "arcs"
  | "florals";

/** A ring can also opt out of decoration entirely. */
export type RingPatternValue = PatternType | "none";

export interface RingConfig {
  pattern: RingPatternValue;
  /** Per-ring ink override; `null` falls back to `MandalaConfig.patternColor`. */
  color: string | null;
  /** Fills the whole band with ink and knocks the pattern out of it. */
  filled: boolean;
  /** Relative radial width of the band (1 = average). */
  weight: number;
}

export interface MandalaConfig {
  ringCount: number;
  /** Normalized 0..1 — gap between neighboring rings (0 = touching). */
  ringSpacing: number;
  /** Repetition counts are always a multiple of this fold (4..36). */
  symmetry: number;
  /** Multiplier on how tightly motifs pack around each ring (0.5..2). */
  density: number;
  /** Radius of the empty central disc as a fraction of the mandala radius (0..0.6). */
  centerSize: number;
  rings: RingConfig[];
  patternColor: string;
  /** Hex color, or the literal string "transparent". */
  backgroundColor: string;
}

/** The cell a single motif has to fill: arc length along the ring x radial band thickness. */
export interface MotifBox {
  width: number;
  height: number;
}

export interface PatternDefinition {
  id: PatternType;
  name: string;
  /** Preferred motif width relative to band thickness; drives how many repeats fit around a ring. */
  aspect: number;
  /** Looks best as line-art knocked out of a filled band (used by the randomizer). */
  preferFilled?: boolean;
  /**
   * Draws a single motif. Called with the canvas already translated to the
   * motif's position on the ring and rotated so that local -y points
   * radially outward from the mandala center.
   *
   * @param radius distance from the mandala center to this motif
   * @param size square footprint derived from the box and `aspect`
   * @param box the exact cell available (tangential width x radial height)
   */
  draw: (ctx: CanvasRenderingContext2D, radius: number, size: number, box: MotifBox) => void;
}

export interface RingGeometry {
  index: number;
  /** Centerline radius — where pattern motifs are anchored. */
  radius: number;
  innerRadius: number;
  outerRadius: number;
  /** Radial band available for the pattern to occupy. */
  thickness: number;
}
