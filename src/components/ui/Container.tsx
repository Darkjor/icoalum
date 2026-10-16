import type { ElementType, ReactNode } from "react";

/** Ancho maximo 1400px, gutter de 16px en movil. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
}
