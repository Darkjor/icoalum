import { validateLeadField } from "./lead-validation";

/**
 * Validación del formulario guiado de /cotizar. Una sola fuente de reglas: la usan
 * la Server Action (`submitQuote`) y la UI (al salir de cada campo).
 * Puro: sin dependencias de servidor.
 */

export const PROJECT_TYPES = ["Residencial", "Comercial", "Edificación vertical", "Otro"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const QUOTE_SYSTEMS = [
  { value: "cristal-templado", label: "Cristal templado" },
  { value: "ventaneria-pvc", label: "Ventanería de PVC" },
  { value: "canceleria-aluminio", label: "Cancelería de aluminio" },
  { value: "cristales-eficientes", label: "Cristales eficientes" },
  { value: "calculo-estructural", label: "Cálculo estructural" },
] as const;

export type QuoteField =
  | "tipoProyecto"
  | "ubicacion"
  | "sistemas"
  | "metros"
  | "fecha"
  | "mensaje"
  | "nombre"
  | "correo"
  | "telefono"
  | "archivos";
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/** Valores tal como llegan del formulario (todo texto; `sistemas` es lista). */
export type QuoteInput = {
  tipoProyecto: string;
  ubicacion: string;
  sistemas: string[];
  metros: string;
  fecha: string;
  mensaje: string;
  nombre: string;
  correo: string;
  telefono: string;
};

export const quoteFields: QuoteField[] = [
  "tipoProyecto",
  "ubicacion",
  "sistemas",
  "metros",
  "fecha",
  "mensaje",
  "nombre",
  "correo",
  "telefono",
];

// ---- Planos -----------------------------------------------------------------

export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

const IMAGE_MIME = ["image/png", "image/jpeg", "image/webp"];
/** DWG/DXF no tienen un MIME estándar: cada navegador/SO manda uno distinto o vacío. */
const CAD_MIME = [
  "",
  "application/octet-stream",
  "application/acad",
  "application/x-acad",
  "application/autocad_dwg",
  "application/dwg",
  "application/x-dwg",
  "application/x-autocad",
  "image/vnd.dwg",
  "image/x-dwg",
  "application/dxf",
  "application/x-dxf",
  "image/vnd.dxf",
  "image/x-dxf",
  "text/plain",
];

const FILE_RULES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  png: IMAGE_MIME,
  jpg: IMAGE_MIME,
  jpeg: IMAGE_MIME,
  webp: IMAGE_MIME,
  dwg: CAD_MIME,
  dxf: CAD_MIME,
};

export const ACCEPTED_EXTENSIONS = Object.keys(FILE_RULES);
/** Para el atributo `accept` del input de archivos. */
export const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(",");

export type FileMeta = { name: string; type: string; size: number };

export function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

/** Error de un archivo (extensión + MIME + tamaño), o `undefined` si es válido. */
export function validateQuoteFile(f: FileMeta): string | undefined {
  const allowed = FILE_RULES[fileExtension(f.name)];
  if (!allowed) return "Solo aceptamos planos en PDF, DWG, DXF o imagen (PNG, JPG o WEBP).";
  if (!allowed.includes(f.type.toLowerCase())) return `El archivo "${f.name}" no coincide con su formato.`;
  if (f.size > MAX_FILE_BYTES) return `"${f.name}" pesa más de 10 MB.`;
  return undefined;
}

export function validateQuoteFiles(files: FileMeta[]): string | undefined {
  if (files.length > MAX_FILES) return `Puedes adjuntar hasta ${MAX_FILES} archivos.`;
  for (const f of files) {
    const e = validateQuoteFile(f);
    if (e) return e;
  }
  return undefined;
}

// ---- Campos -----------------------------------------------------------------

/** Acepta "120", "120.5" y "120,5". `undefined` si está vacío o no es número. */
export function parseMeters(value: string): number | undefined {
  const v = value.trim().replace(",", ".");
  if (v === "" || !/^\d+(\.\d+)?$/.test(v)) return undefined;
  return Number(v);
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Fecha `AAAA-MM-DD` válida, no anterior a 30 días atrás ni posterior a 10 años. */
export function validateQuoteDate(value: string, now: Date = new Date()): string | undefined {
  const v = value.trim();
  if (v === "") return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  const t = m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  const d = new Date(t);
  if (!m || Number.isNaN(t) || d.getUTCMonth() !== Number(m[2]) - 1) return "Escribe una fecha válida.";
  if (t < now.getTime() - 30 * DAY_MS) return "La fecha ya pasó. Elige una fecha próxima.";
  if (t > now.getTime() + 3650 * DAY_MS) return "Elige una fecha dentro de los próximos años.";
  return undefined;
}

export function validateQuoteField(
  field: Exclude<QuoteField, "sistemas" | "archivos">,
  value: string,
  now?: Date,
): string | undefined;
export function validateQuoteField(field: "sistemas", value: string[]): string | undefined;
export function validateQuoteField(
  field: QuoteField,
  value: string | string[],
  now?: Date,
): string | undefined {
  if (field === "sistemas") {
    const list = Array.isArray(value) ? value : [value];
    if (list.length === 0) return "Elige al menos un sistema de interés.";
    const valid = QUOTE_SYSTEMS.map((s) => s.value) as string[];
    if (list.some((s) => !valid.includes(s))) return "Elige sistemas de la lista.";
    return undefined;
  }
  const v = (Array.isArray(value) ? "" : value).trim();
  switch (field) {
    case "tipoProyecto":
      return (PROJECT_TYPES as readonly string[]).includes(v) ? undefined : "Elige el tipo de proyecto.";
    case "ubicacion":
      if (v.length < 2) return "Escribe la ciudad o colonia de la obra.";
      if (v.length > 150) return "La ubicación es muy larga. Resúmela en menos de 150 caracteres.";
      return undefined;
    case "metros": {
      if (v === "") return undefined;
      const n = parseMeters(v);
      if (n === undefined || n <= 0) return "Escribe los metros cuadrados como un número mayor a cero.";
      if (n > 1_000_000) return "Revisa los metros cuadrados: la cifra parece demasiado grande.";
      return undefined;
    }
    case "fecha":
      return validateQuoteDate(v, now);
    case "mensaje":
      return v.length > 2000 ? "El mensaje es muy largo. Resúmelo en menos de 2000 caracteres." : undefined;
    case "nombre":
    case "correo":
    case "telefono":
      return validateLeadField(field, v);
    case "archivos":
      return undefined;
  }
}

export function validateQuote(input: QuoteInput, now?: Date): QuoteErrors {
  const errors: QuoteErrors = {};
  const set = (f: QuoteField, e: string | undefined) => {
    if (e) errors[f] = e;
  };
  set("tipoProyecto", validateQuoteField("tipoProyecto", input.tipoProyecto));
  set("ubicacion", validateQuoteField("ubicacion", input.ubicacion));
  set("sistemas", validateQuoteField("sistemas", input.sistemas));
  set("metros", validateQuoteField("metros", input.metros));
  set("fecha", validateQuoteField("fecha", input.fecha, now));
  set("mensaje", validateQuoteField("mensaje", input.mensaje));
  set("nombre", validateQuoteField("nombre", input.nombre));
  set("correo", validateQuoteField("correo", input.correo));
  set("telefono", validateQuoteField("telefono", input.telefono));
  return errors;
}
