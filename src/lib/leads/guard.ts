import { headers } from "next/headers";
import { ipFromHeaders, takeRateLimit } from "./antiabuse";

/** Mensaje genérico que ven las personas cuando el envío no se pudo completar. */
export const SEND_ERROR = "No pudimos enviar tu solicitud. Inténtalo de nuevo en unos minutos.";

/**
 * Límite por IP (mejor esfuerzo, ver antiabuse.ts). Sin IP identificable (p. ej. en
 * desarrollo local) no limita, para no bloquear a todos en un solo cubo.
 */
export async function withinRateLimit(): Promise<boolean> {
  const ip = ipFromHeaders(await headers());
  return ip ? takeRateLimit(ip) : true;
}

/**
 * Los formularios muestran su mensaje de "revisa tu conexión e inténtalo de nuevo"
 * cuando la acción lanza. Es el contrato de error de envío de las tres acciones:
 * ante fallo de entrega o límite excedido se lanza (el mensaje no llega al cliente
 * en producción, solo el aviso genérico del formulario).
 */
export function failSend(): never {
  throw new Error(SEND_ERROR);
}
