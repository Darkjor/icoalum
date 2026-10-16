import { REQUEST_TIMEOUT_MS, supabaseConfig } from "./env";
import type { Lead, StoreResult } from "./types";

/**
 * Guarda el lead en Supabase (tabla `leads`) por REST con la service role.
 * Solo servidor. Sin SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY devuelve
 * `{stored:false, reason:'sin-config'}` sin lanzar. Nunca registra datos del cliente.
 */
export async function storeLead(lead: Lead, id: string): Promise<StoreResult> {
  const cfg = supabaseConfig();
  if (!cfg) return { stored: false, reason: "sin-config" };

  const {
    tipo,
    nombre,
    correo,
    telefono,
    origen,
    archivos,
    archivosFallidos: _fallidos,
    archivosOmitidos: _omitidos,
    ...datos
  } = lead;
  const row = {
    id,
    tipo,
    nombre,
    correo,
    telefono: telefono || null,
    origen,
    datos,
    // Solo rutas: los enlaces firmados caducan y no deben quedar en la base.
    archivos: (archivos ?? []).map((a) => ({ nombre: a.nombre, path: a.path, mime: a.mime, bytes: a.bytes })),
  };

  try {
    const res = await fetch(`${cfg.url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[leads] store: HTTP ${res.status} (folio ${id})`);
      return { stored: false, reason: "error" };
    }
    return { stored: true, id };
  } catch (e) {
    console.error(`[leads] store: ${e instanceof Error ? e.name : "fallo"} (folio ${id})`);
    return { stored: false, reason: "error" };
  }
}
