import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ServiceImage } from "@/components/services/ServiceImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { projects } from "@/data/projects";
import { getService, services } from "@/data/services";
import { buildMetadata, jsonLdString, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return buildMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/servicios/${s.slug}`,
  });
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  // Proyectos relacionados: primero los tipos afines al servicio, luego el resto, hasta 3.
  const afines = projects.filter((p) => s.tiposRelacionados.includes(p.tipo));
  const resto = projects.filter((p) => !s.tiposRelacionados.includes(p.tipo));
  const relacionados = [...afines, ...resto].slice(0, 3);
  const hayPendientes = relacionados.some((p) => p.pendiente);

  const jsonLd = serviceJsonLd({
    slug: s.slug,
    nombre: s.nombre,
    descripcion: s.metaDescription,
    tipo: s.keyword,
  });

  return (
    <>
      <PageHeader
        title={s.titular}
        size="h1"
        crumbs={[{ label: "Servicios", href: "/servicios" }, { label: s.nombre }]}
        intro={s.resumen}
      />

      {/* Introducción con imagen */}
      <Section tone="bg" aria-labelledby="intro-titulo" className="!pb-16 md:!pb-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <ServiceImage service={s} ratio="7/5" />
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <Reveal>
              <h2 id="intro-titulo" className="display text-h2 text-text">
                {s.nombre}, de fábrica a obra
              </h2>
              <div className="mt-6 space-y-5 text-lead text-text-2">
                {s.intro.map((p) => (
                  <p key={p} className="measure">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Para qué proyectos: lista con filetes, título fijo a la izquierda */}
      <Section tone="surface" aria-labelledby="para-que-titulo">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>Aplicaciones</Eyebrow>
              <h2 id="para-que-titulo" className="display mt-5 text-h1 text-text">
                Para qué proyectos
              </h2>
            </div>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {s.paraQue.map((x) => (
              <li
                key={x.titulo}
                className="grid grid-cols-1 gap-2 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-6"
              >
                <h3 className="display text-h3 text-navy md:col-span-5">{x.titulo}</h3>
                <p className="text-body text-text-2 md:col-span-7">{x.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Sistemas: marcas como nombres, no tarjetas */}
      <Section tone="bg" aria-labelledby="sistemas-titulo">
        <Reveal>
          <h2 id="sistemas-titulo" className="display max-w-[16ch] text-h1 text-text">
            {s.sistemasTitulo}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lead text-text-2">{s.sistemasIntro}</p>
        </Reveal>
        <ul className="mt-12 border-b border-line md:mt-16">
          {s.sistemas.map((x) => (
            <li
              key={x.nombre}
              className="grid grid-cols-1 gap-2 border-t border-line py-6 md:grid-cols-12 md:items-baseline md:gap-6 md:py-8"
            >
              <p className="display text-h2 text-text md:col-span-7">{x.nombre}</p>
              <p className="text-body text-text-2 md:col-span-5">{x.nota}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Beneficios con ícono */}
      <Section tone="surface" aria-labelledby="beneficios-titulo">
        <h2 id="beneficios-titulo" className="display max-w-[20ch] text-h1 text-text">
          Lo que gana quien proyecta
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-3">
          {s.beneficios.map((b) => {
            const Icono = b.icono;
            return (
              <li key={b.titulo} className="border-t border-navy pt-6">
                <Icono aria-hidden weight="light" size={40} className="text-navy" />
                <h3 className="display mt-6 text-h3 text-navy">{b.titulo}</h3>
                <p className="mt-3 max-w-[40ch] text-body text-text-2">{b.texto}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Proyectos relacionados */}
      <Section tone="bg" aria-labelledby="relacionados-titulo">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="relacionados-titulo" className="display max-w-[16ch] text-h1 text-text">
            Obra relacionada
          </h2>
          <Link
            href="/proyectos"
            className="group/link inline-flex items-center gap-3 text-body font-medium text-vino"
          >
            <span className="underline-offset-4 group-hover/link:underline">Ver todos los proyectos</span>
            <ArrowRight
              aria-hidden
              weight="light"
              size={24}
              className="transition-transform duration-300 group-hover/link:translate-x-1.5 motion-reduce:transition-none"
            />
          </Link>
        </div>
        {hayPendientes ? (
          <p className="mt-6 max-w-[60ch] text-body-sm text-text-2">
            Fotografías provisionales del archivo del cliente; nombres, ubicaciones y sistemas por confirmar.
          </p>
        ) : null}
        <ul className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-14 md:mt-16 md:grid-cols-12">
          {relacionados.map((p, i) => (
            <li
              key={p.slug}
              className={["md:col-span-4", "md:col-span-4 md:mt-16", "md:col-span-4 md:mt-32"][i]}
            >
              <ProjectCard
                project={p}
                from={i % 2 === 0 ? "left" : "right"}
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA final */}
      <section aria-labelledby="cta-servicio" className="border-t border-line bg-surface py-20 md:py-28">
        <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="cta-servicio" className="display max-w-[18ch] text-h1 text-text">
              Cuéntanos tu proyecto de {s.nombre.toLowerCase()}.
            </h2>
            <p className="mt-6 max-w-[44ch] text-lead text-text-2">
              Con los planos o con la idea, te respondemos con una cotización.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`/cotizar?servicio=${s.slug}`}>Cotizar proyecto</Button>
            <Button href="/servicios" variant="secondary">
              Todos los servicios
            </Button>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
    </>
  );
}
