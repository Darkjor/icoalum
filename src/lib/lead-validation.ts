export type LeadField = "nombre" | "correo" | "telefono" | "proyecto";
export type LeadErrors = Partial<Record<LeadField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const leadFields: LeadField[] = ["nombre", "correo", "telefono", "proyecto"];

/** Una sola regla por campo; la usan el cliente (al salir del campo) y el servidor. */
export function validateLeadField(field: LeadField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "nombre":
      if (v.length < 2) return "Escribe tu nombre.";
      return v.length > 100 ? "El nombre es muy largo. Usa menos de 100 caracteres." : undefined;
    case "correo":
      return EMAIL.test(v) && v.length <= 254
        ? undefined
        : "Escribe un correo válido, por ejemplo nombre@empresa.com.";
    case "telefono":
      return v.replace(/\D/g, "").length < 10 || v.length > 30
        ? "Escribe un teléfono de 10 dígitos."
        : undefined;
    case "proyecto":
      if (v.length < 10) return "Cuéntanos en una frase qué vas a construir.";
      return v.length > 2000 ? "El texto es muy largo. Resúmelo en menos de 2000 caracteres." : undefined;
  }
}

export function validateLead(input: Record<LeadField, string>): LeadErrors {
  const errors: LeadErrors = {};
  for (const f of leadFields) {
    const e = validateLeadField(f, input[f]);
    if (e) errors[f] = e;
  }
  return errors;
}
