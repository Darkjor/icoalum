"use client";

import { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/ui/Frame";

export type ProcessStep = { verbo: string; linea: string; foto: string };

/**
 * Proceso en 4 verbos. Desde `lg`: lista vertical amplia a la derecha y un marco
 * fijo (sticky) a la izquierda cuya imagen cambia segun el paso que cruza el centro
 * de la pantalla. Debajo de `lg`: cada paso lleva su propia imagen en linea.
 */
export function FactoryProcess({ steps }: { steps: readonly ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="relative" aria-hidden>
            {steps.map((s, i) => (
              <div
                key={s.verbo}
                className={`transition-opacity duration-500 motion-reduce:transition-none ${
                  i === 0 ? "relative" : "absolute inset-0"
                } ${i === active ? "opacity-100" : "opacity-0"}`}
              >
                <Frame ratio="4/5" pendiente={s.foto} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="lg:col-span-6 lg:col-start-7">
        {steps.map((s, i) => (
          <li
            key={s.verbo}
            data-index={i}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="border-t border-text py-10 md:py-12 lg:flex lg:min-h-[60vh] lg:flex-col lg:justify-center"
          >
            <div className="mb-8 lg:hidden">
              <Frame ratio="4/3" pendiente={s.foto} />
            </div>
            <h3 className="display text-h1 text-text">{s.verbo}</h3>
            <p className="mt-4 max-w-[40ch] text-lead text-text-2">{s.linea}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
