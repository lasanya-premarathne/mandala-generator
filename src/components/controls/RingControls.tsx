"use client";

import { useMandalaStore, RING_COUNT_RANGE } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";

export function RingControls() {
  const ringCount = useMandalaStore((s) => s.ringCount);
  const setRingCount = useMandalaStore((s) => s.setRingCount);
  const symmetry = useMandalaStore((s) => s.symmetry);
  const setSymmetry = useMandalaStore((s) => s.setSymmetry);

  return (
    <Panel title="Structure" description="Set how many rings the mandala has and how many times each pattern repeats.">
      <div className="flex flex-col gap-5">
        <Slider
          id="ring-count"
          label="Number of Rings"
          value={ringCount}
          min={RING_COUNT_RANGE.min}
          max={RING_COUNT_RANGE.max}
          onChange={setRingCount}
          minLabel={String(RING_COUNT_RANGE.min)}
          maxLabel={String(RING_COUNT_RANGE.max)}
        />
        <Slider
          id="symmetry"
          label="Symmetry"
          value={symmetry}
          min={4}
          max={36}
          onChange={setSymmetry}
          minLabel="4"
          maxLabel="36"
        />
      </div>
    </Panel>
  );
}
