declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Empuja un evento a window.dataLayer si existe. No-op en servidor o sin dataLayer. */
export function track(evento: string, datos: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: evento, ...datos });
}

export type Consent = "granted" | "denied";

const KEY = "ico-consent";
const EVENT = "ico:consent";

// Respaldo en memoria por si localStorage esta bloqueado (valida solo para esta visita)
let memory: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* sin almacenamiento */
  }
  return memory;
}

export function writeConsent(value: Consent) {
  memory = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* almacenamiento bloqueado: la decision vale solo para esta visita */
  }
  window.dispatchEvent(new CustomEvent<Consent>(EVENT, { detail: value }));
}

export function onConsent(cb: (value: Consent) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Consent>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
