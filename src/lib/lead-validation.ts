export type LeadField = "nombre" | "correo" | "telefono" | "proyecto";
export type LeadErrors = Partial<Record<LeadField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const leadFields: LeadField[] = ["nombre", "correo", "telefono", "proyecto"];

/** Una sola regla por campo; la usan el cliente (al salir del campo) y el servidor. */
export function validateLeadField(field: LeadField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "nombre":
      return v.length < 2 ? "Escribe tu nombre." : undefined;
    case "correo":
      return EMAIL.test(v) ? undefined : "Escribe un correo válido, por ejemplo nombre@empresa.com.";
    case "telefono":
      return v.replace(/\D/g, "").length < 10 ? "Escribe un teléfono de 10 dígitos." : undefined;
    case "proyecto":
      return v.length < 10 ? "Cuéntanos en una frase qué vas a construir." : undefined;
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
