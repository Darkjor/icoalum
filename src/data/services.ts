import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsOutLineHorizontal,
  Buildings,
  Calculator,
  Factory,
  Ruler,
  SpeakerHigh,
  Thermometer,
  Wrench,
} from "@phosphor-icons/react/ssr";
import type { ProjectType } from "./projects";

/**
 * Lineas de servicio. Fuente unica para /servicios y /servicios/[slug].
 * Solo datos verificados: fabricantes e instaladores desde 1979 en Zapopan, fabrica propia,
 * sistemas y marcas confirmados. No agregar cifras, plazos, garantias ni certificaciones.
 */
export type ServiceImagen = {
  src: string;
  alt: string;
  /** object-position del recorte (CSS). */
  position?: string;
};

export type Service = {
  slug: string;
  nombre: string;
  /** Una linea para el hub y las tarjetas. */
  resumen: string;
  /** H1 de la pagina del servicio. */
  titular: string;
  intro: string[];
  /** Foto provisional (archivo del cliente, public/obra/). La leen home, hub y detalle. */
  imagen: ServiceImagen;
  /** Proporcion de la imagen en el hub. */
  ratioHub: string;
  paraQue: { titulo: string; texto: string }[];
  sistemasTitulo: string;
  sistemasIntro: string;
  sistemas: { nombre: string; nota: string }[];
  beneficios: { icono: Icon; titulo: string; texto: string }[];
  /** Tipos de proyecto afines: ordenan el bloque de proyectos relacionados. */
  tiposRelacionados: ProjectType[];
  /** Frase clave natural de la pagina (para SEO y JSON-LD). */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
};

const unResponsable = {
  icono: Factory,
  titulo: "Un solo responsable",
  texto: "Fabricamos e instalamos nosotros: de la fábrica a la obra tienes un solo interlocutor.",
} as const;

