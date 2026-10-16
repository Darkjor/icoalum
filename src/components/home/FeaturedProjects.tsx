import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Frame } from "@/components/ui/Frame";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { featuredProjects } from "@/data/projects";

/** Posicion editorial por indice: anchos y desfase vertical solo desde md. */
const layout = [
  "md:col-span-5",
  "md:col-span-7 md:mt-36",
  "md:col-span-4",
  "md:col-span-8 md:mt-24",
  "md:col-span-7 md:mt-8",
  "md:col-span-5 md:mt-40",
];

/** Ancho aproximado de cada celda (mismo orden que `layout`) para `sizes`. */
const sizes = [
  "(min-width: 768px) 42vw, 100vw",
  "(min-width: 768px) 58vw, 100vw",
  "(min-width: 768px) 33vw, 100vw",
  "(min-width: 768px) 66vw, 100vw",
  "(min-width: 768px) 58vw, 100vw",
  "(min-width: 768px) 42vw, 100vw",
];

export function FeaturedProjects() {
  return (
    <Section aria-labelledby="proyectos-titulo" tone="surface">
      <Reveal>
        <h2 id="proyectos-titulo" className="display max-w-[16ch] text-h1 text-text">
          Obra que se ve y se queda.
        </h2>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-14 md:mt-16 md:grid-cols-12">
        {featuredProjects.map((p, i) => {
          const img = p.galeria[0];
          return (
            <li key={p.slug} className={layout[i]}>
              <Link
                href={p.pendiente ? "/proyectos" : `/proyectos/${p.slug}`}
                className="group block"
              >
                <Frame>
                  <PaneReveal tone="surface" from={i % 2 === 0 ? "left" : "right"}>
                    <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      {img.src ? (
                        <div
                          className="relative w-full"
                          style={{ aspectRatio: img.ratio.replace("/", " / ") }}
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes={sizes[i]}
                            loading="lazy"
                            style={img.position ? { objectPosition: img.position } : undefined}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Placeholder ratio={img.ratio} label={img.pendiente} />
                      )}
                    </div>
                  </PaneReveal>
                </Frame>
                <h3 className="display mt-5 text-h3 text-navy">{p.nombre}</h3>
                <p className="mt-1 text-body text-text-2">
                  {p.tipo}, {p.ubicacion}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-14 md:mt-20">
        <Button href="/proyectos" variant="secondary">
          Ver todos los proyectos
        </Button>
      </div>
    </Section>
  );
}
