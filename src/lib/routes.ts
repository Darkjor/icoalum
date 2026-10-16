export type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

/** Rutas de la arquitectura: alimentan sitemap y navegacion. */
export const routes: RouteEntry[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/nosotros", priority: 0.7, changeFrequency: "yearly" },
  { path: "/servicios", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios/cristal-templado", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicios/ventaneria-pvc", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicios/canceleria-aluminio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicios/cristales-eficientes", priority: 0.8, changeFrequency: "monthly" },
  { path: "/servicios/calculo-estructural", priority: 0.8, changeFrequency: "monthly" },
  { path: "/proyectos", priority: 0.9, changeFrequency: "weekly" },
  { path: "/innovacion", priority: 0.6, changeFrequency: "monthly" },
  { path: "/fabrica", priority: 0.6, changeFrequency: "monthly" },
  { path: "/cotizar", priority: 0.9, changeFrequency: "yearly" },
  { path: "/contacto", priority: 0.7, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.2, changeFrequency: "yearly" },
];

export const navLinks = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Innovación", href: "/innovacion" },
  { label: "Fábrica", href: "/fabrica" },
  { label: "Contacto", href: "/contacto" },
] as const;

/** Nombre legible de cada servicio (mensaje de WhatsApp, migas, etc.). */
export const serviceNames: Record<string, string> = {
  "cristal-templado": "cristal templado",
  "ventaneria-pvc": "ventanería de PVC",
  "canceleria-aluminio": "cancelería de aluminio",
  "cristales-eficientes": "cristales eficientes",
  "calculo-estructural": "cálculo estructural",
};

/**
 * Rutas cuyo primer bloque es un hero oscuro a sangre: el header nace
 * transparente. El hero debe llevar el atributo `data-hero`.
 * Cualquier otra ruta nace con el header solido.
 */
export const heroRoutes: string[] = ["/", "/innovacion"];
