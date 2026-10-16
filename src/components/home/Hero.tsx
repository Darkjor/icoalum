import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";

/**
 * Hero: foto a sangre con velo de tinta, texto abajo a la izquierda.
 * Solo 4 elementos: titular, subtitulo y 2 CTA.
 * [PENDIENTE CLIENTE] foto real del hero (cambiar el Placeholder por <Image priority>).
 */
export function Hero() {
  return (
    <section
      data-hero
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-ink"
    >
      <PaneReveal className="!absolute inset-0">
        <Placeholder
          ratio="16/9"
          label="foto de fachada de cristal y aluminio, a sangre"
          className="!h-full"
          labelClassName="!bottom-auto !top-24 !text-photo/80"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/60 via-55% to-ink/25" />
      </PaneReveal>

      <Container className="relative z-10 pb-14 pt-40 md:pb-20 lg:pb-24">
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
            <Button href="/cotizar" variant="primary" track={{ event: "cta_cotizar", data: { origen: "hero" } }}>
              Cotizar proyecto
            </Button>
            <Button href="/proyectos" variant="onPhoto">
              Ver proyectos
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
