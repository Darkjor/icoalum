import {
  ArrowsOutLineHorizontal,
  Buildings,
  Calculator,
  Factory,
  Lightbulb,
} from "@phosphor-icons/react/ssr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const reasons = [
  {
    Icon: Factory,
    titulo: "Fabricante directo",
    linea: "La fábrica y la instalación son nuestras, sin intermediarios.",
  },
  {
    Icon: Calculator,
    titulo: "Cálculo estructural",
    linea: "Dimensionamos cada vano con criterio de ingeniería.",
  },
  {
    Icon: ArrowsOutLineHorizontal,
    titulo: "Medidas jumbo",
    linea: "Cristal de gran formato para claros que otros no resuelven.",
  },
  {
    Icon: Buildings,
    titulo: "Marcas líderes",
    linea: "Trabajamos con Teufelbeschlag, Kömmerling, Cuprum, Alubin, Valsa e Indalum.",
  },
  {
    Icon: Lightbulb,
    titulo: "Innovación propia",
    linea: "Hide Window nació en nuestro taller.",
  },
];

export function WhyIcoAlum() {
  return (
    <Section aria-labelledby="porque-titulo" tone="bg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Por qué Ico Alum</Eyebrow>
            <h2 id="porque-titulo" className="display mt-5 max-w-[14ch] text-h1 text-text">
              Fabricamos lo que instalamos.
            </h2>
          </div>
        </div>

        <ul className="lg:col-span-7">
          {reasons.map(({ Icon, titulo, linea }, i) => (
            <li key={titulo} className={i > 0 ? "mt-10 border-t border-line pt-10" : ""}>
              <Reveal>
                <div className="flex gap-6">
                  <Icon aria-hidden weight="light" size={40} className="mt-1 shrink-0 text-navy" />
                  <div>
                    <h3 className="display text-h3 text-text">{titulo}</h3>
                    <p className="mt-2 max-w-[48ch] text-body text-text-2">{linea}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
