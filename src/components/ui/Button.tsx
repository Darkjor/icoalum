import type { ButtonHTMLAttributes, ReactNode } from "react";
import { TrackLink } from "@/components/TrackLink";

export type ButtonVariant = "primary" | "secondary" | "onPhoto";

const base =
  "inline-flex h-[52px] items-center justify-center gap-2 whitespace-nowrap px-7 text-body font-medium leading-none transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Ambar: SOLO relleno de boton con texto tinta
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-text text-text hover:bg-surface-2",
  // Sobre foto: velo de tinta, texto claro, anillo de foco claro
  onPhoto:
    "border border-photo/60 bg-ink/45 text-photo hover:bg-ink/65 focus-visible:outline-photo",
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
