import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TrackLink } from "@/components/TrackLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/lib/routes";
import { fullAddress, mapEmbedUrl, site } from "@/lib/site";
import { getTimeFacts } from "@/lib/years";

const heading = "text-body-sm font-medium uppercase tracking-[0.14em] text-on-deep-2";
const link =
  "inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:text-amber hover:underline";

export async function Footer() {
  const { year, yearsInBusiness } = await getTimeFacts();
  const { address } = site;

  return (
    <footer className="on-dark border-t-[3px] border-amber bg-navy-deep text-on-deep">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-[34ch] text-body text-on-deep-2">
              Cancelería de aluminio, PVC, cristal templado y fachadas. Fabricamos e instalamos
              en Zapopan desde {site.founded}, {yearsInBusiness} años de oficio.
            </p>
            <Button
              href="/cotizar"
              track={{ event: "cta_cotizar", data: { ubicacion: "footer" } }}
              variant="primaryOnDark"
              className="mt-8"
            >
              Cotizar proyecto
            </Button>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className={heading}>Contacto</h2>
              <address className="mt-4 flex flex-col not-italic">
                <p className="flex gap-2 py-2 text-body text-on-deep">
                  <MapPin aria-hidden weight="light" size={22} className="mt-0.5 shrink-0" />
                  <span>
                    {address.street}
                    <br />
                    {address.colony}
                    <br />
                    {address.postalCode} {address.city}, {address.region}
                  </span>
                </p>
                <TrackLink
                  href={`tel:${site.phone.tel}`}
                  event="click_telefono"
                  data={{ ubicacion: "footer" }}
                  className={link}
                >
                  <Phone aria-hidden weight="light" size={22} />
                  {site.phone.display}
                </TrackLink>
                {site.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className={link}>
                    <EnvelopeSimple aria-hidden weight="light" size={22} />
                    {email}
                  </a>
                ))}
              </address>
            </div>

            <nav aria-label="Pie de página">
              <h2 className={heading}>Sitio</h2>
              <ul className="mt-4 flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/cotizar" className={link}>
                    Cotizar proyecto
                  </Link>
                </li>
              </ul>
            </nav>

            {site.social.length > 0 ? (
              <div>
                <h2 className={heading}>Redes</h2>
                <ul className="mt-4 flex flex-col">
                  {site.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 border border-on-deep/25 p-2">
          <iframe
            title={`Mapa de la ubicación de ${site.name}: ${fullAddress}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-64 w-full border-0 md:h-80"
          />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-on-deep/25 pt-6 text-body-sm text-on-deep-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}
          </p>
          <Link href="/legal" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-amber hover:underline">
            Aviso de privacidad y legal
          </Link>
        </div>
      </Container>
    </footer>
  );
}
