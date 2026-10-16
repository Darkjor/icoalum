import { FactoryProcess, type ProcessStep } from "@/components/factory/FactoryProcess";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Fábrica en Zapopan: del cálculo a la instalación",
  description:
    "Conoce la fábrica de Ico Alum en Zapopan: medimos, calculamos, fabricamos e instalamos cancelería, PVC y cristal templado, incluso en medidas jumbo.",
  path: "/fabrica",
});

const steps: readonly ProcessStep[] = [
  {
    verbo: "Medimos",
    linea: "Levantamos el vano en obra, con las medidas reales del proyecto.",
    foto: "foto del levantamiento de medidas en obra",
  },
  {
    verbo: "Calculamos",
    linea: "Definimos perfiles, cristal y herrajes con cálculo estructural antes de fabricar.",
    foto: "foto del cálculo estructural y planos",
  },
  {
    verbo: "Fabricamos",
    linea: "Cortamos y armamos en nuestra planta de Zapopan, también en medidas jumbo y cristal templado de gran formato.",
    foto: "foto de la fabricación en planta",
  },
  {
    verbo: "Instalamos",
    linea: "Nuestro equipo coloca y deja funcionando. Un solo responsable de fábrica a obra.",
    foto: "foto de la instalación en obra",
  },
];

const maquinaria = [
  { rotulo: "Maquinaria", pendiente: "listado de equipos con marca y función en el proceso" },
  { rotulo: "Capacidad de producción", pendiente: "volumen de producción confirmado por el cliente" },
  { rotulo: "Medidas máximas de fabricación", pendiente: "dimensiones máximas de las piezas jumbo" },
] as const;

const calidad = [
  { etapa: "Antes de fabricar", pendiente: "describir las revisiones previas al corte" },
  { etapa: "Durante la fabricación", pendiente: "describir las revisiones en planta" },
  { etapa: "Antes de entregar", pendiente: "describir las revisiones previas a la instalación" },
] as const;

export default function FabricaPage() {
  return (
    <>
      <PageHeader
        title="Una fábrica propia en Zapopan."
        size="h1"
        intro="Aquí se calcula, se corta y se arma lo que después instalamos nosotros mismos."
      />

      <Section tone="bg" className="!pb-0 !pt-12 md:!pt-16 lg:!pt-20" aria-labelledby="pagina-titulo">
        <Reveal>
          <Frame ratio="16/9" pendiente="foto grande de la planta de Puerto Márquez 3-A, Zapopan" sizes="100vw" />
        </Reveal>
      </Section>

      <Section tone="bg" aria-labelledby="proceso-titulo">
        <h2 id="proceso-titulo" className="display mb-12 max-w-[18ch] text-h1 text-text md:mb-16">
          De la medición a la instalación.
        </h2>
        <FactoryProcess steps={steps} />
      </Section>

      <Section tone="surface" aria-labelledby="maquinaria-titulo">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <h2 id="maquinaria-titulo" className="display max-w-[14ch] text-h1 text-text md:col-span-5">
            Maquinaria y capacidad.
          </h2>
          <dl className="md:col-span-6 md:col-start-7">
            {maquinaria.map((m) => (
              <div key={m.rotulo} className="border-t border-line py-6 first:border-t-text">
                <dt className="display text-h3 text-text">{m.rotulo}</dt>
                <dd className="mt-2 max-w-[44ch] text-body text-text-2">[PENDIENTE CLIENTE] {m.pendiente}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="bg" aria-labelledby="calidad-titulo">
        <h2 id="calidad-titulo" className="display max-w-[16ch] text-h1 text-text">
          Control de calidad.
        </h2>
        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {calidad.map((c) => (
            <li key={c.etapa} className="border-t border-text pt-5">
              <h3 className="display text-h3 text-text">{c.etapa}</h3>
              <p className="mt-3 max-w-[34ch] text-body text-text-2">[PENDIENTE CLIENTE] {c.pendiente}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="fabrica-cta" className="border-t border-line bg-surface py-16 md:py-24">
        <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="fabrica-cta" className="display max-w-[20ch] text-h1 text-text">
            Lleva tu proyecto de los planos a la obra.
          </h2>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
