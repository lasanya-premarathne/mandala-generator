import { MandalaCanvas } from "@/components/mandala/MandalaCanvas";
import { RingSelector } from "@/components/mandala/RingSelector";
import { PatternLibrary } from "@/components/controls/PatternLibrary";
import { RingControls } from "@/components/controls/RingControls";
import { SpacingControl } from "@/components/controls/SpacingControl";
import { ColorControls } from "@/components/controls/ColorControls";
import { ExportControls } from "@/components/controls/ExportControls";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Mandala Generator</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Build a symmetrical mandala from concentric rings, apply a design to each one, and download it as a
            high-resolution image.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_400px]">
        <section className="lg:sticky lg:top-8 lg:h-fit">
          <MandalaCanvas />
        </section>

        <section className="flex flex-col gap-6">
          <RingControls />
          <SpacingControl />
          <RingSelector />
          <PatternLibrary />
          <ColorControls />
          <ExportControls />
        </section>
      </div>
    </main>
  );
}
