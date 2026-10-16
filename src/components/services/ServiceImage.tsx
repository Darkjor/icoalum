import Image from "next/image";
import { Frame } from "@/components/ui/Frame";
import { PaneReveal } from "@/components/ui/PaneReveal";
import type { Service } from "@/data/services";

/** Imagen de servicio dentro de su marco, con panel corredizo. Foto provisional del archivo del cliente. */
export function ServiceImage({
  service,
  ratio,
  from = "left",
  tone = "bg",
  sizes = "(min-width: 1024px) 58vw, 100vw",
  className = "",
}: {
  service: Service;
  ratio: string;
  from?: "left" | "right";
  tone?: "bg" | "surface" | "surface2";
  sizes?: string;
  className?: string;
}) {
  const { src, alt, position } = service.imagen;
  return (
    <Frame className={className}>
      <PaneReveal from={from} tone={tone}>
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <div className="relative w-full" style={{ aspectRatio: ratio.replace("/", " / ") }}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              loading="lazy"
              style={position ? { objectPosition: position } : undefined}
              className="object-cover"
            />
          </div>
        </div>
      </PaneReveal>
    </Frame>
  );
}
