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
