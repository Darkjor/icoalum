"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";

const btn =
  "inline-flex h-[52px] w-[52px] items-center justify-center border border-text text-text transition-colors duration-150 hover:bg-surface-2 active:translate-y-px";

/** Citas de hasta ~180 caracteres para que no pasen de 3 lineas. */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const t = items[i];
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <div className="max-w-5xl" role="group" aria-roledescription="carrusel" aria-label="Testimonios">
      <div aria-live="polite" aria-atomic="true">
        <motion.figure
          key={i}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className="display line-clamp-3 text-h1 text-text">{t.cita}</blockquote>
          <figcaption className="mt-8 text-body text-text-2">
            <span className="font-medium text-text">{t.nombre}</span>, {t.cargo}, {t.empresa}
          </figcaption>
        </motion.figure>
      </div>
      {items.length > 1 ? (
        <div className="mt-10 flex gap-3">
          <button type="button" className={btn} onClick={() => go(-1)} aria-label="Testimonio anterior">
            <ArrowLeft aria-hidden weight="light" size={24} />
          </button>
          <button type="button" className={btn} onClick={() => go(1)} aria-label="Testimonio siguiente">
            <ArrowRight aria-hidden weight="light" size={24} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
