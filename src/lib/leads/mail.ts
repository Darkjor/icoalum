import { leadsFrom, leadsTo, REQUEST_TIMEOUT_MS, resendKey } from "./env";
import type { Lead, MailResult } from "./types";

const TIPO_ASUNTO = {
  rapido: "Contacto rápido",
  contacto: "Contacto",
  cotizacion: "Cotización",
} as const;

/** Quita saltos de línea para que nada del cliente se cuele en el asunto. */
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();

const SISTEMAS: Record<string, string> = {
  "cristal-templado": "Cristal templado",
  "ventaneria-pvc": "Ventanería de PVC",
  "canceleria-aluminio": "Cancelería de aluminio",
  "cristales-eficientes": "Cristales eficientes",
  "calculo-estructural": "Cálculo estructural",
  "por-definir": "Aún no lo sabe",
};

export function buildSubject(lead: Lead): string {
  const base = `[Web] ${TIPO_ASUNTO[lead.tipo]} de ${oneLine(lead.nombre).slice(0, 80)}`;
  return lead.tipoProyecto ? `${base} (${oneLine(lead.tipoProyecto)})` : base;
}

/** Correo en texto plano, en español, con todos los campos. */
export function buildText(lead: Lead, id: string, recibido: Date = new Date()): string {
  const L: string[] = [];
  const add = (label: string, value: string | number | undefined) => {
    if (value === undefined || value === "") return;
    L.push(`${label}: ${value}`);
  };

  L.push(`Nueva solicitud desde el sitio web (${TIPO_ASUNTO[lead.tipo].toLowerCase()}).`, "");
  L.push("DATOS DE CONTACTO");
  add("Nombre", lead.nombre);
  add("Correo", lead.correo);
  add("Teléfono", lead.telefono);

  if (lead.tipo === "cotizacion") {
    L.push("", "PROYECTO");
    add("Tipo de proyecto", lead.tipoProyecto);
    add("Ubicación", lead.ubicacion);
    add("Sistemas de interés", lead.sistemas?.map((s) => SISTEMAS[s] ?? s).join(", "));
    add("Metros aproximados", lead.metrosAproximados !== undefined ? `${lead.metrosAproximados} m²` : undefined);
    add("Fecha estimada", lead.fechaEstimada);
  }
  if (lead.proyecto) L.push("", "QUÉ VA A CONSTRUIR", lead.proyecto);
  if (lead.mensaje) L.push("", "MENSAJE", lead.mensaje);

  if (lead.archivos?.length) {
    L.push("", "PLANOS (enlaces privados, vigentes 7 días)");
    for (const a of lead.archivos) L.push(`- ${a.nombre}${a.url ? `: ${a.url}` : ""}`);
  }
  if (lead.archivosFallidos) {
    L.push("", `Aviso: ${lead.archivosFallidos} archivo(s) no se pudieron subir. Pídele los planos al cliente.`);
  }
  if (lead.archivosOmitidos) {
    L.push(
      "",
      "Aviso: el cliente adjuntó planos pero el almacenamiento no está configurado. Pídele los planos al cliente.",
    );
  }

  L.push(
    "",
    "---",
    `Recibido: ${recibido.toLocaleString("es-MX", { timeZone: "America/Mexico_City" })} (hora de Guadalajara)`,
    `Origen: ${lead.origen} | Folio: ${id}`,
    "Responde a este correo para contestar directamente al cliente.",
  );
  return L.join("\n");
}

/**
 * Envía el lead por Resend (API REST). Sin RESEND_API_KEY devuelve
 * `{sent:false, reason:'sin-config'}` sin lanzar. `reply_to` = correo del cliente.
 */
export async function sendLeadMail(lead: Lead, id: string): Promise<MailResult> {
  const key = resendKey();
  if (!key) return { sent: false, reason: "sin-config" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Un reintento del mismo folio no duplica el correo.
        "Idempotency-Key": `lead-${id}`,
      },
      body: JSON.stringify({
        from: leadsFrom(),
        to: leadsTo(),
        reply_to: lead.correo,
        subject: buildSubject(lead),
        text: buildText(lead, id),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[leads] mail: HTTP ${res.status} (folio ${id})`);
      return { sent: false, reason: "error" };
    }
    return { sent: true };
  } catch (e) {
    console.error(`[leads] mail: ${e instanceof Error ? e.name : "fallo"} (folio ${id})`);
    return { sent: false, reason: "error" };
  }
}
