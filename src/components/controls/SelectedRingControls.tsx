"use client";

import { RING_WEIGHT_RANGE, useMandalaStore } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";

/** Per-ring styling for whichever ring is selected in the Ring Patterns list. */
export function SelectedRingControls() {
  const selectedRing = useMandalaStore((s) => s.selectedRing);
  const ring = useMandalaStore((s) => s.rings[s.selectedRing]);
  const patternColor = useMandalaStore((s) => s.patternColor);
  const setRingFilled = useMandalaStore((s) => s.setRingFilled);
  const setRingWeight = useMandalaStore((s) => s.setRingWeight);
  const setRingColor = useMandalaStore((s) => s.setRingColor);

  if (!ring) return null;

  return (
    <Panel title={`Ring ${selectedRing + 1} Style`} description="Fine-tune only the selected ring.">
      <div className="flex flex-col gap-5">
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={ring.filled}
            onChange={(event) => setRingFilled(selectedRing, event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          />
          <span>
            Solid band
            <span className="block text-xs text-neutral-500">Fills the ring with ink and cuts the pattern out of it.</span>
          </span>
        </label>

        <Slider
          id="ring-weight"
          label="Band width"
          value={ring.weight}
          min={RING_WEIGHT_RANGE.min}
          max={RING_WEIGHT_RANGE.max}
          step={0.05}
          valueLabel={`${ring.weight.toFixed(2)}×`}
          onChange={(weight) => setRingWeight(selectedRing, weight)}
          minLabel="Thin"
          maxLabel="Wide"
        />

        <div className="flex items-end gap-3">
          <label htmlFor="ring-color" className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-neutral-700">
            Ring color
            <input
              id="ring-color"
              type="color"
              value={ring.color ?? patternColor}
              onChange={(event) => setRingColor(selectedRing, event.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            />
          </label>
          <button
            type="button"
            onClick={() => setRingColor(selectedRing, null)}
            disabled={ring.color === null}
            className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Use global
          </button>
        </div>
      </div>
    </Panel>
  );
}
