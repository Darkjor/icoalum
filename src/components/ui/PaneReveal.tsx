"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const tones = {
  bg: "bg-bg",
  surface: "bg-surface",
  surface2: "bg-surface-2",
} as const;

/**
 * Panel corredizo: una hoja del color del fondo, con canto de aluminio de 2px,
 * se desliza (solo transform) y descubre a su hijo al entrar en viewport, una vez.
 * Con movimiento reducido no hay panel: el contenido se ve de inicio
 * (CSS oculta `[data-pane]` tambien antes de hidratar).
 */
export function PaneReveal({
  children,
  from = "left",
  tone = "bg",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Lado desde el que corre el panel al descubrir: "left" lo manda hacia la derecha. */
  from?: "left" | "right";
  tone?: keyof typeof tones;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const toRight = from === "left";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {reduce ? null : (
        <motion.div
          data-pane
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${tones[tone]} ${
            toRight ? "border-r-2" : "border-l-2"
          } border-alu will-change-transform`}
          initial={{ x: "0%" }}
          whileInView={{ x: toRight ? "101%" : "-101%" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </div>
  );
}
