"use server";

import { validateLead, type LeadErrors } from "@/lib/lead-validation";

export type LeadResult = { ok: true } | { ok: false; errors: LeadErrors };

export async function submitQuickLead(formData: FormData): Promise<LeadResult> {
  const input = {
    nombre: String(formData.get("nombre") ?? ""),
    correo: String(formData.get("correo") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    proyecto: String(formData.get("proyecto") ?? ""),
  };
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (String(formData.get("empresa_web") ?? "") !== "") return { ok: true };

  const errors = validateLead(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // TODO(dev-backend): enviar con Resend y guardar en Supabase
  return { ok: true };
}
