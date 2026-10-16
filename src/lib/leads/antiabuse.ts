/**
 * Anti-abuso de los formularios (puro, sin dependencias de Next, probable con node --test).
 *
 * 1. Honeypot: `website` (formularios nuevos) y `empresa_web` (los dos formularios
 *    existentes). Las personas no los ven; si llegan con algo, se responde éxito
 *    falso sin procesar.
 * 2. Límite por IP en memoria: 5 envíos cada 10 minutos.
 *    OJO: en serverless (Vercel) cada instancia tiene su propia memoria y se recicla,
 *    así que es de MEJOR ESFUERZO: frena ráfagas desde una IP, no un ataque
 *    distribuido. Para un límite duro haría falta un almacén compartido (KV/Redis)
 *    o el firewall de la plataforma.
 */

const HONEYPOT_FIELDS = ["website", "empresa_web"] as const;

export function isHoneypotFilled(formData: FormData): boolean {
  return HONEYPOT_FIELDS.some((f) => String(formData.get(f) ?? "").trim() !== "");
}

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED_IPS = 5_000;

const hits = new Map<string, number[]>();

/** Registra un envío de `ip`; devuelve `false` si ya superó el límite. */
export function takeRateLimit(ip: string, now: number = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);

  // Evita crecer sin fin: al pasar el tope, descarta las IP sin actividad reciente.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}

export function resetRateLimit(): void {
  hits.clear();
}

/** Primera IP de `x-forwarded-for` (la del cliente), o `x-real-ip`. */
export function ipFromHeaders(h: { get(name: string): string | null }): string | undefined {
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || h.get("x-real-ip")?.trim() || undefined;
}
