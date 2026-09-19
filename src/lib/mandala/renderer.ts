import type { MandalaConfig, MotifBox, RingConfig, RingGeometry, RingPatternValue } from "@/types/mandala";
import { calculateMotifSize, calculatePatternCount, calculateRingRadii, clamp } from "./geometry";
import { getPatternDefinition } from "./patterns";

export interface MandalaRenderOptions {
  /** Logical square canvas size in CSS px (device-pixel scaling is the caller's concern). */
  size: number;
}

interface RingRenderOptions {
  ink: string;
  background: string;
  symmetry: number;
  density: number;
}

const EMPTY_RING: RingConfig = { pattern: "none", color: null, filled: false, weight: 1 };

/** Draws one motif, already positioned/rotated by the caller. */
export function drawPattern(
  ctx: CanvasRenderingContext2D,
  pattern: RingPatternValue,
  radius: number,
  size: number,
  box: MotifBox,
): void {
  if (pattern === "none") return;
  getPatternDefinition(pattern).draw(ctx, radius, size, box);
}

/** Solid annulus covering the ring's whole radial band. */
function fillBand(ctx: CanvasRenderingContext2D, geometry: RingGeometry, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, geometry.outerRadius, 0, Math.PI * 2);
  ctx.arc(0, 0, geometry.innerRadius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();
}

/** A faint guide circle so an undecorated ring still reads as structure, not empty space. */
function drawStructureCircle(ctx: CanvasRenderingContext2D, geometry: RingGeometry, color: string): void {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(0.5, geometry.thickness * 0.05);
  ctx.beginPath();
  ctx.arc(0, 0, geometry.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws one ring: an optional solid band, then every rotationally-symmetric
 * repetition of its pattern. On a filled band the pattern is knocked out
 * (painted in the background color, or erased when the background is
 * transparent) rather than drawn on top.
 */
export function drawRing(
  ctx: CanvasRenderingContext2D,
  geometry: RingGeometry,
  ring: RingConfig,
  options: RingRenderOptions,
): void {
  const ink = ring.color ?? options.ink;

  if (ring.filled) fillBand(ctx, geometry, ink);

  if (ring.pattern === "none") {
    if (!ring.filled) drawStructureCircle(ctx, geometry, ink);
    return;
  }

  const { aspect } = getPatternDefinition(ring.pattern);
  const count = calculatePatternCount({
    radius: geometry.radius,
    thickness: geometry.thickness,
    aspect,
    symmetry: options.symmetry,
    density: options.density,
  });
  const box: MotifBox = { width: (2 * Math.PI * geometry.radius) / count, height: geometry.thickness };
  const size = calculateMotifSize(box, aspect);
  const angleStep = (Math.PI * 2) / count;

  ctx.save();
  let paint = ink;
  if (ring.filled) {
    if (options.background === "transparent") {
      ctx.globalCompositeOperation = "destination-out";
      paint = "#000000";
    } else {
      paint = options.background;
    }
  }
  ctx.fillStyle = paint;
  ctx.strokeStyle = paint;

  for (let i = 0; i < count; i++) {
    ctx.save();
    ctx.rotate(i * angleStep);
    ctx.translate(0, -geometry.radius);
    drawPattern(ctx, ring.pattern, geometry.radius, size, box);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Renders the complete mandala into `ctx`, sized in logical px via
 * `options.size`. Every ring's repeat count is a multiple of the shared
 * symmetry fold, so motifs line up radially across rings for a coherent,
 * intentional mandala rather than independently-spinning circles.
 */
export function drawMandala(
  ctx: CanvasRenderingContext2D,
  config: MandalaConfig,
  options: MandalaRenderOptions,
): void {
  const { size } = options;
  const { ringCount, ringSpacing, symmetry, density, centerSize, rings, patternColor, backgroundColor } = config;

  ctx.save();
  ctx.clearRect(0, 0, size, size);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  const maxRadius = size * 0.465;
  const minRadius = maxRadius * clamp(centerSize, 0, 0.6);
  const geometries = calculateRingRadii({
    ringCount,
    ringSpacing,
    minRadius,
    maxRadius,
    weights: rings.map((ring) => ring.weight),
  });

  ctx.translate(size / 2, size / 2);

  for (const geometry of geometries) {
    drawRing(ctx, geometry, rings[geometry.index] ?? EMPTY_RING, {
      ink: patternColor,
      background: backgroundColor,
      symmetry,
      density,
    });
  }

  ctx.fillStyle = patternColor;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.5, size * 0.006), 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
