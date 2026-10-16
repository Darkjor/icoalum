import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vista previa fuera del dominio real: se bloquea hasta fijar NEXT_PUBLIC_ALLOW_INDEXING=true
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
