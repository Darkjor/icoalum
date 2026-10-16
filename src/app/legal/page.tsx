import { Warning } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Aviso de privacidad y política de cookies",
  description:
    "Aviso de privacidad y política de cookies de Ico Alum: cómo tratamos tus datos personales, para qué los usamos y cómo ejercer tus derechos ARCO.",
  path: "/legal",
});

const indice = [
  {
    href: "#privacidad",
    label: "Aviso de privacidad",
    hijos: [
      { href: "#responsable", label: "Responsable" },
      { href: "#datos", label: "Datos que recabamos" },
      { href: "#finalidades", label: "Finalidades" },
      { href: "#transferencias", label: "Transferencias" },
      { href: "#arco", label: "Derechos ARCO" },
      { href: "#cambios", label: "Cambios al aviso" },
    ],
  },
  {
    href: "#cookies",
    label: "Política de cookies",
    hijos: [
      { href: "#cookies-que", label: "Qué guardamos" },
      { href: "#cookies-analitica", label: "Analítica" },
      { href: "#cookies-decision", label: "Tu decisión" },
    ],
  },
] as const;

const h2Class = "display scroll-mt-28 text-h1 text-text";
const h3Class = "display mt-12 scroll-mt-28 text-h3 text-text";
const pClass = "mt-4 text-body text-text-2";
const linkClass = "text-navy underline-offset-4 hover:underline";

function Item({ children }: { children: ReactNode }) {
  return <li className="mt-2 pl-1">{children}</li>;
}

