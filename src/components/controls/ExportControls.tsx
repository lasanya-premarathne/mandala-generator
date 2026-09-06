"use client";

import { useState } from "react";
import { useMandalaStore } from "@/store/useMandalaStore";
import { downloadMandalaPNG } from "@/lib/mandala/export";
import { Panel } from "@/components/ui/Panel";

export function ExportControls() {
  const getConfig = useMandalaStore((s) => s.getConfig);
  const reset = useMandalaStore((s) => s.reset);
  const clearPatterns = useMandalaStore((s) => s.clearPatterns);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    try {
      downloadMandalaPNG(getConfig());
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Panel title="Export">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          {isExporting ? "Preparing..." : "Download PNG"}
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={clearPatterns}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Clear Patterns
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            Reset
          </button>
        </div>
      </div>
    </Panel>
  );
}
