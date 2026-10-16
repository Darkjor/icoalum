"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Placeholder } from "@/components/ui/Placeholder";

type Moment = { readonly titulo: string; readonly cuerpo: string };

/** Cada momento ocupa un tercio del recorrido; se funde entre vecinos (opacity + y). */
function MomentText({
  moment,
  index,
  progress,
}: {
  moment: Moment;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index / 3;
  const end = (index + 1) / 3;
  const first = index === 0;
  const last = index === 2;
  const fade = 0.05;
  const opacity = useTransform(
    progress,
    [start - fade, start + fade, end - fade, end + fade],
    [first ? 1 : 0, 1, 1, last ? 1 : 0],
  );
  const y = useTransform(
    progress,
    [start - fade, start + fade, end - fade, end + fade],
    [first ? 0 : 32, 0, 0, last ? 0 : -32],
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 will-change-transform">
      <h3 className="display text-h2 text-photo">{moment.titulo}</h3>
      <p className="mt-3 max-w-[44ch] text-lead text-photo/90">{moment.cuerpo}</p>
    </motion.div>
  );
}

export function HideWindowScroll({
  title,
  moments,
}: {
  title: string;
  moments: readonly Moment[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // La foto avanza muy poco hacia el espectador mientras se cuenta (transform).
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative h-[260svh] md:h-[300svh]">
      <div className="sticky top-0 flex h-[100dvh] items-end overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
          <Placeholder
            ratio="16/9"
            label="foto a sangre de la fachada con Hide Window"
            className="!h-full"
            labelClassName="!bottom-auto !top-24 !text-photo/80"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/55 via-60% to-ink/45" />

        <Container className="relative z-10 pb-12 pt-28 md:pb-16">
          <h2 className="display max-w-[20ch] text-h1 text-photo">{title}</h2>
          <div className="relative mt-8 h-44 md:h-40">
            {moments.map((m, i) => (
              <MomentText key={m.titulo} moment={m} index={i} progress={scrollYProgress} />
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/innovacion"
              className={buttonClasses("onPhoto", "self-start")}
            >
              Conocer la innovación
            </Link>
            <div aria-hidden className="h-px w-full max-w-xs bg-photo/25 sm:w-64">
              <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-photo" />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
