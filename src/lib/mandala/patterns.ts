import type { MotifBox, PatternDefinition, PatternType } from "@/types/mandala";

/**
 * Every motif is drawn centered on the canvas origin with the canvas already
 * rotated + translated to its position on the ring: local -y always points
 * radially outward from the mandala's center, local +y points inward, and
 * local x is the tangential direction. `size` is a square footprint and `box`
 * the exact cell (see calculateMotifSize) — patterns scale themselves to them
 * so density stays consistent across rings of any radius.
 */

/**
 * Half the tangential room a wedge-shaped motif may use at local height `y`.
 * The ring is wider further out, so wedges that widen with radius leave an
 * even gap between neighbors instead of a gap that flares open.
 */
function halfWidthAt(box: MotifBox, radius: number, y: number, fill: number): number {
  return (0.5 * box.width * fill * Math.max(0, radius - y)) / Math.max(radius, 1e-6);
}

/** Pointed (lotus-petal) arch outline from `yBase` up to a tip at `yTip`. */
function strokeArch(ctx: CanvasRenderingContext2D, halfWidth: number, yBase: number, yTip: number): void {
  const rise = yBase - yTip;
  ctx.beginPath();
  ctx.moveTo(-halfWidth, yBase);
  ctx.bezierCurveTo(-halfWidth, yBase - rise * 0.55, -halfWidth * 0.35, yBase - rise * 0.8, 0, yTip);
  ctx.bezierCurveTo(halfWidth * 0.35, yBase - rise * 0.8, halfWidth, yBase - rise * 0.55, halfWidth, yBase);
  ctx.stroke();
}

const teeth: PatternDefinition = {
  id: "teeth",
  name: "Teeth",
  aspect: 0.3,
  draw: (ctx, radius, _size, box) => {
    const top = -box.height / 2;
    const bottom = box.height / 2;
    const halfOut = halfWidthAt(box, radius, top, 0.8);
    const halfIn = halfWidthAt(box, radius, bottom, 0.8) * 0.9;
    const cap = Math.min(halfOut * 1.4, box.height * 0.4);
    ctx.beginPath();
    ctx.moveTo(-halfIn, bottom);
    ctx.lineTo(-halfOut, top + cap);
    ctx.quadraticCurveTo(-halfOut, top, 0, top);
    ctx.quadraticCurveTo(halfOut, top, halfOut, top + cap);
    ctx.lineTo(halfIn, bottom);
    ctx.closePath();
    ctx.fill();
  },
};

const molars: PatternDefinition = {
  id: "molars",
  name: "Notched Blocks",
  aspect: 0.65,
  draw: (ctx, radius, _size, box) => {
    const top = -box.height / 2;
    const bottom = box.height / 2;
    const halfOut = halfWidthAt(box, radius, top, 0.86);
    const halfIn = halfWidthAt(box, radius, bottom, 0.86) * 0.8;
    const corner = Math.min(halfOut * 0.5, box.height * 0.22);
    const notch = box.height * 0.16;
    ctx.beginPath();
    ctx.moveTo(-halfIn, bottom);
    ctx.lineTo(-halfOut, top + corner);
    ctx.quadraticCurveTo(-halfOut, top, -halfOut + corner, top);
    ctx.quadraticCurveTo(-halfOut * 0.1, top, 0, top + notch);
    ctx.quadraticCurveTo(halfOut * 0.1, top, halfOut - corner, top);
    ctx.quadraticCurveTo(halfOut, top, halfOut, top + corner);
    ctx.lineTo(halfIn, bottom);
    ctx.closePath();
    ctx.fill();
  },
};

const scales: PatternDefinition = {
  id: "scales",
  name: "Scales",
  aspect: 0.75,
  preferFilled: true,
  draw: (ctx, _radius, _size, box) => {
    const top = -box.height / 2;
    const bottom = box.height / 2;
    ctx.save();
    ctx.lineWidth = Math.max(0.6, Math.min(box.width, box.height) * 0.07);
    ctx.lineJoin = "round";
    // Outer arch is wider than its cell so neighbors overlap like fish scales.
    strokeArch(ctx, box.width * 0.6, bottom, top);
    strokeArch(ctx, box.width * 0.36, bottom, top + box.height * 0.3);
    ctx.restore();
  },
};

