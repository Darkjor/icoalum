import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { HideWindowScroll } from "./HideWindowScroll";

export const hideWindowTitle = "Hide Window: la ventilación que no se ve.";

/** [PENDIENTE CLIENTE] cuerpo de cada momento: explicar el mecanismo con datos del cliente. */
export const hideWindowMoments = [
  { titulo: "La fachada completa", cuerpo: "[PENDIENTE CLIENTE] explicar el mecanismo" },
  { titulo: "La ventilación, integrada", cuerpo: "[PENDIENTE CLIENTE] explicar el mecanismo" },
  { titulo: "El detalle", cuerpo: "[PENDIENTE CLIENTE] explicar el mecanismo" },
] as const;

/**
 * Hide Window. Con movimiento permitido: contenedor sticky de ~300vh ligado al scroll
 * (HideWindowScroll). Con movimiento reducido: los 3 momentos apilados y estaticos.
 * Se alternan por CSS (motion-safe / motion-reduce) para no parpadear al hidratar.
 */
export function HideWindow({
  showCta = true,
  hero = false,
}: {
  /** Enlace "Conocer la innovacion" (se oculta en la propia pagina /innovacion). */
  showCta?: boolean;
  /** Primer bloque de la pagina: lleva `data-hero` y el titulo es el h1. */
  hero?: boolean;
} = {}) {
  const Title = hero ? "h1" : "h2";
  return (
    <section aria-label="Hide Window" data-hero={hero ? "" : undefined} className="on-dark bg-navy-deep text-photo">
      <div className="hidden motion-safe:block">
        <HideWindowScroll title={hideWindowTitle} moments={hideWindowMoments} showCta={showCta} titleAs={Title} />
      </div>

      <div className="motion-safe:hidden">
        <div className={`relative ${hero ? "min-h-[85dvh]" : "min-h-[60dvh]"}`}>
          <Image
            src="/obra/muro-cortina-interior.jpg"
            alt="Muro cortina de cristal con retícula visto desde el interior, con árboles al fondo"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden className="absolute inset-0 bg-navy-deep/60" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <Title className="display max-w-[22ch] text-h1 text-photo">{hideWindowTitle}</Title>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {hideWindowMoments.map((m) => (
              <li key={m.titulo} className="border-t border-amber/70 pt-6">
                <h3 className="display text-h3 text-photo">{m.titulo}</h3>
                <p className="mt-3 max-w-[40ch] text-body text-photo/85">{m.cuerpo}</p>
              </li>
            ))}
          </ol>
          {showCta ? (
            <Link href="/innovacion" className={buttonClasses("secondaryOnDark", "mt-12")}>
              Conocer la innovación
            </Link>
          ) : null}
        </Container>
      </div>
    </section>
  );
}
