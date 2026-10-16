/**
 * Proyectos del sitio. Fuente unica para el home y para /proyectos.
 * Las fotos son PROVISIONALES, del archivo del cliente (public/obra/); los nombres describen lo que se ve,
 * no son nombres de obra. [PENDIENTE CLIENTE] nombre real, ubicacion, año, sistemas y sesion profesional.
 * No inventar obras. Dos de las imagenes son renders de baja resolucion (no obra terminada).
 */
export type ProjectType = "Residencial" | "Comercial" | "Edificación vertical";

export type ProjectImage = {
  src?: string;
  alt: string;
  /** Texto del Placeholder mientras no haya foto. */
  pendiente: string;
  ratio: string;
  /** object-position del recorte (CSS). */
  position?: string;
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
  ratioPortada: "4/5" | "16/9" | "1/1" | "4/3";
  /** true mientras ubicacion, año y sistemas no esten confirmados. */
  pendiente: boolean;
};

const P = "[PENDIENTE CLIENTE]";

type Foto = { src: string; alt: string; position?: string };

const fotos = {
  muroCorredizo: {
    src: "/obra/residencia-muro-cristal-corredizo.jpg",
    alt: "Residencia con muro de cristal corredizo abierto hacia la alberca y la sala",
    position: "50% 50%",
  },
  fachadaComercial: {
    src: "/obra/fachada-comercial-cristal.jpg",
    alt: "Agencia comercial con una fachada larga de cristal",
    position: "50% 50%",
  },
  ventanasMar: {
    src: "/obra/residencia-ventanas-curvas-mar.jpg",
    alt: "Ventanas curvas de piso a techo frente al mar, en una residencia con muro rojo",
    position: "35% 50%",
  },
  torresRender: {
    src: "/obra/render-torres-cristal.jpg",
    alt: "Render de torres de oficinas con fachadas de cristal",
    position: "50% 50%",
  },
  edificioCurvoRender: {
    src: "/obra/render-edificio-curvo.jpg",
    alt: "Render de un edificio curvo con bandas horizontales de cristal",
    position: "50% 50%",
  },
  barandal: {
    src: "/obra/interior-barandal-cristal.jpg",
    alt: "Interior de una residencia con barandal de cristal, lucernario y una palmera",
    position: "50% 50%",
  },
  muroCortina: {
    src: "/obra/muro-cortina-interior.jpg",
    alt: "Muro cortina de cristal con retícula visto desde el interior, con árboles al fondo",
    position: "50% 45%",
  },
  cubierta: {
    src: "/obra/cubierta-cristal-pasarela.jpg",
    alt: "Cubierta de cristal estructural sobre una pasarela, bajo un cielo azul",
    position: "50% 50%",
  },
} satisfies Record<string, Foto>;

function imagen(f: Foto, nombre: string, ratio: string): ProjectImage {
  return { ...f, ratio, pendiente: `foto de ${nombre}` };
}

function marcador(nombre: string, detalle: string, ratio: string): ProjectImage {
  return { alt: `${nombre}, ${detalle}`, pendiente: `foto de ${detalle} de ${nombre}`, ratio };
}

function proyecto(input: {
  slug: string;
  nombre: string;
  tipo: ProjectType;
  ratioPortada: Project["ratioPortada"];
  descripcion?: string;
  portada: Foto;
  /** Imagenes secundarias (sin repetir la portada); las que falten quedan como Placeholder. */
  secundarias?: Foto[];
}): Project {
  const { slug, nombre, tipo, ratioPortada, portada, secundarias = [] } = input;
  // Celda angosta y celda ancha de la galeria de la ficha.
  const ratios = ["1/1", "16/9"];
  return {
    slug,
    nombre,
    tipo,
    ubicacion: `${P} ubicación`,
    anio: null,
    sistemas: [],
    descripcion: input.descripcion ?? `${P} descripción de la obra`,
    galeria: [
      imagen(portada, nombre, ratioPortada),
      ...ratios.map((ratio, i) =>
        secundarias[i]
          ? imagen(secundarias[i], nombre, ratio)
          : marcador(nombre, i === 0 ? "detalle" : "interior", ratio),
      ),
    ],
    ratioPortada,
    pendiente: true,
  };
}

/** El orden pone las fotos 4:3 en celdas angostas del escalonado y las 16:9 en las anchas. */
export const projects: Project[] = [
  proyecto({
    slug: "interior-barandal-cristal",
    nombre: "Interior con barandal de cristal",
    tipo: "Residencial",
    ratioPortada: "4/5",
    portada: fotos.barandal,
    secundarias: [fotos.muroCortina, fotos.muroCorredizo],
  }),
  proyecto({
    slug: "residencia-muro-cristal-corredizo",
    nombre: "Residencia con muro de cristal corredizo",
    tipo: "Residencial",
    ratioPortada: "16/9",
    portada: fotos.muroCorredizo,
    secundarias: [fotos.barandal, fotos.ventanasMar],
  }),
  proyecto({
    slug: "torres-oficinas-cristal",
    nombre: "Torres de oficinas en cristal",
    tipo: "Edificación vertical",
    ratioPortada: "4/5",
    descripcion: `Render de torres de oficinas con fachada de cristal; no es una obra terminada. ${P} descripción del proyecto.`,
    portada: fotos.torresRender,
  }),
  proyecto({
    slug: "fachada-comercial-cristal",
    nombre: "Fachada comercial de cristal",
    tipo: "Comercial",
    ratioPortada: "16/9",
    portada: fotos.fachadaComercial,
    secundarias: [fotos.muroCortina, fotos.cubierta],
  }),
  proyecto({
    slug: "residencia-frente-al-mar",
    nombre: "Residencia frente al mar",
    tipo: "Residencial",
    ratioPortada: "16/9",
    portada: fotos.ventanasMar,
    secundarias: [fotos.barandal, fotos.muroCorredizo],
  }),
  proyecto({
    slug: "edificio-curvo-cristal",
    nombre: "Edificio curvo de cristal",
    tipo: "Edificación vertical",
    ratioPortada: "4/3",
    descripcion: `Render de un edificio curvo con bandas horizontales de cristal; no es una obra terminada. ${P} descripción del proyecto.`,
    portada: fotos.edificioCurvoRender,
  }),
];

export const featuredProjects: Project[] = projects.slice(0, 6);

export const projectTypes: ProjectType[] = ["Residencial", "Comercial", "Edificación vertical"];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Anterior y siguiente en el orden del listado (circular). */
export function getNeighbors(slug: string): { prev: Project; next: Project } | null {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return null;
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
