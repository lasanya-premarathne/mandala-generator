@AGENTS.md

# Mandala Generator

A client-side generative mandala editor. Next.js (App Router) + TypeScript (strict) + Tailwind CSS + Zustand. No backend, database, or auth in this version — see "Future-ready data model" below before adding any.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (must pass before shipping)
npm run lint     # eslint
```

There is no test suite yet. Verify changes by running the app in a browser and exercising the controls (ring count, spacing, symmetry, per-ring patterns, colors, export, resize).

## Architecture

Rendering logic is deliberately kept out of React components, in `src/lib/mandala/`:

- `types/mandala.ts` — `MandalaConfig` (the serializable source of truth for a design), `PatternDefinition`, `RingGeometry`.
- `lib/mandala/geometry.ts` — pure math: `calculateRingRadii`, `calculatePatternCount`, `calculateMotifSize`. No canvas calls. Ring positions are always derived from `{ ringCount, ringSpacing, minRadius, maxRadius }` — never hardcode a radius or offset.
- `lib/mandala/patterns.ts` — the pattern registry. Each `PatternDefinition` is `{ id, name, draw(ctx, radius, size) }`. `draw` assumes the canvas is already translated/rotated so local `-y` points radially outward; it just paints one motif centered at the origin, scaled to `size`.
- `lib/mandala/renderer.ts` — `drawRing` (loops a pattern around one ring with equal angular spacing) and `drawMandala` (draws background, all rings, and the center point). This is the only place that composes geometry + patterns into pixels.
- `lib/mandala/export.ts` — `downloadMandalaPNG` renders into an **offscreen** canvas at export resolution (independent of the on-screen canvas size/DPR) and triggers the download. Never screenshots the DOM.
- `store/useMandalaStore.ts` — Zustand store holding `MandalaConfig` plus `selectedRing` (UI-only, not part of the serializable config). Never put a `CanvasRenderingContext2D` or other non-serializable object in the store.
- `components/mandala/MandalaCanvas.tsx` — the only component that owns the on-screen `<canvas>`. Subscribes to store fields individually (not the whole store) so unrelated state changes don't trigger a redraw. Uses a `ResizeObserver` + devicePixelRatio scaling for a crisp, responsive canvas.

### Adding a new pattern

Add a `PatternDefinition` in `patterns.ts` and append it to the `PATTERNS` array — nothing else needs to change. The pattern picker, ring assignment, and renderer all read from that array.

### Symmetry model

All rings share one global `symmetry` value (repetitions per ring), rather than each ring auto-deriving its own count from `circumference / patternWidth`. This was a deliberate choice (see spec) for a cleaner, more "intentional" mandala look — spokes align radially across rings instead of drifting independently per ring. Density still adapts automatically: `calculateMotifSize` solves the same relationship the other way (`motifWidth = circumference / count`), so motifs still scale correctly with each ring's radius.

### Future-ready data model

`MandalaConfig` is plain JSON — it's what should be persisted/shared/loaded later (save, gallery, share links), not a rendered image. When backend work eventually lands, it should slot in around this config (e.g. `POST /mandalas { config }`) without touching `lib/mandala/*`.

## Conventions

- Canvas/DOM-dependent code only runs inside `useEffect`/event handlers in files marked `"use client"` — never during render, to avoid hydration mismatches.
- No non-deterministic values (e.g. `Math.random()`, `Date.now()`) in the store's default state — server and client must produce identical initial markup.
- Keep components small and single-purpose (`components/mandala/*` for canvas/rendering-adjacent UI, `components/controls/*` for the sidebar controls, `components/ui/*` for generic primitives like `Slider`/`Panel`).
