import type { Metadata } from "next";
import { site } from "./site";

type Input = { title: string; description: string; path: string };

/** Metadata por pagina: titulo (con plantilla del layout), canonica, OG y Twitter. */
export function buildMetadata({ title, description, path }: Input): Metadata {
  const url = path === "/" ? "/" : path.replace(/\/$/, "");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "es_MX",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}

/** Ciudades y estado que atiende la empresa (misma cobertura que el JSON-LD global). */
export const areaServed = [
  { "@type": "City", name: "Guadalajara" },
  { "@type": "City", name: "Zapopan" },
  { "@type": "State", name: "Jalisco" },
];

/** Serializa JSON-LD para `<script type="application/ld+json">` sin cerrar el script por accidente. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\u003c");
}

export function serviceJsonLd(input: { slug: string; nombre: string; descripcion: string; tipo: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.nombre,
    serviceType: input.tipo,
    description: input.descripcion,
    url: `${site.url}/servicios/${input.slug}`,
    provider: { "@type": "HomeAndConstructionBusiness", "@id": `${site.url}/#empresa`, name: site.name },
    areaServed,
  };
}
