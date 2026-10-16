import type { ReactNode } from "react";

/** Rotulo corto sobre un titular. Vino de marca; la barra de 3px es el eco del trazo del logo (un acento por seccion). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 text-body-sm font-medium uppercase tracking-[0.14em] text-vino ${className}`}
    >
      <span aria-hidden className="h-[3px] w-10 bg-vino" />
      {children}
    </p>
  );
}
