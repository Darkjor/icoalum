/**
 * Unica fuente de verdad de los datos de la empresa.
 * No inventar cifras, clientes ni testimonios: lo que no este confirmado va vacio.
 */
export const FOUNDED_YEAR = 1979;

export const site = {
  name: "Ico Alum",
  legalName: "Instalaciones y Combinaciones de Aluminio, S.A. de C.V.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://icoalum.net",
  description:
    "Fabricamos e instalamos cancelería de aluminio, PVC, cristal templado y fachadas en Guadalajara y Zapopan, desde 1979.",
  founded: FOUNDED_YEAR,
  address: {
    street: "Puerto Márquez 3-A",
    colony: "Col. Miramar",
    postalCode: "45060",
    city: "Zapopan",
    region: "Jalisco",
    country: "MX",
  },
  phone: {
    display: "01 33 3180 0129",
    tel: "+523331800129",
  },
  emails: ["ventas1@icoalum.net", "ventas2@icoalum.net", "presupuestos2@icoalum.net"],
  /** Solo digitos con lada de pais (ej. 5213312345678). Vacio = el boton no se muestra. */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, ""),
  /** Vacias hasta que el cliente confirme sus cuentas. */
  social: [] as { label: string; href: string }[],
  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.colony}, ${site.address.postalCode} ${site.address.city}, ${site.address.region}`;

export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${site.name}, ${fullAddress}`,
)}&output=embed`;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
