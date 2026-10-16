import Link from "next/link";
import { Placeholder } from "@/components/ui/Placeholder";
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
export function HideWindow() {
  return (
    <section aria-label="Hide Window" className="bg-ink text-photo">
      <div className="hidden motion-safe:block">
        <HideWindowScroll title={hideWindowTitle} moments={hideWindowMoments} />
      </div>

      <div className="motion-safe:hidden">
        <div className="relative">
          <Placeholder
            ratio="16/9"
            label="foto a sangre de la fachada con Hide Window"
            className="!min-h-[60dvh]"
            labelClassName="!bottom-auto !top-24 !text-photo/80"
          />
          <div aria-hidden className="absolute inset-0 bg-ink/55" />
          <Container className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <h2 className="display max-w-[22ch] text-h1 text-photo">{hideWindowTitle}</h2>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {hideWindowMoments.map((m) => (
              <li key={m.titulo} className="border-t border-photo/30 pt-6">
                <h3 className="display text-h3 text-photo">{m.titulo}</h3>
                <p className="mt-3 max-w-[40ch] text-body text-photo/85">{m.cuerpo}</p>
              </li>
            ))}
          </ol>
          <Link href="/innovacion" className={buttonClasses("onPhoto", "mt-12")}>
            Conocer la innovación
          </Link>
        </Container>
      </div>
    </section>
  );
}
