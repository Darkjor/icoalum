import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Frame } from "@/components/ui/Frame";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { getNeighbors, getProject, projects, type ProjectImage } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

const P = "[PENDIENTE CLIENTE]";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const meta = buildMetadata({
    title: `${p.nombre}, proyecto ${p.tipo.toLowerCase()}`,
    description: p.pendiente
      ? `Proyecto ${p.tipo.toLowerCase()} de Ico Alum. Ficha en preparación: se publicará con datos y fotos reales de la obra.`
      : `${p.nombre}: proyecto ${p.tipo.toLowerCase()} en ${p.ubicacion}. Cancelería, cristal y fachadas fabricadas e instaladas por Ico Alum.`,
    path: `/proyectos/${p.slug}`,
  });
  // Los marcadores no deben indexarse: solo las obras reales.
  return p.pendiente ? { ...meta, robots: { index: false, follow: true } } : meta;
}

function GalleryImage({
  img,
  index,
  sizes,
}: {
  img: ProjectImage;
  index: number;
  sizes: string;
}) {
  return (
    <Frame>
      <PaneReveal tone="bg" from={index % 2 === 0 ? "left" : "right"}>
        {img.src ? (
          <div className="relative w-full" style={{ aspectRatio: img.ratio.replace("/", " / ") }}>
            <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover" />
          </div>
        ) : (
          <Placeholder ratio={img.ratio} label={img.pendiente} />
        )}
      </PaneReveal>
    </Frame>
  );
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const neighbors = getNeighbors(p.slug);
  const [principal, ...resto] = p.galeria;

  const datos: { etiqueta: string; valor: string }[] = [
    { etiqueta: "Tipo", valor: p.tipo },
    { etiqueta: "Ubicación", valor: p.ubicacion },
    { etiqueta: "Año", valor: p.anio ? String(p.anio) : `${P} año de la obra` },
    {
      etiqueta: "Sistemas usados",
      valor: p.sistemas.length > 0 ? p.sistemas.join(", ") : `${P} sistemas y marcas utilizados`,
    },
  ];

  return (
    <>
      <PageHeader
        title={p.nombre}
        size="h1"
        crumbs={[{ label: "Proyectos", href: "/proyectos" }, { label: p.nombre }]}
      />

      {/* Ficha: datos y descripción */}
      <Section tone="bg" aria-labelledby="ficha-titulo" className="!pb-12 md:!pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {principal ? <GalleryImage img={principal} index={0} sizes="(min-width: 1024px) 58vw, 100vw" /> : null}
          </div>
          <div className="lg:col-span-5">
            <h2 id="ficha-titulo" className="display text-h2 text-text">
              Ficha de la obra
            </h2>
            <dl className="mt-8 border-t border-line">
              {datos.map((d) => (
                <div
                  key={d.etiqueta}
                  className="grid grid-cols-1 gap-1 border-b border-line py-4 sm:grid-cols-12 sm:gap-4"
                >
                  <dt className="text-body-sm font-medium uppercase tracking-[0.14em] text-text-2 sm:col-span-4">
                    {d.etiqueta}
                  </dt>
                  <dd className="text-body text-text sm:col-span-8">{d.valor}</dd>
                </div>
              ))}
            </dl>
            <p className="measure mt-8 text-lead text-text-2">{p.descripcion}</p>
          </div>
        </div>
      </Section>

      {/* Galería: detalle y vista interior en dos proporciones distintas */}
      {resto.length > 0 ? (
        <Section tone="surface" aria-labelledby="galeria-titulo" className="!py-16 md:!py-24">
          <h2 id="galeria-titulo" className="display text-h2 text-text">
            Galería
          </h2>
          <ul className="mt-10 grid grid-cols-1 items-start gap-x-6 gap-y-10 md:mt-14 md:grid-cols-12">
            {resto.map((img, i) => (
              <li
                key={img.pendiente}
                className={
                  ["md:col-span-4", "md:col-span-7 md:col-start-6 md:mt-20"][i % 2] ?? "md:col-span-6"
                }
              >
                <GalleryImage img={img} index={i + 1} sizes="(min-width: 768px) 55vw, 100vw" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Anterior y siguiente */}
      {neighbors ? (
        <nav aria-label="Más proyectos" className="border-t border-line bg-bg">
          <Container className="grid grid-cols-1 md:grid-cols-2">
            <Link
              href={`/proyectos/${neighbors.prev.slug}`}
              className="group flex items-center gap-4 border-b border-line py-8 md:border-b-0 md:border-r md:pr-8"
            >
              <ArrowLeft
                aria-hidden
                weight="light"
                size={32}
                className="shrink-0 text-navy transition-transform duration-300 group-hover:-translate-x-1.5 motion-reduce:transition-none"
              />
              <span>
                <span className="block text-body-sm text-text-2">Proyecto anterior</span>
                <span className="display block text-h3 text-text group-hover:text-navy">
                  {neighbors.prev.nombre}
                </span>
              </span>
            </Link>
            <Link
              href={`/proyectos/${neighbors.next.slug}`}
              className="group flex items-center justify-between gap-4 py-8 md:pl-8 md:text-right"
            >
              <span className="md:ml-auto">
                <span className="block text-body-sm text-text-2">Proyecto siguiente</span>
                <span className="display block text-h3 text-text group-hover:text-navy">
                  {neighbors.next.nombre}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                weight="light"
                size={32}
                className="shrink-0 text-navy transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none"
              />
            </Link>
          </Container>
        </nav>
      ) : null}

      {/* CTA final */}
      <section aria-labelledby="cta-proyecto" className="border-t border-line bg-surface py-20 md:py-28">
        <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="cta-proyecto" className="display max-w-[18ch] text-h1 text-text">
              ¿Tu obra es la siguiente?
            </h2>
            <p className="mt-6 max-w-[44ch] text-lead text-text-2">
              Cuéntanos qué vas a construir y te respondemos con una cotización.
            </p>
          </div>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
