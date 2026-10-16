"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/Button";
import type { Project, ProjectType } from "@/data/projects";
import { ProjectGrid } from "./ProjectGrid";

/** Valor del parametro `?tipo=` por tipo de proyecto (URL compartible, sin acentos). */
const filtros: { label: string; tipo: ProjectType | null; param: string }[] = [
  { label: "Todos", tipo: null, param: "" },
  { label: "Residencial", tipo: "Residencial", param: "residencial" },
  { label: "Comercial", tipo: "Comercial", param: "comercial" },
  { label: "Edificación vertical", tipo: "Edificación vertical", param: "edificacion-vertical" },
];

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activo = filtros.find((f) => f.param !== "" && f.param === searchParams.get("tipo")) ?? filtros[0];
  const visibles = activo.tipo ? projects.filter((p) => p.tipo === activo.tipo) : projects;

  const elegir = useCallback(
    (param: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (param) next.set("tipo", param);
      else next.delete("tipo");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div>
      <div role="group" aria-label="Filtrar proyectos por tipo" className="flex flex-wrap gap-2">
        {filtros.map((f) => {
          const pulsado = f.param === activo.param;
          return (
            <button
              key={f.label}
              type="button"
              aria-pressed={pulsado}
              onClick={() => elegir(f.param)}
              className={`h-11 border px-5 text-body font-medium transition-colors duration-150 active:translate-y-px ${
                pulsado
                  ? "border-text bg-text text-bg"
                  : "border-line bg-transparent text-text hover:border-text"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-body-sm text-text-2">
        {visibles.length === 0
          ? "Sin proyectos en este tipo."
          : `${visibles.length} ${visibles.length === 1 ? "proyecto" : "proyectos"}${
              activo.tipo ? `: ${activo.tipo.toLowerCase()}` : ""
            }`}
      </p>

      <div className="mt-10 md:mt-14">
        {visibles.length > 0 ? (
          <ProjectGrid items={visibles} />
        ) : (
          <div className="border border-line p-8 md:p-12">
            <p className="display text-h3 text-text">
              Aún no publicamos proyectos {activo.tipo ? `de tipo ${activo.tipo.toLowerCase()}` : ""}.
            </p>
            <p className="mt-3 max-w-[48ch] text-body text-text-2">
              Estamos reuniendo las obras de esta categoría. Mientras tanto, mira el resto o cuéntanos tu
              proyecto.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={() => elegir("")}>
                Ver todos los proyectos
              </Button>
              <Button href="/cotizar">Cotizar proyecto</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
