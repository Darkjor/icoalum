import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";

/**
 * Hero: foto a sangre con velo navy-deep (mas opaco abajo y a la izquierda), texto abajo a la izquierda.
 * Solo 4 elementos: titular, subtitulo y 2 CTA.
 * Foto provisional del archivo del cliente (LCP: priority). [PENDIENTE CLIENTE] sesion fotografica profesional.
 */
export function Hero() {
  return (
    <section
      data-hero
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-navy-deep"
    >
      <PaneReveal className="!absolute inset-0">
        <Image
          src="/obra/residencia-muro-cristal-corredizo.jpg"
          alt="Residencia con muro de cristal corredizo abierto hacia la alberca y la sala"
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/65 via-55% to-navy-deep/30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-navy-deep/25 via-60% to-transparent" />
      </PaneReveal>

      <Container className="on-dark relative z-10 pb-14 pt-40 md:pb-20 lg:pb-24">
        <Reveal delay={0.55}>
          <h1
            id="hero-titulo"
            className="display max-w-[1180px] text-[clamp(2.5rem,1.2rem+4.4vw,4.5rem)] text-photo"
          >
            Cristal y aluminio a la medida de tu obra.
          </h1>
          <p className="mt-5 max-w-[56ch] text-lead text-photo md:mt-6">
            Fabricamos e instalamos cancelería, cristal templado y fachadas en Guadalajara desde
            1979.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <Button href="/cotizar" variant="primaryOnDark" track={{ event: "cta_cotizar", data: { origen: "hero" } }}>
              Cotizar proyecto
            </Button>
            <Button href="/proyectos" variant="secondaryOnDark">
              Ver proyectos
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
