import { ArrowRight } from "@phosphor-icons/react/ssr";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import Link from "next/link";

/** [PENDIENTE CLIENTE] fotos reales de cada linea (hoy Placeholder con ratio fijo). */
const services = [
  {
    nombre: "Cristal templado",
    linea: "Corredizos, apilables y plegables de gran formato con herrajes Teufelbeschlag.",
    href: "/servicios/cristal-templado",
    ratio: "7/5",
    span: "md:col-span-7",
  },
  {
    nombre: "Ventanería PVC",
    linea: "Sistemas Kömmerling de buen desempeño térmico y acústico.",
    href: "/servicios/ventaneria-pvc",
    ratio: "1/1",
    span: "md:col-span-5",
  },
  {
    nombre: "Cancelería de aluminio",
    linea: "Líneas Cuprum, Alubin, Valsa, Indalum y Extrusiones Metálicas, hechas a la medida.",
    href: "/servicios/canceleria-aluminio",
    ratio: "4/3",
    span: "md:col-span-4",
  },
  {
    nombre: "Cristales eficientes",
    linea: "Térmicos y acústicos, en medidas jumbo.",
    href: "/servicios/cristales-eficientes",
    ratio: "4/3",
    span: "md:col-span-4",
  },
  {
    nombre: "Cálculo estructural",
    linea: "Cada vano se calcula antes de fabricarse.",
    href: "/servicios/calculo-estructural",
    ratio: "4/3",
    span: "md:col-span-4",
  },
] as const;

export function Services() {
  return (
    <Section aria-labelledby="servicios-titulo" tone="bg">
      <Reveal>
        <Eyebrow>Servicios</Eyebrow>
        <h2 id="servicios-titulo" className="display mt-5 max-w-[18ch] text-h1 text-text">
          Cinco líneas, una sola fábrica.
        </h2>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-12 md:mt-16 md:grid-cols-12">
        {services.map((s) => (
          <li key={s.href} className={s.span}>
            <Link href={s.href} className="group block">
              <Frame ratio={s.ratio} pendiente={`foto de ${s.nombre.toLowerCase()}`} />
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className="display text-h3 text-text">{s.nombre}</h3>
                  <p className="mt-2 max-w-[44ch] text-body text-text-2">{s.linea}</p>
                </div>
                <ArrowRight
                  aria-hidden
                  weight="light"
                  size={32}
                  className="mt-0.5 shrink-0 text-navy transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
