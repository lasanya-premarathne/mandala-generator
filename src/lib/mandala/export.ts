import type { MandalaConfig } from "@/types/mandala";
import { drawMandala } from "./renderer";

/** Default export resolution — independent of whatever size the on-screen canvas happens to be. */
export const EXPORT_SIZE = 2400;

/**
 * Renders the mandala into an offscreen canvas at full export resolution and
 * triggers a PNG download. Never reads from the on-screen canvas, so the
 * download is pixel-crisp regardless of the browser window's size or DPR.
 */
export function downloadMandalaPNG(
  config: MandalaConfig,
  exportSize: number = EXPORT_SIZE,
  filename = "mandala.png",
): void {
  const canvas = document.createElement("canvas");
  canvas.width = exportSize;
  canvas.height = exportSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  drawMandala(ctx, config, { size: exportSize });

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, "image/png");
}
