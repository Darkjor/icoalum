"use server";

import { validateContact, type ContactErrors } from "@/lib/contact-validation";

export type ContactResult = { ok: true } | { ok: false; errors: ContactErrors };

export async function submitContact(formData: FormData): Promise<ContactResult> {
  // Campo trampa: los bots lo llenan, las personas no lo ven.
  if (String(formData.get("empresa_web") ?? "") !== "") return { ok: true };

  const input = {
    nombre: String(formData.get("nombre") ?? ""),
    correo: String(formData.get("correo") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    mensaje: String(formData.get("mensaje") ?? ""),
  };

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  // TODO(dev-backend): Resend + Supabase
  return { ok: true };
}
