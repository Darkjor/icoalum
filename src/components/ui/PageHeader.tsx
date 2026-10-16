import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";

export type Crumb = { label: string; href?: string };

/**
 * Encabezado de pagina interior. Nace sobre fondo claro (el header ya es solido),
 * sin foto obligatoria. `size="display"` para titulos de una linea ("Servicios"),
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
    <header aria-labelledby={id} className="border-b border-line bg-bg pb-14 pt-14 md:pb-20 md:pt-20 lg:pt-24">
      <Container>
        {crumbs && crumbs.length > 0 ? (
          <nav aria-label="Ruta de navegación" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-text-2">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden>/</span> : null}
                  {c.href ? (
                    <Link href={c.href} className="text-navy underline-offset-4 hover:underline">
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
        <h1
          id={id}
          className={`display max-w-[20ch] text-text ${size === "display" ? "text-display" : "text-h1 md:max-w-[22ch]"}`}
        >
          {title}
        </h1>
        {intro ? <div className="mt-6 max-w-[56ch] text-lead text-text-2 md:mt-8">{intro}</div> : null}
        {children ? <div className="mt-8 md:mt-10">{children}</div> : null}
      </Container>
    </header>
  );
}
