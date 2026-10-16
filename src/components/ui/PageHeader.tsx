import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";

export type Crumb = { label: string; href?: string };

/**
 * Encabezado de pagina interior: banda navy-deep con titulo claro, migas en #BFD0DC y barra
 * ambar de 3px a la izquierda del titulo. El header global (tambien navy-deep) nace solido
 * sobre ella; `data-band-top` anula el padding-top de `main` y el aire de 72px va aqui. `size="display"` para titulos de una linea ("Servicios"),
 * `size="h1"` para titulares largos.
 */
export function PageHeader({
  title,
  intro,
  crumbs,
  size = "display",
  children,
  id = "pagina-titulo",
}: {
  title: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  size?: "display" | "h1";
  /** Contenido extra bajo la introduccion (acciones, datos). */
  children?: ReactNode;
  id?: string;
}) {
  return (
    <header
      data-band-top
      aria-labelledby={id}
      className="on-dark bg-navy-deep pb-14 pt-[calc(72px+3.5rem)] text-on-deep md:pb-20 md:pt-[calc(72px+5rem)] lg:pt-[calc(72px+6rem)]"
    >
      <Container>
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Ruta de navegación" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-on-deep-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden>/</span> : null}
                  {c.href ? (
                    <Link href={c.href} className="underline-offset-4 hover:text-amber hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className="flex items-stretch gap-5 md:gap-7">
          <span aria-hidden className="w-[3px] shrink-0 bg-amber md:w-1" />
          <h1
            id={id}
            className={`display max-w-[20ch] text-on-deep ${size === "display" ? "text-display" : "text-h1 md:max-w-[22ch]"}`}
          >
            {title}
          </h1>
        </div>
        {intro ? <div className="mt-6 max-w-[56ch] text-lead text-on-deep-2 md:mt-8">{intro}</div> : null}
        {children ? <div className="mt-8 md:mt-10">{children}</div> : null}
      </Container>
    </header>
  );
}
