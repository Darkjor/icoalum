/**
 * Unica marquesina del sitio (CSS puro). Pausa al hover y al foco; estatica con
 * movimiento reducido (ver .marquee-track en globals.css).
 * [PENDIENTE CLIENTE] reemplazar los nombres por los logos oficiales monocromos.
 */
const brands = [
  "Teufelbeschlag",
  "Kömmerling",
  "Cuprum",
  "Alubin",
  "Valsa",
  "Indalum",
  "Extrusiones Metálicas",
];

function Row({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20 ${
        duplicate ? "marquee-dup" : ""
      }`}
    >
      {brands.map((b) => (
        <li
          key={b}
          className="display whitespace-nowrap text-h3 font-medium text-navy"
          style={{ fontWeight: 500 }}
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

export function Brands() {
  return (
    <section aria-label="Marcas con las que trabajamos" className="border-b border-line bg-surface">
      <div
        // tabIndex: permite pausar la marquesina con el teclado
        tabIndex={0}
        className="marquee overflow-hidden py-9 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none] md:py-11"
      >
        <div className="marquee-track flex">
          <Row />
          <Row duplicate />
        </div>
      </div>
    </section>
  );
}
