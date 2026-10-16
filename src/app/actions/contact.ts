"use server";

import { isHoneypotFilled } from "@/lib/leads/antiabuse";
import { failSend, withinRateLimit } from "@/lib/leads/guard";
import { submitLead } from "@/lib/leads/submit";
import { validateContact, type ContactErrors } from "@/lib/contact-validation";

/** `degraded: true` = sin Resend ni Supabase configurados (desarrollo): no se envió nada. */
export type ContactResult = { ok: true; degraded?: boolean } | { ok: false; errors: ContactErrors };

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (isHoneypotFilled(formData)) return { ok: true };

  const input = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
  };

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  if (!(await withinRateLimit())) failSend();

  const res = await submitLead({ tipo: "contacto", origen: "contacto", ...input });
  if (!res.ok) failSend();
  return res.degraded ? { ok: true, degraded: true } : { ok: true };
}
