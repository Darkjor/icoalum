import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Logo actual (PNG 300x300, baja resolucion) en baldosa de superficie + rotulo en Archivo. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, inicio`}
      className={`flex items-center gap-3 ${className}`}
    >
      <span className="grid size-11 shrink-0 place-items-center border border-line bg-surface">
        <Image src="/brand/logo.png" alt="" width={36} height={36} priority className="size-9" />
      </span>
      <span className="font-display text-[1.125rem] font-semibold uppercase leading-none tracking-[0.08em] [font-variation-settings:'wdth'_112]">
        ICO ALUM
      </span>
    </Link>
  );
}
