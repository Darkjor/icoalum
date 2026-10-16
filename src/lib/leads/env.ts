/** Lectura de configuración en el servidor. Vacío o ausente = no configurado. */
function read(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

export function supabaseConfig(): { url: string; key: string } | undefined {
  const url = read("SUPABASE_URL");
  const key = read("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return undefined;
  return { url: url.replace(/\/+$/, ""), key };
}

export function resendKey(): string | undefined {
  return read("RESEND_API_KEY");
}

export function leadsTo(): string[] {
  const raw = read("LEADS_TO_EMAIL") ?? "presupuestos2@icoalum.net";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function leadsFrom(): string {
  return read("LEADS_FROM_EMAIL") ?? "Ico Alum <onboarding@resend.dev>";
}

export const isStoreConfigured = () => supabaseConfig() !== undefined;
export const isMailConfigured = () => resendKey() !== undefined;

/** Tiempo máximo de cada llamada externa. */
export const REQUEST_TIMEOUT_MS = 10_000;
