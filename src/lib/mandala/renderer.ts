import type { MandalaConfig, RingGeometry, RingPatternValue } from "@/types/mandala";
import { calculateMotifSize, calculatePatternCount, calculateRingRadii } from "./geometry";
import { getPatternDefinition } from "./patterns";

export interface MandalaRenderOptions {
  /** Logical square canvas size in CSS px (device-pixel scaling is the caller's concern). */
  size: number;
}

/** Draws one motif, already positioned/rotated by the caller. Thin wrapper so
 * previews and the ring renderer share the exact same drawing path. */
export function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: RingPatternValue,
  radius: number,
  size: number,
): void {
  if (pattern === "none") return;
  getPatternDefinition(pattern).draw(ctx, radius, size);
}

/** Draws every rotationally-symmetric repetition of a ring's pattern. */
export function drawRing(
  ctx: CanvasRenderingContext2D,
  ring: RingGeometry,
  pattern: RingPatternValue,
  count: number,
  color: string,
): void {
  if (pattern === "none") {
    drawStructureCircle(ctx, ring, color);
    return;
  }

  const motifSize = calculateMotifSize(ring, count);
  const angleStep = (Math.PI * 2) / count;

  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  for (let i = 0; i < count; i++) {
    ctx.save();
    ctx.rotate(i * angleStep);
    ctx.translate(0, -ring.radius);
    drawPattern(ctx, pattern, ring.radius, motifSize);
    ctx.restore();
  }
  ctx.restore();
}

/** A faint guide circle so an undecorated ring still reads as structure, not empty space. */
function drawStructureCircle(ctx: CanvasRenderingContext2D, ring: RingGeometry, color: string): void {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, ring.thickness * 0.05);
  ctx.beginPath();
  ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Renders the complete mandala into `ctx`, sized in logical px via
 * `options.size`. Every ring shares the same rotational-symmetry count so
 * motifs align radially across rings for a coherent, intentional mandala
 * shape rather than independently-spinning circles.
 */
export function drawMandala(
  ctx: CanvasRenderingContext2D,
  config: MandalaConfig,
  options: MandalaRenderOptions,
): void {
  const { size } = options;
  const { ringCount, ringSpacing, symmetry, ringPatterns, ringColors, patternColor, backgroundColor } = config;

  ctx.save();
  ctx.clearRect(0, 0, size, size);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  const minRadius = size * 0.045;
  const maxRadius = size * 0.465;
  const rings = calculateRingRadii({ ringCount, ringSpacing, minRadius, maxRadius });
  const count = calculatePatternCount(symmetry);

  ctx.translate(size / 2, size / 2);

  for (const ring of rings) {
    const pattern = ringPatterns[ring.index] ?? "none";
    const color = ringColors[ring.index] ?? patternColor;
    drawRing(ctx, ring, pattern, count, color);
  }

  ctx.fillStyle = patternColor;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.5, size * 0.006), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
