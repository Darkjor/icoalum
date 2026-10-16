import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ogImage } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";
import "./globals.css";

// Display: Archivo variable con eje de ancho (wdth). Cuerpo: Geist. Datos tecnicos: Geist Mono.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Cancelería de aluminio, PVC y cristal en Zapopan`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    title: `${site.name} | Cancelería de aluminio, PVC y cristal en Zapopan`,
    description: site.description,
    url: "/",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Cancelería de aluminio, PVC y cristal en Zapopan`,
    description: site.description,
    images: [{ url: ogImage.url, alt: ogImage.alt }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F5F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A141C" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
  "@id": `${site.url}/#empresa`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  description: site.description,
  logo: `${site.url}/brand/logo.png`,
  image: `${site.url}/brand/logo.png`,
  telephone: site.phone.tel,
  email: site.emails[0],
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.street}, ${site.address.colony}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: [
    { "@type": "City", name: "Guadalajara" },
    { "@type": "City", name: "Zapopan" },
    { "@type": "State", name: "Jalisco" },
  ],
  // Direccion completa para lectores que no parsean PostalAddress
  hasMap: `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${archivo.variable} ${geist.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-[60] -translate-y-24 border border-text bg-surface px-5 py-3 text-body-sm font-medium text-text focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <CookieBanner />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
