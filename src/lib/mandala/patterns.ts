import type { PatternDefinition, PatternType } from "@/types/mandala";

/**
 * Every motif is drawn centered on the canvas origin with the canvas already
 * rotated + translated to its position on the ring: local -y always points
 * radially outward from the mandala's center, local +y points inward, and
 * local x is the tangential direction. `size` is the motif's target
 * footprint (see calculateMotifSize) — patterns scale themselves to it so
 * density stays consistent across rings of any radius.
 */

const petals: PatternDefinition = {
  id: "petals",
  name: "Petals",
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
  draw: (ctx, _radius, size) => {
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
  },
};

const circles: PatternDefinition = {
  id: "circles",
  name: "Small Circles",
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
