import type { ReactNode } from "react";
import { Container } from "./Container";

const tones = {
  bg: "bg-bg",
  surface: "bg-surface",
  surface2: "bg-surface-2",
} as const;

/**
 * Bloque de pagina con aire vertical y Container. Un solo tema: el tono
 * solo cambia la superficie, nunca invierte colores.
 */
export function Section({
  children,
  id,
  tone = "bg",
  className = "",
  innerClassName = "",
  "aria-labelledby": labelledBy,
}: {
  children: ReactNode;
  id?: string;
  tone?: keyof typeof tones;
  className?: string;
  innerClassName?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tones[tone]} py-20 md:py-28 lg:py-36 ${className}`}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}
