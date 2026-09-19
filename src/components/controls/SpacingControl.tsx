"use client";

import { useMandalaStore } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";
import { Slider } from "@/components/ui/Slider";

export function SpacingControl() {
  const ringSpacing = useMandalaStore((s) => s.ringSpacing);
  const setRingSpacing = useMandalaStore((s) => s.setRingSpacing);

  return (
    <Panel title="Ring Spacing" description="The gap between neighboring rings. At 0% they touch.">
      <Slider
        id="ring-spacing"
        label="Spacing"
        value={ringSpacing}
        min={0}
        max={1}
        step={0.01}
        valueLabel={`${Math.round(ringSpacing * 100)}%`}
        onChange={setRingSpacing}
        minLabel="Small"
        maxLabel="Large"
      />
    </Panel>
  );
}
