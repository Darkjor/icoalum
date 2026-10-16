import { Clock, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapEmbed } from "@/components/MapEmbed";
import { TrackLink } from "@/components/TrackLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contacto",
  description:
    "Escríbenos o llámanos: Ico Alum, Puerto Márquez 3-A, Col. Miramar, Zapopan, Jalisco. Teléfono, correos y formulario de contacto.",
  path: "/contacto",
});

const linkClass = "text-navy underline-offset-4 hover:underline";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-4 border-t border-line py-6">
      <span className="text-navy">{icon}</span>
      <div>
        <dt className="text-body-sm font-medium uppercase tracking-[0.1em] text-text-2">{label}</dt>
        <dd className="mt-2 text-body text-text">{children}</dd>
      </div>
    </div>
  );
}

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        title="Contacto"
        intro="Escríbenos, llámanos o visítanos en la fábrica. Si ya tienes planos, empieza por la cotización."
      />

      <Section tone="bg" aria-labelledby="pagina-titulo" className="!py-16 md:!py-24">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="display text-h3 text-text">Datos de contacto</h2>
            <dl className="mt-6">
              <Row icon={<MapPin aria-hidden weight="light" size={28} />} label="Dirección">
                <address className="not-italic">{fullAddress}</address>
              </Row>
              <Row icon={<Phone aria-hidden weight="light" size={28} />} label="Teléfono">
                <TrackLink
                  href={`tel:${site.phone.tel}`}
                  event="click_telefono"
                  className={`${linkClass} inline-flex min-h-11 items-center`}
                >
                  {site.phone.display}
                </TrackLink>
              </Row>
              <Row icon={<EnvelopeSimple aria-hidden weight="light" size={28} />} label="Correos">
                <ul className="flex flex-col">
                  {site.emails.map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className={`${linkClass} inline-flex min-h-11 items-center`}>
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </Row>
              <Row icon={<Clock aria-hidden weight="light" size={28} />} label="Horarios">
                [PENDIENTE CLIENTE] horarios de atención
              </Row>
              <div className="border-t border-line" />
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="display text-h3 text-text">Escríbenos</h2>
            <p className="mt-3 max-w-[44ch] text-body text-text-2">
              Cuéntanos qué necesitas y te respondemos por correo.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <section aria-labelledby="mapa-titulo" className="border-t border-line bg-surface py-16 md:py-24">
        <Container>
          <h2 id="mapa-titulo" className="display mb-8 max-w-[20ch] text-h2 text-text md:mb-10">
            Así llegas a la fábrica.
          </h2>
          <MapEmbed />
        </Container>
      </section>

      <section aria-labelledby="planos-titulo" className="bg-bg py-16 md:py-24">
        <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="planos-titulo" className="display max-w-[22ch] text-h2 text-text">
              ¿Tienes planos de tu proyecto?
            </h2>
            <p className="mt-4 max-w-[48ch] text-body text-text-2">
              Para obras con planos, la cotización es el camino más directo: ahí nos das los detalles
              del proyecto.
            </p>
          </div>
          <Button href="/cotizar">Cotizar proyecto</Button>
        </Container>
      </section>
    </>
  );
}
