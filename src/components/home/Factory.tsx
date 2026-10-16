import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Frame } from "@/components/ui/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const steps = [
  { verbo: "Medimos", linea: "Levantamos el vano en obra." },
  { verbo: "Calculamos", linea: "Definimos perfiles, cristal y herrajes." },
  { verbo: "Fabricamos", linea: "Cortamos y armamos en nuestra planta de Zapopan." },
  { verbo: "Instalamos", linea: "Nuestro equipo coloca y deja funcionando." },
];

export function Factory() {
  return (
    <Section aria-labelledby="fabrica-titulo" tone="surface">
      <div className="grid gap-12 xl:grid-cols-12 xl:gap-10">
        <div className="xl:col-span-5">
          <Reveal>
            <Eyebrow>Fábrica</Eyebrow>
            <h2 id="fabrica-titulo" className="display mt-5 max-w-[16ch] text-h1 text-text">
              De la medición a la instalación.
            </h2>
          </Reveal>
          <div className="mt-10">
            <Frame ratio="4/3" pendiente="foto de la planta de Zapopan" />
          </div>
        </div>

        <div className="flex flex-col justify-end xl:col-span-7">
          <ol className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-4 md:gap-y-0">
            {steps.map((s) => (
              <li key={s.verbo} className="border-t border-text pt-5">
                <h3 className="display text-h3 text-text">{s.verbo}</h3>
                <p className="mt-3 text-body text-text-2">{s.linea}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Button href="/fabrica" variant="secondary">
              Conocer la fábrica
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
