import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Panel({ title, description, children }: PanelProps) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-neutral-900">{title}</h2>
      {description ? <p className="mt-1 text-xs text-neutral-500">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
