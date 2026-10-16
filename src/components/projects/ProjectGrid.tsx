import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/projects";

/** Posicion editorial por indice (se repite cada 6): anchos y desfase vertical solo desde md. */
const layout = [
  "md:col-span-5",
  "md:col-span-6 md:col-start-7 md:mt-28",
  "md:col-span-4",
  "md:col-span-7 md:col-start-6 md:mt-16",
  "md:col-span-6 md:mt-4",
  "md:col-span-5 md:col-start-8 md:mt-32",
];

export function ProjectGrid({ items }: { items: Project[] }) {
  return (
    <ul className="grid grid-cols-1 items-start gap-x-6 gap-y-14 md:grid-cols-12">
      {items.map((p, i) => (
        <li key={p.slug} className={layout[i % layout.length]}>
          <ProjectCard project={p} from={i % 2 === 0 ? "left" : "right"} tone="surface" />
        </li>
      ))}
    </ul>
  );
}
