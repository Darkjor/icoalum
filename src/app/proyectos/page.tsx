import { Suspense } from "react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Proyectos de cancelería, cristal y fachadas",
  description:
    "Obras de Ico Alum en residencial, comercial y edificación vertical: cancelería de aluminio, PVC, cristal templado y fachadas de cristal en Guadalajara y Zapopan.",
  path: "/proyectos",
});

export default function ProyectosPage() {
  const hayPendientes = projects.some((p) => p.pendiente);

  return (
    <>
      <PageHeader
        title="Proyectos"
        intro="Residencial de alto nivel, comercial y edificación vertical. Filtra por tipo y abre cada obra para ver sus sistemas."
      />

      <section aria-label="Listado de proyectos" className="bg-surface py-16 md:py-24">
        <Container>
          {hayPendientes ? (
            <p className="mb-12 max-w-[64ch] border-l-2 border-navy pl-4 text-body-sm text-text-2 md:mb-16">
              [PENDIENTE CLIENTE] Los proyectos que se ven aquí son marcadores. Se reemplazan con obras reales
              (nombre, ubicación, año, sistemas y fotos) en cuanto el cliente las entregue.
            </p>
          ) : null}
          {/* useSearchParams exige Suspense; el respaldo es el listado completo, ya renderizado en el servidor. */}
          <Suspense fallback={<ProjectGrid items={projects} />}>
            <ProjectsExplorer projects={projects} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
