"use client";

import { PRESETS } from "@/lib/mandala/presets";
import { MandalaThumbnail } from "@/components/mandala/MandalaThumbnail";
import { useMandalaStore } from "@/store/useMandalaStore";
import { Panel } from "@/components/ui/Panel";

/** One-click starting points, plus a randomizer for endless variations. */
export function PresetControls() {
  const loadConfig = useMandalaStore((s) => s.loadConfig);
  const randomize = useMandalaStore((s) => s.randomize);

  return (
    <Panel title="Designs" description="Start from a complete mandala, then adjust it below.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => loadConfig(preset.config)}
            aria-label={`Load the ${preset.name} design`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-neutral-200 p-2 text-center transition-colors hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            <MandalaThumbnail config={preset.config} size={84} />
            <span className="text-xs font-medium text-neutral-700">{preset.name}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={randomize}
        className="mt-3 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        Randomize
      </button>
    </Panel>
  );
}
