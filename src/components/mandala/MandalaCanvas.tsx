"use client";

import { useEffect, useRef, useState } from "react";
import { useMandalaStore } from "@/store/useMandalaStore";
import { drawMandala } from "@/lib/mandala/renderer";

const TRANSPARENCY_GRID_STYLE = {
  backgroundImage:
    "repeating-conic-gradient(#e5e5e5 0% 25%, transparent 0% 50%)",
  backgroundSize: "16px 16px",
};

/**
 * Owns the on-screen <canvas>. Subscribes to the mandala config directly from
 * the store (rather than receiving it via props) so only this component
 * re-renders when a control changes — the rest of the page tree is
 * unaffected. Redraws on a ResizeObserver so the mandala stays crisp and
 * centered at any viewport size.
 */
export function MandalaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState(0);

  const ringCount = useMandalaStore((s) => s.ringCount);
  const ringSpacing = useMandalaStore((s) => s.ringSpacing);
  const symmetry = useMandalaStore((s) => s.symmetry);
  const density = useMandalaStore((s) => s.density);
  const centerSize = useMandalaStore((s) => s.centerSize);
  const rings = useMandalaStore((s) => s.rings);
  const patternColor = useMandalaStore((s) => s.patternColor);
  const backgroundColor = useMandalaStore((s) => s.backgroundColor);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setDisplaySize(Math.floor(width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || displaySize <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    canvas.style.width = `${displaySize}px`;
    canvas.style.height = `${displaySize}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawMandala(
      ctx,
      { ringCount, ringSpacing, symmetry, density, centerSize, rings, patternColor, backgroundColor },
      { size: displaySize },
    );
  }, [displaySize, ringCount, ringSpacing, symmetry, density, centerSize, rings, patternColor, backgroundColor]);

  return (
    <div
      ref={containerRef}
      className="mx-auto aspect-square w-full max-w-[640px] overflow-hidden rounded-3xl border border-neutral-200 shadow-sm"
      style={backgroundColor === "transparent" ? TRANSPARENCY_GRID_STYLE : { backgroundColor: "#ffffff" }}
    >
      <canvas ref={canvasRef} role="img" aria-label="Generated mandala preview" className="h-full w-full" />
    </div>
  );
}
