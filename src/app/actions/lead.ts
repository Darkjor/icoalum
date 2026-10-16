"use server";

import { isHoneypotFilled } from "@/lib/leads/antiabuse";
import { failSend, withinRateLimit } from "@/lib/leads/guard";
import { submitLead } from "@/lib/leads/submit";
import { validateLead, type LeadErrors } from "@/lib/lead-validation";

/** `degraded: true` = sin Resend ni Supabase configurados (desarrollo): no se envió nada. */
export type LeadResult = { ok: true; degraded?: boolean } | { ok: false; errors: LeadErrors };

export async function submitQuickLead(formData: FormData): Promise<LeadResult> {
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (isHoneypotFilled(formData)) return { ok: true };

  const input = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    proyecto: String(formData.get("proyecto") ?? "").trim(),
  };

  const errors = validateLead(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  if (!(await withinRateLimit())) failSend();

  const res = await submitLead({ tipo: "rapido", origen: "home", ...input });
  if (!res.ok) failSend();
  return res.degraded ? { ok: true, degraded: true } : { ok: true };
}
