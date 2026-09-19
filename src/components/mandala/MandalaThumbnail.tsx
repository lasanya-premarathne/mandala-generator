"use client";

import { useEffect, useRef } from "react";
import type { MandalaConfig } from "@/types/mandala";
import { drawMandala } from "@/lib/mandala/renderer";

interface MandalaThumbnailProps {
  config: MandalaConfig;
  size?: number;
}

/** Small static canvas that renders any config through the real renderer, so previews always match the main canvas. */
export function MandalaThumbnail({ config, size = 72 }: MandalaThumbnailProps) {
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
    drawMandala(ctx, config, { size });
  }, [config, size]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block rounded-lg" />;
}
