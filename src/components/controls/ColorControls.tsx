"use client";

import { useMandalaStore } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";
import { PALETTES } from "@/lib/mandala/presets";

export function ColorControls() {
  const patternColor = useMandalaStore((s) => s.patternColor);
  const backgroundColor = useMandalaStore((s) => s.backgroundColor);
  const setPatternColor = useMandalaStore((s) => s.setPatternColor);
  const setBackgroundColor = useMandalaStore((s) => s.setBackgroundColor);
  const applyPalette = useMandalaStore((s) => s.applyPalette);

  const isTransparent = backgroundColor === "transparent";

  return (
    <Panel title="Color">
      <div className="flex flex-col gap-5">
        <div className="flex gap-6">
          <label htmlFor="pattern-color" className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Pattern color
            <input
              id="pattern-color"
              type="color"
              value={patternColor}
              onChange={(event) => setPatternColor(event.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            />
          </label>

          <label htmlFor="background-color" className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Background color
            <input
              id="background-color"
              type="color"
              value={isTransparent ? "#ffffff" : backgroundColor}
              disabled={isTransparent}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={isTransparent}
            onChange={(event) => setBackgroundColor(event.target.checked ? "transparent" : "#ffffff")}
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
          Transparent background (for export)
        </label>

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PALETTES.map((palette) => (
              <button
                key={palette.name}
                type="button"
                onClick={() => applyPalette(palette.pattern, palette.background)}
                aria-label={`Apply ${palette.name} color palette`}
                title={palette.name}
                className="h-9 w-9 overflow-hidden rounded-full border border-neutral-200 shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                style={{
                  background: `conic-gradient(${palette.pattern} 0deg 180deg, ${palette.background} 180deg 360deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
