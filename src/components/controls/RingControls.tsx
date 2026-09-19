"use client";

import { useMandalaStore, RING_COUNT_RANGE } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";

export function RingControls() {
  const ringCount = useMandalaStore((s) => s.ringCount);
  const setRingCount = useMandalaStore((s) => s.setRingCount);
  const symmetry = useMandalaStore((s) => s.symmetry);
  const setSymmetry = useMandalaStore((s) => s.setSymmetry);
  const density = useMandalaStore((s) => s.density);
  const setDensity = useMandalaStore((s) => s.setDensity);
  const centerSize = useMandalaStore((s) => s.centerSize);
  const setCenterSize = useMandalaStore((s) => s.setCenterSize);

  return (
    <Panel
      title="Structure"
      description="How many rings there are, how tightly they're packed, and how much of the middle stays empty."
    >
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
          id="density"
          label="Density"
          value={density}
          min={0.5}
          max={2}
          step={0.05}
          valueLabel={`${density.toFixed(2)}×`}
          onChange={setDensity}
          minLabel="Sparse"
          maxLabel="Dense"
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
        <Slider
          id="center-size"
          label="Center size"
          value={centerSize}
          min={0}
          max={0.6}
          step={0.01}
          valueLabel={`${Math.round(centerSize * 100)}%`}
          onChange={setCenterSize}
          minLabel="Small"
          maxLabel="Large"
        />
      </div>
    </Panel>
  );
}
