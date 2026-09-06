/**
 * Serializable mandala data model. `MandalaConfig` is the single source of
 * truth for a design — it (not a rendered image) is what should eventually be
 * saved, shared, or loaded from a backend.
 */

export type PatternType =
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

export interface MandalaConfig {
  ringCount: number;
  /** Normalized 0..1 — how far apart concentric rings are spaced. */
  ringSpacing: number;
  /** Rotational repetitions applied uniformly to every ring (4..36). */
  symmetry: number;
  ringPatterns: RingPatternValue[];
  /** Optional per-ring color override; `null` falls back to `patternColor`. */
  ringColors: Array<string | null>;
  patternColor: string;
  /** Hex color, or the literal string "transparent". */
  backgroundColor: string;
}

export interface PatternDefinition {
  id: PatternType;
  name: string;
  /**
   * Draws a single motif. Called with the canvas already translated to the
   * motif's position on the ring and rotated so that local -y points
   * radially outward from the mandala center.
   *
   * @param radius distance from the mandala center to this motif
   * @param size approximate footprint (width/height) the motif should fill
   */
  draw: (ctx: CanvasRenderingContext2D, radius: number, size: number) => void;
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
