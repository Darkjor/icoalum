"use client";

import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { serviceNames } from "@/lib/routes";
import { site, whatsappUrl } from "@/lib/site";

function messageFor(pathname: string) {
  if (pathname.startsWith("/servicios/")) {
    const service = serviceNames[pathname.split("/")[2] ?? ""];
    if (service) return `Hola, quiero cotizar ${service} con Ico Alum.`;
  }
  if (pathname.startsWith("/proyectos")) {
    return "Hola, vi sus proyectos y quiero cotizar uno con Ico Alum.";
  }
  if (pathname.startsWith("/contacto") || pathname.startsWith("/cotizar")) {
    return "Hola, quiero cotizar un proyecto con Ico Alum.";
  }
  return "Hola, quiero cotizar un proyecto con Ico Alum.";
}

/** Boton flotante. No se renderiza mientras `site.whatsapp` este vacio. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  if (!site.whatsapp) return null;

  return (
    <a
      href={whatsappUrl(messageFor(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp (se abre en una pestaña nueva)"
      onClick={() => track("click_whatsapp", { pagina: pathname })}
      className="fixed bottom-4 right-4 z-30 inline-flex h-14 items-center gap-2 border border-navy bg-surface px-4 text-body-sm font-medium text-navy transition-colors duration-150 hover:bg-surface-2 active:translate-y-px md:bottom-6 md:right-6"
    >
      <WhatsappLogo aria-hidden weight="light" size={28} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
