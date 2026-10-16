/**
 * Marcador de imagen pendiente. Relacion de aspecto fija (sin saltos de layout)
 * y fondo de cristal con reflejos diagonales, no una caja gris.
 * `ratio` acepta "16/9", "4/5" o un numero.
 */
export function Placeholder({
  ratio = "16/9",
  label,
  className = "",
  labelClassName = "",
}: {
  ratio?: string | number;
  label: string;
  className?: string;
  /** Ajuste del rotulo (p. ej. sobre foto con velo). */
  labelClassName?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Imagen pendiente: ${label}`}
      className={`placeholder-glass relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: typeof ratio === "number" ? ratio : ratio.replace("/", " / ") }}
    >
      <p className={`absolute inset-x-0 bottom-0 p-3 text-[0.75rem] leading-snug text-text md:p-4 ${labelClassName}`}>
        [PENDIENTE CLIENTE] {label}
      </p>
    </div>
  );
}
