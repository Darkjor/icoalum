import { HideWindow } from "@/components/home/HideWindow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Innovación: Hide Window, la ventilación oculta",
  description:
    "Hide Window es la innovación propia de Ico Alum: ventilación integrada que no se ve en la fachada. Conoce la idea y dónde puede aplicarse.",
  path: "/innovacion",
});

const aplicaciones = [
  {
    contexto: "Residencial de alto nivel",
    texto:
      "Casas donde el diseño pide fachadas limpias y la ventilación debe integrarse al conjunto, sin sumar elementos a la vista.",
  },
  {
    contexto: "Comercial",
    texto: "Locales y oficinas con grandes vanos donde se busca ventilar sin alterar la imagen de la fachada.",
  },
  {
    contexto: "Edificación vertical",
    texto: "Proyectos en altura donde el criterio de fachada y la ventilación se resuelven desde el diseño.",
  },
] as const;

export default function InnovacionPage() {
  return (
    <>
      {/* Encabezado a sangre y los 3 momentos ligados al scroll (o apilados con movimiento reducido) */}
      <HideWindow hero showCta={false} />

      <Section tone="bg" aria-labelledby="mecanismo-titulo">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 id="mecanismo-titulo" className="display max-w-[14ch] text-h1 text-text">
                Cómo funciona.
              </h2>
              <p className="mt-6 max-w-[44ch] text-body text-text-2">
                [PENDIENTE CLIENTE] explicar el mecanismo
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Frame ratio="16/10" pendiente="foto o esquema del detalle de Hide Window" />
          </div>
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="aplicaciones-titulo">
        <Reveal>
          <h2 id="aplicaciones-titulo" className="display max-w-[16ch] text-h1 text-text">
            Aplicaciones.
          </h2>
          <p className="mt-5 max-w-[48ch] text-body text-text-2">
            Contextos en los que Hide Window puede ser una opción. Cada proyecto se revisa caso por caso.
          </p>
        </Reveal>
        <dl className="mt-12 border-b border-line md:mt-16">
          {aplicaciones.map((a) => (
            <div key={a.contexto} className="grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-6 md:py-10">
              <dt className="display text-h2 text-text md:col-span-6">{a.contexto}</dt>
              <dd className="max-w-[46ch] text-body text-text-2 md:col-span-5 md:col-start-8">{a.texto}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-body-sm text-text-2">
          [PENDIENTE CLIENTE] confirmar aplicaciones reales y obras donde se ha instalado
        </p>
      </Section>

      <section aria-labelledby="innovacion-cta" className="bg-bg py-16 md:py-24">
        <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="innovacion-cta" className="display max-w-[20ch] text-h1 text-text">
            ¿Quieres saber si Hide Window encaja en tu proyecto?
          </h2>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
