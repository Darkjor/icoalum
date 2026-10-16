"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { track } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Evento de dataLayer que se emite al hacer clic (ej. cta_cotizar). */
  event?: string;
  data?: Record<string, unknown>;
};

/** Enlace con medicion. Interno usa next/link; tel:, mailto: y externos, <a>. */
export function TrackLink({ href, event, data, onClick, children, ...rest }: Props) {
  const handle: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (e) => {
    if (event) track(event, data);
    onClick?.(e);
  };
  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={handle} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
