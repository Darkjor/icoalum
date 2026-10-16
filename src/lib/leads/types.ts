export type LeadTipo = "rapido" | "contacto" | "cotizacion";

/** Archivo de planos ya subido a Supabase Storage (bucket privado `planos`). */
export type LeadArchivo = {
  nombre: string;
  /** Ruta dentro del bucket: `<leadId>/<n>-<nombre-saneado>`. */
  path: string;
  mime: string;
  bytes: number;
  /** Enlace firmado de 7 días; solo viaja en el correo, nunca se guarda en la base. */
  url?: string;
};

export type Lead = {
  tipo: LeadTipo;
  nombre: string;
  correo: string;
  telefono?: string;
  /** Dónde se llenó el formulario: "home", "contacto" o "cotizar". */
  origen: string;
  /** Contacto rápido: qué va a construir. */
  proyecto?: string;
  /** Contacto y cotización: mensaje libre. */
  mensaje?: string;
  // Cotización
  tipoProyecto?: string;
  ubicacion?: string;
  sistemas?: string[];
  metrosAproximados?: number;
  fechaEstimada?: string;
  archivos?: LeadArchivo[];
  /** Planos que se subieron mal (solo cuenta, para avisar en el correo). */
  archivosFallidos?: number;
  /** El cliente mandó planos pero no hay Storage configurado. */
  archivosOmitidos?: boolean;
};

export type StoreResult =
  | { stored: true; id: string }
  | { stored: false; reason: "sin-config" | "error" };

export type MailResult =
  | { sent: true }
  | { sent: false; reason: "sin-config" | "error" };

export type SubmitResult = { ok: true; degraded?: boolean } | { ok: false; error: string };