export const services: Service[] = [
  {
    slug: "cristal-templado",
    nombre: "Cristal templado",
    resumen: "Corredizos, apilables y plegables de gran formato con herrajes Teufelbeschlag.",
    titular: "Cristal templado hecho al vano de tu proyecto.",
    intro: [
      "Fabricamos e instalamos cerramientos de cristal templado: corredizos, apilables y plegables, y también fachadas de cristal. Cada cerramiento se resuelve con herrajes Teufelbeschlag y se dimensiona para el vano exacto de la obra.",
      "Trabajamos desde los planos del arquitecto, del desarrollador o de la constructora, y entregamos el sistema completo: cristal, herraje, perfil e instalación.",
    ],
    imagen: {
      src: "/obra/interior-barandal-cristal.jpg",
      alt: "Interior de una residencia con barandal de cristal, lucernario y una palmera",
      position: "50% 50%",
    },
    ratioHub: "7/5",
    paraQue: [
      {
        titulo: "Residencial de alto nivel",
        texto: "Terrazas, salas y recámaras que se abren por completo al jardín o a la vista.",
      },
      {
        titulo: "Comercial",
        texto: "Fachadas de cristal y divisiones en locales, oficinas y espacios de atención al público.",
      },
      {
        titulo: "Edificación vertical",
        texto: "Cerramientos de balcón y terraza resueltos como sistema repetible para toda la torre.",
      },
    ],
    sistemasTitulo: "Sistemas que fabricamos",
    sistemasIntro: "El herraje decide cómo se mueve el cristal. Trabajamos con el sistema que el claro y el uso piden.",
    sistemas: [
      {
        nombre: "Teufelbeschlag",
        nota: "Herrajes para cristal templado: corredizos, apilables y plegables.",
      },
      {
        nombre: "Cristal templado",
        nota: "En medidas jumbo cuando el claro lo pide.",
      },
    ],
    beneficios: [
      {
        icono: Ruler,
        titulo: "Precisión de medida",
        texto: "Cada cerramiento se toma en obra y se fabrica para ese vano, sin ajustes improvisados al instalar.",
      },
      unResponsable,
      {
        icono: ArrowsOutLineHorizontal,
        titulo: "Claros grandes resueltos",
        texto: "Corredizos y apilables de gran formato, con el herraje dimensionado para el peso del cristal.",
      },
    ],
    tiposRelacionados: ["Residencial", "Comercial"],
    keyword: "cristal templado Zapopan",
    metaTitle: "Cristal templado en Zapopan",
    metaDescription:
      "Cristal templado en Zapopan: corredizos, apilables y plegables de gran formato con herrajes Teufelbeschlag, y fachadas de cristal, de fábrica a obra.",
  },
  {
    slug: "ventaneria-pvc",
    nombre: "Ventanería PVC",
    resumen: "Sistemas Kömmerling de buen desempeño térmico y acústico.",
    titular: "Ventanas de PVC fabricadas a la medida.",
    intro: [
      "Fabricamos ventanas y puertas de PVC con sistemas Kömmerling, pensadas para espacios donde importan el confort térmico y el aislamiento del ruido.",
      "Cada ventana se mide y se fabrica para su vano, y la instalamos con nuestro propio equipo. Para quien proyecta, eso significa menos interlocutores y menos sorpresas entre el plano y la obra.",
    ],
    imagen: {
      src: "/obra/residencia-ventanas-curvas-mar.jpg",
      alt: "Ventanas curvas de piso a techo frente al mar, en una residencia con muro rojo",
      position: "35% 50%",
    },
    ratioHub: "4/5",
    paraQue: [
      {
        titulo: "Residencial",
        texto: "Casas y departamentos donde se busca confort térmico y menos ruido de la calle.",
      },
      {
        titulo: "Desarrollos habitacionales",
        texto: "Ventanas con una misma especificación repetida a lo largo de todo el conjunto.",
      },
      {
        titulo: "Comercial",
        texto: "Oficinas y locales que piden un buen aislamiento sin perder luz natural.",
      },
    ],
    sistemasTitulo: "Sistemas que fabricamos",
    sistemasIntro: "Un sistema de PVC probado, con perfilería y herrajes de un mismo fabricante.",
    sistemas: [
      {
        nombre: "Kömmerling",
        nota: "Sistema de ventanería PVC: ventanas y puertas con buen desempeño térmico y acústico.",
      },
    ],
    beneficios: [
      {
        icono: Thermometer,
        titulo: "Confort térmico",
        texto: "El PVC aporta un buen desempeño térmico al vano, pensado para el clima de cada obra.",
      },
      {
        icono: SpeakerHigh,
        titulo: "Menos ruido",
        texto: "Un cerramiento bien fabricado e instalado ayuda a aislar el espacio del ruido exterior.",
      },
      unResponsable,
    ],
    tiposRelacionados: ["Residencial", "Edificación vertical"],
    keyword: "ventanas PVC Jalisco",
    metaTitle: "Ventanas PVC en Jalisco",
    metaDescription:
      "Ventanas PVC en Jalisco con sistemas Kömmerling, fabricadas a la medida de tu proyecto por Ico Alum, fabricantes e instaladores desde 1979.",
  },
  {
    slug: "canceleria-aluminio",
    nombre: "Cancelería de aluminio",
    resumen: "Líneas Cuprum, Alubin, Valsa, Indalum y Extrusiones Metálicas, hechas a la medida.",
    titular: "Cancelería de aluminio a la medida de cada obra.",
    intro: [
      "Fabricamos cancelería de aluminio en Guadalajara y Zapopan: ventanas, puertas, canceles y fachadas de cristal, con las líneas de los principales sistemas del mercado.",
      "Al fabricar en nuestra propia planta, la medida se controla desde el corte hasta la instalación, y el proyecto tiene un solo responsable de principio a fin.",
    ],
    imagen: {
      src: "/obra/muro-cortina-interior.jpg",
      alt: "Muro cortina de cristal con retícula visto desde el interior, con árboles al fondo",
      position: "50% 45%",
    },
    ratioHub: "21/9",
    paraQue: [
      {
        titulo: "Residencial",
        texto: "Ventanas, puertas y canceles con la línea adecuada al estilo y al presupuesto de la casa.",
      },
      {
        titulo: "Comercial y corporativo",
        texto: "Fachadas de cristal, canceles de oficina y accesos para locales y edificios de servicios.",
      },
      {
        titulo: "Edificación vertical",
        texto: "Cancelería para torres y desarrollos, fabricada por tipología y con calidad pareja en toda la obra.",
      },
    ],
    sistemasTitulo: "Sistemas que fabricamos",
    sistemasIntro: "Varias líneas y proveedores, para elegir la que cada proyecto necesita.",
    sistemas: [
      { nombre: "Cuprum", nota: "Líneas Eurovent y Premium." },
      { nombre: "Alubin", nota: "Sistemas de aluminio." },
      { nombre: "Valsa", nota: "Sistemas de aluminio." },
      { nombre: "Indalum", nota: "Sistemas de aluminio." },
      { nombre: "Extrusiones Metálicas", nota: "Perfilería de aluminio." },
    ],
    beneficios: [
      {
        icono: Ruler,
        titulo: "Precisión de medida",
        texto: "Cortamos y ensamblamos en fábrica contra la medida tomada en obra, para que el vano cierre.",
      },
      {
        icono: Wrench,
        titulo: "La línea que el proyecto pide",
        texto: "Varios proveedores de perfilería nos permiten ajustar sistema, acabado y presupuesto.",
      },
      unResponsable,
    ],
    tiposRelacionados: ["Comercial", "Edificación vertical"],
    keyword: "cancelería de aluminio Guadalajara",
    metaTitle: "Cancelería de aluminio en Guadalajara",
    metaDescription:
      "Cancelería de aluminio en Guadalajara y Zapopan: líneas Cuprum, Alubin, Valsa e Indalum, fabricadas en planta propia e instaladas por Ico Alum desde 1979.",
  },
  {
    slug: "cristales-eficientes",
    nombre: "Cristales eficientes",
    resumen: "Térmicos y acústicos, en medidas jumbo.",
    titular: "Cristales térmicos y acústicos para cada fachada.",
    intro: [
      "Suministramos cristales térmicos y acústicos para proyectos donde la fachada también tiene que cuidar la temperatura y el ruido del interior.",
      "Trabajamos medidas jumbo, así que los claros grandes no obligan a partir el cristal en más piezas de las necesarias. Todo se coordina con la cancelería y el cálculo del mismo proyecto.",
    ],
    imagen: {
      src: "/obra/cubierta-cristal-pasarela.jpg",
      alt: "Cubierta de cristal estructural sobre una pasarela, bajo un cielo azul",
      position: "50% 50%",
    },
    ratioHub: "4/3",
    paraQue: [
      {
        titulo: "Fachadas expuestas al sol",
        texto: "Orientaciones donde el calor entra por el cristal y pesa en el confort del espacio.",
      },
      {
        titulo: "Proyectos junto a vialidades",
        texto: "Viviendas, oficinas y hoteles donde el ruido exterior es parte del problema a resolver.",
      },
      {
        titulo: "Claros grandes",
        texto: "Vanos que piden piezas de gran formato con la menor cantidad posible de cortes.",
      },
    ],
    sistemasTitulo: "Lo que cubrimos",
    sistemasIntro: "El tipo de cristal se elige junto con el claro, la orientación y el sistema que lo sostiene.",
    sistemas: [
      { nombre: "Cristal térmico", nota: "Para cuidar la temperatura del interior." },
      { nombre: "Cristal acústico", nota: "Para reducir el ruido que llega de fuera." },
      { nombre: "Medidas jumbo", nota: "Piezas de gran formato para claros amplios." },
    ],
    beneficios: [
      {
        icono: Thermometer,
        titulo: "Confort térmico",
        texto: "El cristal correcto ayuda a controlar la temperatura del espacio según la orientación de la fachada.",
      },
      {
        icono: SpeakerHigh,
        titulo: "Aislamiento acústico",
        texto: "Una opción para proyectos expuestos al ruido, sin renunciar a las vistas.",
      },
      {
        icono: ArrowsOutLineHorizontal,
        titulo: "Claros grandes resueltos",
        texto: "Medidas jumbo para vanos amplios con menos divisiones visibles.",
      },
    ],
    tiposRelacionados: ["Edificación vertical", "Comercial"],
    keyword: "cristales térmicos y acústicos",
    metaTitle: "Cristales térmicos y acústicos",
    metaDescription:
      "Cristales térmicos y acústicos en medidas jumbo para fachadas de cristal, residencial y comercial. Coordinados con la cancelería por Ico Alum, desde 1979.",
  },
  {
    slug: "calculo-estructural",
    nombre: "Cálculo estructural",
    resumen: "Cada vano se calcula antes de fabricarse.",
    titular: "Cálculo estructural de fachadas antes de fabricar.",
    intro: [
      "Calculamos cada fachada y cada claro grande antes de pasar a fábrica, para que perfiles, herrajes y cristal estén dimensionados para lo que van a sostener.",
      "Para el arquitecto y la constructora, el cálculo está dentro del mismo proyecto: no hay un tercero que coordinar entre el diseño del vano y su fabricación.",
    ],
    imagen: {
      src: "/obra/render-torres-cristal.jpg",
      alt: "Render de torres de oficinas con fachadas de cristal",
      position: "50% 50%",
    },
    ratioHub: "4/3",
    paraQue: [
      {
        titulo: "Fachadas de cristal",
        texto: "Superficies grandes donde el viento y el peso del cristal definen los perfiles.",
      },
      {
        titulo: "Claros amplios",
        texto: "Corredizos y apilables de gran formato que necesitan un herraje y un perfil a su medida.",
      },
      {
        titulo: "Edificación vertical",
        texto: "Proyectos en altura donde cada tipología se resuelve una vez y se repite con confianza.",
      },
    ],
    sistemasTitulo: "Lo que revisamos",
    sistemasIntro: "El cálculo parte de los planos del proyecto y termina en las piezas que salen de fábrica.",
    sistemas: [
      { nombre: "Perfiles", nota: "Dimensionado de la perfilería para cada claro." },
      { nombre: "Cristal", nota: "Espesor y tipo de cristal acorde al vano." },
      { nombre: "Anclajes", nota: "Fijación a la estructura de la obra." },
    ],
    beneficios: [
      {
        icono: Calculator,
        titulo: "Dimensionado antes de fabricar",
        texto: "Los perfiles y el cristal se definen con cálculo, no por costumbre ni por tanteo en obra.",
      },
      {
        icono: Buildings,
        titulo: "Pensado para obra real",
        texto: "El cálculo considera cómo se instala y se ancla la fachada en la estructura del edificio.",
      },
      unResponsable,
    ],
    tiposRelacionados: ["Edificación vertical", "Comercial"],
    keyword: "cálculo estructural de fachadas",
    metaTitle: "Cálculo estructural de fachadas",
    metaDescription:
      "Cálculo estructural de fachadas y claros grandes de cristal y aluminio, resuelto dentro del mismo proyecto por Ico Alum, fabricantes en Zapopan desde 1979.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