export default function LegalPage() {
  return (
    <>
      <PageHeader
        title="Aviso de privacidad y política de cookies"
        size="h1"
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Legal" }]}
      />

      <Section tone="bg" aria-labelledby="pagina-titulo" className="!py-14 md:!py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <nav aria-label="Índice de esta página" className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-body-sm font-medium uppercase tracking-[0.1em] text-text-2">En esta página</p>
              <ul className="mt-4 border-t border-text">
                {indice.map((s) => (
                  <li key={s.href} className="border-b border-line py-4">
                    <a href={s.href} className="text-body font-medium text-navy underline-offset-4 hover:underline">
                      {s.label}
                    </a>
                    <ul className="mt-2 flex flex-col">
                      {s.hijos.map((h) => (
                        <li key={h.href}>
                          <a
                            href={h.href}
                            className="inline-flex min-h-9 items-center text-body-sm text-text-2 underline-offset-4 hover:text-navy hover:underline"
                          >
                            {h.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-[65ch] lg:col-span-9">
            <div role="note" className="flex gap-4 border-2 border-text bg-surface p-5">
              <Warning aria-hidden weight="light" size={32} className="mt-0.5 shrink-0 text-navy" />
              <p className="text-body font-medium text-text">
                [PENDIENTE CLIENTE] revisar con asesor legal antes de publicar. Este texto es un borrador
                de trabajo y no es el aviso definitivo.
              </p>
            </div>
            <p className="mt-6 text-body-sm text-text-2">
              Última actualización: [PENDIENTE CLIENTE] fecha de publicación
            </p>

            <section id="privacidad" aria-labelledby="privacidad-titulo" className="mt-14 scroll-mt-28">
              <h2 id="privacidad-titulo" className={h2Class}>
                Aviso de privacidad
              </h2>
              <p className={pClass}>
                Este aviso explica cómo {site.legalName} trata los datos personales que recibe a través de
                este sitio, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
                Particulares.
              </p>

              <h3 id="responsable" className={h3Class}>
                Responsable
              </h3>
              <p className={pClass}>
                El responsable del tratamiento de tus datos personales es {site.legalName} (nombre comercial
                {" "}{site.name}), con domicilio en {fullAddress}, México.
              </p>

              <h3 id="datos" className={h3Class}>
                Datos que recabamos
              </h3>
              <p className={pClass}>Cuando nos escribes o pides una cotización, podemos recibir:</p>
              <ul className="mt-2 list-disc pl-6 text-body text-text-2">
                <Item>Nombre.</Item>
                <Item>Correo electrónico.</Item>
                <Item>Teléfono.</Item>
                <Item>El mensaje o la descripción del proyecto que decidas compartir.</Item>
              </ul>
              <p className={pClass}>No solicitamos datos personales sensibles.</p>

              <h3 id="finalidades" className={h3Class}>
                Finalidades
              </h3>
              <p className={pClass}>Usamos tus datos para:</p>
              <ul className="mt-2 list-disc pl-6 text-body text-text-2">
                <Item>Responder tus solicitudes de cotización.</Item>
                <Item>Atender los mensajes que nos envías por el formulario de contacto, correo o teléfono.</Item>
                <Item>Dar seguimiento a la conversación sobre tu proyecto.</Item>
              </ul>
              <p className={pClass}>
                No usamos tus datos para finalidades distintas a las anteriores. [PENDIENTE CLIENTE]
                confirmar si habrá finalidades secundarias, como boletines o publicidad.
              </p>

              <h3 id="transferencias" className={h3Class}>
                Transferencias
              </h3>
              <p className={pClass}>
                No vendemos tus datos personales. Podemos apoyarnos en proveedores tecnológicos (por
                ejemplo, de correo y almacenamiento) para operar el sitio, quienes los tratan solo para ese
                fin. [PENDIENTE CLIENTE] listar los proveedores y confirmar si existen transferencias.
              </p>

              <h3 id="arco" className={h3Class}>
                Derechos ARCO
              </h3>
              <p className={pClass}>
                Tienes derecho a Acceder a tus datos, Rectificarlos, Cancelarlos u Oponerte a su uso. Para
                ejercerlos, envía una solicitud al domicilio del responsable o por correo, con:
              </p>
              <ul className="mt-2 list-disc pl-6 text-body text-text-2">
                <Item>Tu nombre y un medio para responderte.</Item>
                <Item>Una descripción clara del derecho que quieres ejercer y de los datos involucrados.</Item>
                <Item>Un documento que acredite tu identidad.</Item>
              </ul>
              <p className={pClass}>
                [PENDIENTE CLIENTE] confirmar el correo designado para solicitudes ARCO y el área
                responsable. Mientras tanto, también puedes escribirnos desde la página de{" "}
                <Link href="/contacto" className={linkClass}>
                  contacto
                </Link>
                . Responderemos en los plazos que establece la ley. También puedes revocar tu
                consentimiento o limitar el uso de tus datos con el mismo procedimiento.
              </p>

              <h3 id="cambios" className={h3Class}>
                Cambios al aviso
              </h3>
              <p className={pClass}>
                Si este aviso cambia, publicaremos la versión actualizada en esta misma página.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-titulo" className="mt-20 scroll-mt-28 border-t border-line pt-14">
              <h2 id="cookies-titulo" className={h2Class}>
                Política de cookies
              </h2>
              <p className={pClass}>
                Las cookies y el almacenamiento local son pequeños archivos o datos que el sitio guarda en
                tu navegador. Aquí explicamos cuáles usamos.
              </p>

              <h3 id="cookies-que" className={h3Class}>
                Qué guardamos
              </h3>
              <ul className="mt-4 list-disc pl-6 text-body text-text-2">
                <Item>
                  <span className="font-medium text-text">ico-consent:</span> guarda en tu navegador (almacenamiento
                  local) si aceptaste o rechazaste la analítica. Sirve solo para recordar tu decisión y no
                  te identifica.
                </Item>
              </ul>
              <p className={pClass}>
                El mapa de la página de contacto es un contenido de Google y puede establecer sus propias
                cookies al cargarse. [PENDIENTE CLIENTE] confirmar con el asesor legal el alcance de este
                punto.
              </p>

              <h3 id="cookies-analitica" className={h3Class}>
                Analítica
              </h3>
              <p className={pClass}>
                Medimos el uso del sitio con una herramienta de analítica (Google Analytics). Solo se carga
                si aceptas las cookies; si las rechazas o no respondes, no se carga.
              </p>

              <h3 id="cookies-decision" className={h3Class}>
                Tu decisión
              </h3>
              <p className={pClass}>
                Puedes cambiar de opinión cuando quieras: borra los datos del sitio en la configuración de
                tu navegador y te volveremos a preguntar en tu siguiente visita.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </>
  );
}
