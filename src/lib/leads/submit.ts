import { isMailConfigured, isStoreConfigured } from "./env";
import { sendLeadMail } from "./mail";
import { storeLead } from "./store";
import type { Lead, SubmitResult } from "./types";

/**
 * Orquesta un lead: guarda (Supabase) y envía (Resend) en paralelo.
 * - Éxito si AL MENOS uno funcionó.
 * - Si ninguno está configurado (desarrollo): registra solo tipo y folio y devuelve
 *   `{ok:true, degraded:true}`.
 * - Si había algo configurado y todo lo configurado falló: error genérico reintentable.
 * Nunca registra datos personales: solo tipo, folio y motivo.
 */
export async function submitLead(lead: Lead, id: string = crypto.randomUUID()): Promise<SubmitResult> {
  const storeOn = isStoreConfigured();
  const mailOn = isMailConfigured();

  if (!storeOn && !mailOn) {
    console.info(`[leads] modo degradado (sin Resend ni Supabase): tipo=${lead.tipo} folio=${id}`);
    return { ok: true, degraded: true };
  }

  const [stored, mailed] = await Promise.allSettled([storeLead(lead, id), sendLeadMail(lead, id)]);
  const okStore = stored.status === "fulfilled" && stored.value.stored;
  const okMail = mailed.status === "fulfilled" && mailed.value.sent;

  if (okStore || okMail) {
    if (storeOn && !okStore) console.warn(`[leads] atención: no se guardó en base, solo correo (folio ${id})`);
    if (mailOn && !okMail) console.warn(`[leads] atención: no se envió correo, solo base (folio ${id})`);
    return { ok: true };
  }

  console.error(`[leads] falló todo lo configurado: tipo=${lead.tipo} folio=${id}`);
  return { ok: false, error: "No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos." };
}
