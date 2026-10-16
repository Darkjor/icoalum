import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // /cotizar recibe hasta 3 planos de 10 MB (+ campos y multipart). Por defecto son 1 MB.
  experimental: {
    serverActions: { bodySizeLimit: "32mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Vista previa fuera del dominio real: no indexar hasta fijar ALLOW_INDEXING=true
  async headers() {
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // 301 permanentes desde las URLs del sitio anterior
  async redirects() {
    const statusCode = 301 as const;
    return [
      { source: "/galerias", destination: "/proyectos", statusCode },
      { source: "/galerias/:path*", destination: "/proyectos", statusCode },
      { source: "/recursos", destination: "/fabrica", statusCode },
      { source: "/innovaciones", destination: "/innovacion", statusCode },
      { source: "/inicio", destination: "/", statusCode },
      {
        source: "/servicios/cancelería-aluminio",
        destination: "/servicios/canceleria-aluminio",
        statusCode,
      },
      {
        source: "/servicios/canceler%C3%ADa-aluminio",
        destination: "/servicios/canceleria-aluminio",
        statusCode,
      },
    ];
  },
};

export default nextConfig;
