import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/ui/Frame";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Project } from "@/data/projects";

/** Portada de proyecto: marco, panel corredizo, zoom lento al pasar. Enlaza a su ficha. */
export function ProjectCard({
  project,
  from = "left",
  tone = "bg",
  sizes = "(min-width: 768px) 60vw, 100vw",
}: {
  project: Project;
  from?: "left" | "right";
  tone?: "bg" | "surface";
  sizes?: string;
}) {
  const img = project.galeria[0];
  return (
    <Link href={`/proyectos/${project.slug}`} className="group block">
      <Frame>
        <PaneReveal tone={tone} from={from}>
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            {img.src ? (
              <div className="relative w-full" style={{ aspectRatio: img.ratio.replace("/", " / ") }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={sizes}
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
      <h3 className="display mt-5 text-h3 text-navy group-hover:text-vino">{project.nombre}</h3>
      <p className="mt-1 text-body text-text-2">
        {project.tipo}, {project.ubicacion}
      </p>
    </Link>
  );
}
