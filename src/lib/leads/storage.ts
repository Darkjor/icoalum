import { REQUEST_TIMEOUT_MS, supabaseConfig } from "./env";
import { fileExtension } from "../quote-validation";
import type { LeadArchivo } from "./types";

export const PLANOS_BUCKET = "planos";
/** Vigencia de los enlaces firmados que van en el correo: 7 días. */
export const SIGNED_URL_SECONDS = 7 * 24 * 60 * 60;

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  dwg: "application/octet-stream",
  dxf: "application/octet-stream",
};

/** Nombre seguro para la ruta del bucket: minúsculas, sin acentos ni símbolos. */
export function safeFileName(name: string): string {
  const ext = fileExtension(name);
  const base = (ext ? name.slice(0, name.length - ext.length - 1) : name)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "plano"}.${ext}`;
}

export type UploadResult = { archivos: LeadArchivo[]; fallidos: number };

/**
 * Sube los planos al bucket privado `planos` (Supabase Storage, REST) y devuelve cada
 * archivo con un enlace firmado de 7 días. Solo servidor. Un archivo que falle se
 * cuenta en `fallidos`; nunca lanza. Llamar solo si Supabase está configurado.
 */
export async function uploadPlanos(leadId: string, files: File[]): Promise<UploadResult> {
  const cfg = supabaseConfig();
  if (!cfg) return { archivos: [], fallidos: files.length };

  const auth = { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` };

  const results = await Promise.all(
    files.map(async (file, i): Promise<LeadArchivo | undefined> => {
      const path = `${leadId}/${i + 1}-${safeFileName(file.name)}`;
      const mime = MIME_BY_EXT[fileExtension(file.name)] ?? "application/octet-stream";
      try {
        const up = await fetch(`${cfg.url}/storage/v1/object/${PLANOS_BUCKET}/${path}`, {
          method: "POST",
          headers: { ...auth, "Content-Type": mime, "x-upsert": "false" },
          body: Buffer.from(await file.arrayBuffer()),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS * 3),
        });
        if (!up.ok) {
          console.error(`[leads] storage upload: HTTP ${up.status} (folio ${leadId})`);
          return undefined;
        }
        const sign = await fetch(`${cfg.url}/storage/v1/object/sign/${PLANOS_BUCKET}/${path}`, {
          method: "POST",
          headers: { ...auth, "Content-Type": "application/json" },
          body: JSON.stringify({ expiresIn: SIGNED_URL_SECONDS }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (!sign.ok) {
          console.error(`[leads] storage sign: HTTP ${sign.status} (folio ${leadId})`);
          return undefined;
        }
        const { signedURL } = (await sign.json()) as { signedURL?: string };
        if (!signedURL) return undefined;
        return {
          nombre: file.name.slice(0, 120),
          path,
          mime,
          bytes: file.size,
          url: `${cfg.url}/storage/v1${signedURL}`,
        };
      } catch (e) {
        console.error(`[leads] storage: ${e instanceof Error ? e.name : "fallo"} (folio ${leadId})`);
        return undefined;
      }
    }),
  );

  const archivos = results.filter((r): r is LeadArchivo => r !== undefined);
  return { archivos, fallidos: files.length - archivos.length };
}
