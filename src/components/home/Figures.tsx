import { Container } from "@/components/ui/Container";
import { getTimeFacts } from "@/lib/years";

/**
 * Franja de cifras. [PENDIENTE CLIENTE] agregar proyectos entregados y m² instalados
 * cuando el cliente los confirme. No inventar cifras.
 */
export async function Figures() {
  const { yearsInBusiness } = await getTimeFacts();
  const items = [
    { value: String(yearsInBusiness), label: "años fabricando aluminio y cristal" },
    { value: "1", label: "fábrica propia en Zapopan" },
    { value: "Jumbo", label: "medidas de cristal de gran formato" },
  ];

  return (
    <section aria-label="Ico Alum en cifras" className="bg-bg py-16 md:py-24">
      <Container>
        <ul className="grid grid-cols-1 md:grid-cols-3">
          {items.map((it, i) => (
            <li
              key={it.label}
              className={`border-t border-line py-8 md:border-t-0 md:py-2 md:pr-8 ${
                i > 0 ? "md:border-l md:pl-8 lg:pl-12" : ""
              } ${i === 0 ? "border-t-0 pt-0 md:pt-2" : ""}`}
            >
              <p className="display text-display leading-none text-text">{it.value}</p>
              <p className="mt-4 max-w-[26ch] text-lead text-text-2">{it.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
