"use client";

import { useEffect, useRef } from "react";
import type { PatternType } from "@/types/mandala";
import { drawPattern } from "@/lib/mandala/renderer";

interface PatternPreviewProps {
  pattern: PatternType;
  color?: string;
  background?: string;
  size?: number;
  repetitions?: number;
}

/** Renders a small ring segment for one pattern — used as the thumbnail in the pattern library. */
export function PatternPreview({
  pattern,
  color = "#1f2937",
  background = "#ffffff",
  size = 72,
  repetitions = 8,
}: PatternPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    const radius = size * 0.32;
    const motifSize = ((2 * Math.PI * radius) / repetitions) * 0.86;
    const angleStep = (Math.PI * 2) / repetitions;

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    for (let i = 0; i < repetitions; i++) {
      ctx.save();
      ctx.rotate(i * angleStep);
      ctx.translate(0, -radius);
      drawPattern(ctx, pattern, radius, motifSize);
      ctx.restore();
    }
    ctx.restore();
  }, [pattern, color, background, size, repetitions]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block rounded-lg" />;
}
