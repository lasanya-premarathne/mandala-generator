"use client";

import { useMandalaStore } from "@/store/useMandalaStore";
import { getPatternDefinition } from "@/lib/mandala/patterns";
import { Panel } from "@/components/ui/Panel";

function patternLabel(pattern: string): string {
  if (pattern === "none") return "None";
  return getPatternDefinition(pattern as Parameters<typeof getPatternDefinition>[0]).name;
}

/**
 * Clicking a ring makes it "active" — the Pattern Library below then applies
 * whatever the user picks to this ring only, leaving every other ring
 * untouched.
 */
export function RingSelector() {
  const ringPatterns = useMandalaStore((s) => s.ringPatterns);
  const selectedRing = useMandalaStore((s) => s.selectedRing);
  const setSelectedRing = useMandalaStore((s) => s.setSelectedRing);

  return (
    <Panel title="Ring Patterns" description="Select a ring, then choose a design for it below.">
      <ul className="flex flex-col gap-2">
        {ringPatterns.map((pattern, index) => {
          const isActive = index === selectedRing;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => setSelectedRing(index)}
                aria-pressed={isActive}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span className="font-medium">Ring {index + 1}</span>
                <span className={isActive ? "text-neutral-300" : "text-neutral-400"}>
                  {patternLabel(pattern)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
