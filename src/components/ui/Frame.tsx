import Image from "next/image";
import type { ReactNode } from "react";
import { Placeholder } from "./Placeholder";

/**
 * Marco: 1px de aluminio (--line) y 8px de aire, como un cristal montado en su perfil.
 * Sin `src` ni `children` muestra un Placeholder con `pendiente`.
 */
export function Frame({
  src,
  alt = "",
  ratio = "4/3",
  pendiente = "imagen",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  children,
  className = "",
}: {
  src?: string;
  alt?: string;
  ratio?: string | number;
  /** Descripcion de la imagen que falta (se muestra en el Placeholder). */
  pendiente?: string;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const aspect = typeof ratio === "number" ? ratio : ratio.replace("/", " / ");
  return (
    <div className={`border border-line p-2 ${className}`}>
      {children ? (
        children
      ) : src ? (
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
      ) : (
        <Placeholder ratio={ratio} label={pendiente} />
      )}
    </div>
  );
}
