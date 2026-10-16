"use server";

import { isHoneypotFilled } from "@/lib/leads/antiabuse";
import { isStoreConfigured } from "@/lib/leads/env";
import { failSend, withinRateLimit } from "@/lib/leads/guard";
import { uploadPlanos } from "@/lib/leads/storage";
import { submitLead } from "@/lib/leads/submit";
import type { Lead } from "@/lib/leads/types";
import { parseMeters, validateQuote, validateQuoteFiles, type QuoteErrors } from "@/lib/quote-validation";

/** `degraded: true` = sin Resend ni Supabase configurados (desarrollo): no se envió nada. */
export type QuoteResult = { ok: true; degraded?: boolean } | { ok: false; errors: QuoteErrors };

/**
 * Formulario guiado de /cotizar. Campos del FormData:
 * `tipoProyecto`, `ubicacion`, `sistemas` (repetido, uno por sistema), `metros`,
 * `fecha` (AAAA-MM-DD), `mensaje`, `nombre`, `correo`, `telefono`, `website`
 * (honeypot: oculto y vacío) y `planos` (hasta 3 archivos: PDF, DWG, DXF o imagen,
 * máx. 10 MB c/u).
 *
 * Errores de campo: `{ok:false, errors}`. Fallo de entrega o límite por IP: lanza
 * (mismo contrato que las otras acciones; el cliente debe tener `catch`).
 * Requiere `serverActions.bodySizeLimit` alto en next.config.ts por los planos.
 */
export async function submitQuote(formData: FormData): Promise<QuoteResult> {
  if (isHoneypotFilled(formData)) return { ok: true };

  const text = (k: string) => String(formData.get(k) ?? "").trim();
  const input = {
    tipoProyecto: text("tipoProyecto"),
    ubicacion: text("ubicacion"),
    sistemas: formData.getAll("sistemas").map((s) => String(s)),
    metros: text("metros"),
    fecha: text("fecha"),
    mensaje: text("mensaje"),
    nombre: text("nombre"),
    correo: text("correo"),
    telefono: text("telefono"),
  };

  const errors = validateQuote(input);

  // El navegador manda un File vacío cuando no se eligió ninguno: se ignora.
  const files = formData
    .getAll("planos")
    .filter((f): f is File => typeof f !== "string" && f.size > 0);
  const fileError = validateQuoteFiles(files);
  if (fileError) errors.archivos = fileError;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  if (!(await withinRateLimit())) failSend();

  const id = crypto.randomUUID();
  const lead: Lead = {
    tipo: "cotizacion",
    origen: "cotizar",
    nombre: input.nombre,
    correo: input.correo,
    telefono: input.telefono,
    tipoProyecto: input.tipoProyecto,
    ubicacion: input.ubicacion,
    sistemas: input.sistemas,
    metrosAproximados: parseMeters(input.metros),
    fechaEstimada: input.fecha || undefined,
    mensaje: input.mensaje || undefined,
  };

  if (files.length > 0) {
    if (isStoreConfigured()) {
      const { archivos, fallidos } = await uploadPlanos(id, files);
      lead.archivos = archivos;
      lead.archivosFallidos = fallidos || undefined;
    } else {
      // Sin Storage no hay dónde guardarlos: se ignoran y se avisa en el correo (si hay).
      lead.archivosOmitidos = true;
    }
  }

  const res = await submitLead(lead, id);
  if (!res.ok) failSend();
  return res.degraded ? { ok: true, degraded: true } : { ok: true };
}
