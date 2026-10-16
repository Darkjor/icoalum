import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

// Sin lastModified: no hay fecha real por pagina y un `new Date()` seria un dato inventado.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    changeFrequency,
    priority,
  }));
}
