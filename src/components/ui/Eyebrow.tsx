import type { ReactNode } from "react";

/** Rotulo corto sobre un titular. Azul marino (estructura), nunca ambar. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-body-sm font-medium uppercase tracking-[0.14em] text-navy ${className}`}
    >
      <span aria-hidden className="h-px w-8 bg-navy" />
      {children}
    </p>
  );
}