const spirals: PatternDefinition = {
  id: "spirals",
  name: "Spirals",
  aspect: 1,
  preferFilled: true,
  draw: (ctx, _radius, _size, box) => {
    const maxR = Math.min(box.width, box.height) * 0.46;
    const turns = 1.75;
    const steps = 40;
    ctx.save();
    ctx.lineWidth = Math.max(0.6, maxR * 0.2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2 - Math.PI / 2;
      const r = maxR * t;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  },
};

const petals: PatternDefinition = {
  id: "petals",
  name: "Petals",
  aspect: 0.55,
  draw: (ctx, _radius, size) => {
    const w = size * 0.55;
    const h = size * 0.95;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.bezierCurveTo(w / 2, h / 4, w / 2, -h / 4, 0, -h / 2);
    ctx.bezierCurveTo(-w / 2, -h / 4, -w / 2, h / 4, 0, h / 2);
    ctx.closePath();
    ctx.fill();
  },
};

const leaves: PatternDefinition = {
  id: "leaves",
  name: "Leaves",
  aspect: 0.55,
  draw: (ctx, _radius, size) => {
    const w = size * 0.5;
    const h = size * 0.95;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.quadraticCurveTo(w * 0.9, 0, 0, -h / 2);
    ctx.quadraticCurveTo(-w * 0.35, 0, 0, h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.lineWidth = Math.max(0.5, size * 0.035);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.42);
    ctx.lineTo(0, -h * 0.42);
    ctx.stroke();
    ctx.restore();
  },
};

const dots: PatternDefinition = {
  id: "dots",
  name: "Dots",
  aspect: 0.5,
  draw: (ctx, _radius, size) => {
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  },
};

const circles: PatternDefinition = {
  id: "circles",
  name: "Small Circles",
  aspect: 0.7,
  draw: (ctx, _radius, size) => {
    ctx.save();
    ctx.lineWidth = Math.max(0.75, size * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  },
};

const diamonds: PatternDefinition = {
  id: "diamonds",
  name: "Diamonds",
  aspect: 0.55,
  draw: (ctx, _radius, size) => {
    const w = size * 0.5;
    const h = size * 0.85;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, 0);
    ctx.lineTo(0, h / 2);
    ctx.lineTo(-w / 2, 0);
    ctx.closePath();
    ctx.fill();
  },
};

const waves: PatternDefinition = {
  id: "waves",
  name: "Waves",
  aspect: 1,
  draw: (ctx, _radius, size) => {
    const w = size * 0.95;
    const amp = size * 0.22;
    ctx.save();
    ctx.lineWidth = Math.max(1, size * 0.12);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.bezierCurveTo(-w / 4, -amp, w / 4, amp, w / 2, 0);
    ctx.stroke();
    ctx.restore();
  },
};

const scallops: PatternDefinition = {
  id: "scallops",
  name: "Scallops",
  aspect: 1,
  draw: (ctx, _radius, size) => {
    const r = size * 0.5;
    ctx.beginPath();
    ctx.arc(0, size * 0.18, r, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
  },
};

const teardrops: PatternDefinition = {
  id: "teardrops",
  name: "Teardrops",
  aspect: 0.55,
  draw: (ctx, _radius, size) => {
    const w = size * 0.5;
    const h = size * 0.95;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w / 2, h * 0.15, 0, h / 2);
    ctx.quadraticCurveTo(-w / 2, h * 0.15, 0, -h / 2);
    ctx.closePath();
    ctx.fill();
  },
};

const stars: PatternDefinition = {
  id: "stars",
  name: "Stars",
  aspect: 1,
  draw: (ctx, _radius, size) => {
    const spikes = 5;
    const outerR = size * 0.5;
    const innerR = outerR * 0.45;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI / spikes) * i - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  },
};

const triangles: PatternDefinition = {
  id: "triangles",
  name: "Triangles",
  aspect: 0.7,
  draw: (ctx, _radius, size) => {
    const w = size * 0.6;
    const h = size * 0.85;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();
  },
};

const arcs: PatternDefinition = {
  id: "arcs",
  name: "Geometric Arcs",
  aspect: 1,
  draw: (ctx, _radius, size) => {
    const r = size * 0.5;
    ctx.save();
    ctx.lineWidth = Math.max(1, size * 0.16);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, size * 0.15, r, -Math.PI * 0.7, -Math.PI * 0.3);
    ctx.stroke();
    ctx.restore();
  },
};

const florals: PatternDefinition = {
  id: "florals",
  name: "Florals",
  aspect: 0.9,
  draw: (ctx, _radius, size) => {
    const petalCount = 5;
    const petalR = size * 0.24;
    for (let i = 0; i < petalCount; i++) {
      const angle = ((Math.PI * 2) / petalCount) * i;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -petalR * 0.9, petalR * 0.55, petalR, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, petalR * 0.42, 0, Math.PI * 2);
    ctx.fill();
  },
};

export const PATTERNS: readonly PatternDefinition[] = [
  teeth,
  molars,
  scales,
  spirals,
  petals,
  leaves,
  dots,
  circles,
  diamonds,
  waves,
  scallops,
  teardrops,
  stars,
  triangles,
  arcs,
  florals,
];

const PATTERN_MAP: ReadonlyMap<PatternType, PatternDefinition> = new Map(
  PATTERNS.map((pattern) => [pattern.id, pattern]),
);

export function getPatternDefinition(id: PatternType): PatternDefinition {
  const pattern = PATTERN_MAP.get(id);
  if (!pattern) {
    throw new Error(`Unknown pattern type: ${id}`);
  }
  return pattern;
}
