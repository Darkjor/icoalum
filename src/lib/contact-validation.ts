import { validateLeadField } from "./lead-validation";

export type ContactField = "nombre" | "correo" | "telefono" | "mensaje";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactFields: ContactField[] = ["nombre", "correo", "telefono", "mensaje"];

/** Una sola regla por campo; la usan el cliente (al salir del campo) y el servidor. */
export function validateContactField(field: ContactField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "nombre":
      return validateLeadField("nombre", v);
    case "correo":
      return validateLeadField("correo", v);
    case "telefono":
      // Opcional; si lo escriben, debe ser valido.
      return v === "" ? undefined : validateLeadField("telefono", v);
    case "mensaje":
      if (v.length < 10) return "Cuéntanos en una frase en qué podemos ayudarte.";
      if (v.length > 2000) return "El mensaje es muy largo. Resúmelo en menos de 2000 caracteres.";
      return undefined;
  }
}

export function validateContact(input: Record<ContactField, string>): ContactErrors {
  const errors: ContactErrors = {};
  for (const f of contactFields) {
    const e = validateContactField(f, input[f]);
    if (e) errors[f] = e;
  }
  return errors;
}
