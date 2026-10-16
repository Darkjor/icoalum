import type { ButtonHTMLAttributes, ReactNode } from "react";
import { TrackLink } from "@/components/TrackLink";

/**
 * Variantes por contexto, misma jerarquia en cada fondo:
 * - claro: primary (vino) y secondary (borde azul)
 * - oscuro (navy-deep o foto con velo): primaryOnDark (ambar) y secondaryOnDark (borde claro)
 * El foco lo da --ring: azul sobre claro, ambar dentro de `.on-dark`.
 */
export type ButtonVariant = "primary" | "primaryOnDark" | "secondary" | "secondaryOnDark";

const base =
  "inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap px-7 text-body font-medium leading-none transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Vino sobre claro (de noche pasa a ambar con texto tinta: ver --cta)
  primary: "bg-cta text-on-cta hover:bg-cta-hover",
  // Ambar: SOLO relleno con texto tinta, sobre navy-deep o foto con velo
  primaryOnDark: "bg-accent text-on-accent hover:bg-accent-hover focus-visible:outline-amber",
  secondary: "border border-navy text-navy hover:bg-surface-2",
  secondaryOnDark:
    "border border-on-deep text-on-deep hover:bg-on-deep/10 focus-visible:outline-amber",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`.trim();
}

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & {
  href: string;
  /** Evento de analitica al hacer clic. */
  track?: { event: string; data?: Record<string, unknown> };
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

type AsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const cls = buttonClasses(variant, className);

  if (props.href !== undefined) {
    const { href, track, target, rel } = props as AsLink;
    return (
      <TrackLink
        href={href}
        event={track?.event}
        data={track?.data}
        target={target}
        rel={rel}
        aria-label={(props as AsLink)["aria-label"]}
        className={cls}
      >
        {children}
      </TrackLink>
    );
  }

  const { variant: _v, className: _c, children: _ch, href: _h, type, ...rest } = props as AsButton;
  void _v;
  void _c;
  void _ch;
  void _h;
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {children}
    </button>
  );
}
