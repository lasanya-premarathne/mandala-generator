"use client";

import { useMemo } from "react";
import type { MandalaConfig, PatternType } from "@/types/mandala";
import { MandalaThumbnail } from "./MandalaThumbnail";

interface PatternPreviewProps {
  pattern: PatternType;
  ink: string;
  background: string;
  /** Mirror the selected ring's fill mode so the thumbnail shows what applying it would look like. */
  filled?: boolean;
  size?: number;
}

/** One-ring mandala rendered through the real renderer — the thumbnail for a pattern in the library. */
export function PatternPreview({ pattern, ink, background, filled = false, size = 72 }: PatternPreviewProps) {
  const config = useMemo<MandalaConfig>(
    () => ({
      ringCount: 1,
      ringSpacing: 0,
      symmetry: 4,
      density: 1,
      centerSize: 0.3,
      rings: [{ pattern, color: null, filled, weight: 1 }],
      patternColor: ink,
      backgroundColor: background,
    }),
    [pattern, ink, background, filled],
  );

  return <MandalaThumbnail config={config} size={size} />;
}
