import { fullAddress, mapEmbedUrl, site } from "@/lib/site";

/** Mapa de Google embebido (sin API key), en marco fino. Carga diferida. */
export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-line p-2 ${className}`}>
      <iframe
        title={`Mapa de la ubicación de ${site.name}: ${fullAddress}`}
        src={mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-72 w-full border-0 md:h-[28rem]"
      />
    </div>
  );
}
