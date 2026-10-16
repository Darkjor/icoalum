/**
 * Proyectos del sitio. Fuente unica para el home y para /proyectos.
 * TODAS las entradas son PLACEHOLDER: [PENDIENTE CLIENTE] reemplazar con obra real
 * (nombre, tipo, ubicacion, año, sistemas, descripcion y fotos). No inventar obras.
 */
export type ProjectType = "Residencial" | "Comercial" | "Edificación vertical";

export type ProjectImage = {
  src?: string;
  alt: string;
  /** Texto del Placeholder mientras no haya foto. */
  pendiente: string;
  ratio: string;
};

export type Project = {
  slug: string;
  nombre: string;
  tipo: ProjectType;
  ubicacion: string;
  /** Año de la obra; null hasta que el cliente lo confirme. */
  anio: number | null;
  sistemas: string[];
  descripcion: string;
  galeria: ProjectImage[];
  /** Relacion de la imagen de portada en el home (escalonado editorial). */
  ratioPortada: "4/5" | "16/9" | "1/1";
  /** true mientras los datos no sean reales. */
  pendiente: boolean;
};

const P = "[PENDIENTE CLIENTE]";

function placeholder(
  slug: string,
  nombre: string,
  tipo: ProjectType,
  ratioPortada: Project["ratioPortada"],
): Project {
  return {
    slug,
    nombre,
    tipo,
    ubicacion: `${P} ubicación`,
    anio: null,
    sistemas: [],
    descripcion: `${P} descripción de la obra`,
    galeria: [
      {
        alt: `${nombre}, vista general`,
        pendiente: `foto de portada de ${nombre}`,
        ratio: ratioPortada,
      },
    ],
    ratioPortada,
    pendiente: true,
  };
}

export const projects: Project[] = [
  placeholder("proyecto-pendiente-1", `${P} Nombre de obra 1`, "Residencial", "4/5"),
  placeholder("proyecto-pendiente-2", `${P} Nombre de obra 2`, "Comercial", "16/9"),
  placeholder("proyecto-pendiente-3", `${P} Nombre de obra 3`, "Edificación vertical", "4/5"),
  placeholder("proyecto-pendiente-4", `${P} Nombre de obra 4`, "Comercial", "16/9"),
  placeholder("proyecto-pendiente-5", `${P} Nombre de obra 5`, "Residencial", "16/9"),
  placeholder("proyecto-pendiente-6", `${P} Nombre de obra 6`, "Edificación vertical", "4/5"),
];

export const featuredProjects: Project[] = projects.slice(0, 6);
