"use client";

import { PATTERNS } from "@/lib/mandala/patterns";
import { PatternPreview } from "@/components/mandala/PatternPreview";
import { useMandalaStore } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";

/** The design picker: a grid of thumbnails rendered by the real renderer, one per pattern. */
export function PatternLibrary() {
  const selectedRing = useMandalaStore((s) => s.selectedRing);
  const ring = useMandalaStore((s) => s.rings[s.selectedRing]);
  const setRingPattern = useMandalaStore((s) => s.setRingPattern);
  const patternColor = useMandalaStore((s) => s.patternColor);
  const backgroundColor = useMandalaStore((s) => s.backgroundColor);

  const activePattern = ring?.pattern ?? "none";
  // A transparent background has no color to preview against, so fall back to dark-on-white.
  const previewInk = backgroundColor === "transparent" ? "#1f2937" : (ring?.color ?? patternColor);
  const previewBackground = backgroundColor === "transparent" ? "#ffffff" : backgroundColor;

  return (
    <Panel title="Patterns" description={`Applying to Ring ${selectedRing + 1}`}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => setRingPattern(selectedRing, "none")}
          aria-pressed={activePattern === "none"}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
            activePattern === "none"
              ? "border-neutral-900 bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-400">
            Empty
          </div>
          <span className="text-xs font-medium text-neutral-700">None</span>
        </button>

        {PATTERNS.map((pattern) => {
          const isActive = activePattern === pattern.id;
          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => setRingPattern(selectedRing, pattern.id)}
              aria-pressed={isActive}
              aria-label={`Apply ${pattern.name} pattern to ring ${selectedRing + 1}`}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                isActive ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <PatternPreview
                pattern={pattern.id}
                ink={previewInk}
                background={previewBackground}
                filled={ring?.filled ?? false}
              />
              <span className="text-xs font-medium text-neutral-700">{pattern.name}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
