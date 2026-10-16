import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { routes } from "@/lib/routes";
import { services } from "@/data/services";
import { site } from "@/lib/site";

// Sin lastModified: no hay fecha real por pagina y un `new Date()` seria un dato inventado.
export default function sitemap(): MetadataRoute.Sitemap {
  const fijas = routes.map(({ path, priority, changeFrequency }) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    changeFrequency,
    priority,
  }));

  // Servicios: las rutas ya estan en `routes`; se agregan solo las que falten (un servicio nuevo en services.ts).
  const yaEstan = new Set(routes.map((r) => r.path));
  const servicios = services
    .filter((s) => !yaEstan.has(`/servicios/${s.slug}`))
    .map((s) => ({
      url: `${site.url}/servicios/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Proyectos reales. Los marcadores (`pendiente: true`) llevan noindex y no entran al sitemap.
  const obras = projects
    .filter((p) => !p.pendiente)
    .map((p) => ({
      url: `${site.url}/proyectos/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  return [...fijas, ...servicios, ...obras];
}
