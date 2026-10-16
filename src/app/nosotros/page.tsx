import type { ReactNode } from "react";
import { Calculator, Factory, UserCheck } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { FOUNDED_YEAR } from "@/lib/site";
import { getTimeFacts } from "@/lib/years";

export const metadata = buildMetadata({
  title: "Nosotros: fabricantes e instaladores desde 1979",
  description:
    "Ico Alum es una empresa 100% mexicana, fundada en 1979, que fabrica e instala cancelería, PVC, cristal templado y fachadas desde su fábrica propia en Zapopan.",
  path: "/nosotros",
});

const values = [
  {
    icon: Factory,
    titulo: "Fabricamos lo que instalamos",
    texto: "La misma empresa corta, arma y coloca. Lo que sale de la fábrica llega a la obra con quien lo hizo.",
  },
  {
    icon: Calculator,
    titulo: "Calculamos antes de fabricar",
    texto: "Perfiles, cristal y anclajes se definen con cálculo estructural antes de cortar la primera pieza.",
  },
  {
    icon: UserCheck,
    titulo: "Un solo responsable de fábrica a obra",
    texto: "Una sola empresa responde por el proyecto completo, sin saltos entre proveedor e instalador.",
  },
] as const;

function TimelineRow({
  year,
  title,
  children,
}: {
  year: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-6 md:py-10">
      <p className="display text-h1 text-text md:col-span-4">{year}</p>
      <div className="md:col-span-8">
        <h3 className="display text-h3 text-navy">{title}</h3>
        <div className="mt-3 max-w-[52ch] text-body text-text-2">{children}</div>
      </div>
    </li>
  );
}

export default async function NosotrosPage() {
  const { year, yearsInBusiness } = await getTimeFacts();

  return (
    <>
      <PageHeader
        title="Fabricamos lo que instalamos, desde 1979."
        size="h1"
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]}
        intro="Somos una empresa 100% mexicana. Fabricantes directos e instaladores, con fábrica propia en Zapopan."
      />

      <Section tone="bg" aria-labelledby="historia-titulo">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 id="historia-titulo" className="display max-w-[12ch] text-h1 text-text">
                Nuestra historia.
              </h2>
              <p className="mt-5 max-w-[34ch] text-body text-text-2">
                De {FOUNDED_YEAR} a hoy, solo con los hitos que podemos confirmar.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <Frame
                src="/obra/fachada-comercial-cristal.jpg"
                alt="Agencia comercial con una fachada larga de cristal"
                ratio="16/9"
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="mb-10 md:mb-14"
              />
              <ol className="border-b border-line">
                <TimelineRow year={String(FOUNDED_YEAR)} title="Se funda Ico Alum">
                  <p>Nace la empresa que hoy fabrica e instala cancelería, PVC, cristal templado y fachadas.</p>
                </TimelineRow>
                <li className="border-t border-line py-8 md:py-10">
                  <p className="text-body text-text-2">[PENDIENTE CLIENTE] hitos intermedios entre {FOUNDED_YEAR} y 2024</p>
                </li>
                <TimelineRow year="2024" title="45 aniversario">
                  <p>Cumplimos 45 años fabricando e instalando.</p>
                </TimelineRow>
                <TimelineRow year={String(year)} title="Hoy">
                  <p>
                    {yearsInBusiness} años de trayectoria, fábrica propia en Puerto Márquez 3-A, Zapopan, y
                    proyectos con arquitectos, desarrolladores y constructoras.
                  </p>
                </TimelineRow>
              </ol>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="como-titulo">
        <Reveal>
          <h2 id="como-titulo" className="display max-w-[18ch] text-h1 text-text">
            Cómo trabajamos.
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {values.map(({ icon: Icon, titulo, texto }) => (
            <li key={titulo} className="border-t border-navy pt-6">
              <Icon aria-hidden weight="light" size={40} className="text-navy" />
              <h3 className="display mt-5 max-w-[16ch] text-h3 text-navy">{titulo}</h3>
              <p className="mt-3 max-w-[38ch] text-body text-text-2">{texto}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="bg" aria-labelledby="equipo-titulo">
        <div className="grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 id="equipo-titulo" className="display max-w-[14ch] text-h1 text-text md:col-span-5">
            El equipo.
          </h2>
          <p className="max-w-[44ch] text-body text-text-2 md:col-span-5 md:col-start-8 md:self-end">
            [PENDIENTE CLIENTE] presentar al equipo: nombres, cargos y fotografías confirmados por el cliente.
          </p>
        </div>
        <div className="mt-10 md:mt-14">
          <Frame ratio="16/9" pendiente="foto del equipo de Ico Alum" sizes="100vw" />
        </div>
      </Section>

      <section aria-labelledby="nosotros-cta" className="border-t border-line bg-surface py-16 md:py-24">
        <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="nosotros-cta" className="display max-w-[18ch] text-h1 text-text">
            Cuéntanos qué vas a construir.
          </h2>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
