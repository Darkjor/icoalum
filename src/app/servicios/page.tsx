import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { ServiceImage } from "@/components/services/ServiceImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getService, type Service } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Servicios de cancelería, PVC y cristal templado",
  description:
    "Cristal templado, ventanería PVC, cancelería de aluminio, cristales térmicos y acústicos y cálculo estructural: cinco líneas fabricadas por Ico Alum en Zapopan.",
  path: "/servicios",
});

function must(slug: string): Service {
  const s = getService(slug);
  if (!s) throw new Error(`Servicio inexistente: ${slug}`);
  return s;
}

function sistemasLinea(s: Service) {
  return s.sistemas.map((x) => x.nombre).join(", ");
}

function VerServicio({ s }: { s: Service }) {
  return (
    <Link
      href={`/servicios/${s.slug}`}
      className="group/link mt-6 inline-flex items-center gap-3 text-body font-medium text-vino"
    >
      <span className="underline-offset-4 group-hover/link:underline">Ver {s.nombre.toLowerCase()}</span>
      <ArrowRight
        aria-hidden
        weight="light"
        size={24}
        className="transition-transform duration-300 group-hover/link:translate-x-1.5 motion-reduce:transition-none"
      />
    </Link>
  );
}

/** Texto de un servicio: nombre, resumen, sistemas y enlace. */
function ServiceText({ s, titleClass = "text-h2" }: { s: Service; titleClass?: string }) {
  return (
    <div>
      <h2 className={`display text-text ${titleClass}`}>
        <Link href={`/servicios/${s.slug}`} className="hover:text-vino">
          {s.nombre}
        </Link>
      </h2>
      <p className="mt-4 max-w-[44ch] text-body text-text-2">{s.resumen}</p>
      <p className="mt-4 max-w-[44ch] text-body-sm text-text-2">
        <span className="font-medium text-text">Sistemas:</span> {sistemasLinea(s)}
      </p>
      <VerServicio s={s} />
    </div>
  );
}

function ImageLink({ s, children }: { s: Service; children: ReactNode }) {
  return (
    <Link href={`/servicios/${s.slug}`} tabIndex={-1} aria-hidden className="group block">
      {children}
    </Link>
  );
}

export default function ServiciosPage() {
  const templado = must("cristal-templado");
  const pvc = must("ventaneria-pvc");
  const aluminio = must("canceleria-aluminio");
  const eficientes = must("cristales-eficientes");
  const calculo = must("calculo-estructural");

  return (
    <>
      <PageHeader
        title="Servicios"
        intro="Cinco líneas que salen de una sola fábrica en Zapopan, con el mismo equipo desde el cálculo hasta la instalación."
      />

      <Section tone="bg" className="!py-16 md:!py-24" aria-labelledby="pagina-titulo">
        <div className="flex flex-col gap-24 md:gap-32 lg:gap-40">
          {/* Cristal templado: imagen ancha a la izquierda, texto al pie */}
          <Reveal>
            <article className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-6">
              <div className="md:col-span-8">
                <ImageLink s={templado}>
                  <ServiceImage service={templado} ratio={templado.ratioHub} sizes="(min-width: 768px) 66vw, 100vw" />
                </ImageLink>
              </div>
              <div className="md:col-span-4">
                <ServiceText s={templado} />
              </div>
            </article>
          </Reveal>

          {/* Ventanería PVC: texto a la izquierda, imagen vertical a la derecha */}
          <Reveal>
            <article className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center md:gap-6">
              <div className="md:order-1 md:col-span-5 md:pr-8">
                <ServiceText s={pvc} />
              </div>
              <div className="md:order-2 md:col-span-5 md:col-start-8">
                <ImageLink s={pvc}>
                  <ServiceImage service={pvc} ratio={pvc.ratioHub} from="right" sizes="(min-width: 768px) 42vw, 100vw" />
                </ImageLink>
              </div>
            </article>
          </Reveal>

          {/* Cancelería: panorámica, texto en dos columnas debajo */}
          <Reveal>
            <article>
              <ImageLink s={aluminio}>
                <ServiceImage service={aluminio} ratio={aluminio.ratioHub} sizes="100vw" />
              </ImageLink>
              <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-12 md:gap-6">
                <div className="md:col-span-5">
                  <h2 className="display text-h1 text-text">
                    <Link href={`/servicios/${aluminio.slug}`} className="hover:text-vino">
                      {aluminio.nombre}
                    </Link>
                  </h2>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <p className="max-w-[44ch] text-body text-text-2">{aluminio.resumen}</p>
                  <p className="mt-4 max-w-[44ch] text-body-sm text-text-2">
                    <span className="font-medium text-text">Sistemas:</span> {sistemasLinea(aluminio)}
                  </p>
                  <VerServicio s={aluminio} />
                </div>
              </div>
            </article>
          </Reveal>

          {/* Cristales eficientes y cálculo: pareja asimétrica */}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
            <Reveal className="md:col-span-5">
              <article>
                <ImageLink s={eficientes}>
                  <ServiceImage service={eficientes} ratio="1/1" sizes="(min-width: 768px) 42vw, 100vw" />
                </ImageLink>
                <div className="mt-6">
                  <ServiceText s={eficientes} titleClass="text-h3" />
                </div>
              </article>
            </Reveal>
            <Reveal className="md:col-span-6 md:col-start-7 md:mt-32">
              <article>
                <ImageLink s={calculo}>
                  <ServiceImage service={calculo} ratio="16/10" from="right" sizes="(min-width: 768px) 50vw, 100vw" />
                </ImageLink>
                <div className="mt-6">
                  <ServiceText s={calculo} titleClass="text-h3" />
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </Section>

      <section aria-labelledby="servicios-cta" className="border-t border-line bg-surface py-16 md:py-24">
        <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="servicios-cta" className="display max-w-[18ch] text-h1 text-text">
            Cuéntanos qué vas a construir.
          </h2>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
