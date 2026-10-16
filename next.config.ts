import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
