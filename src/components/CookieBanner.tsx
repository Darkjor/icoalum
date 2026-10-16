"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { onConsent, readConsent, writeConsent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

// null en servidor y en la hidratacion: el banner no existe hasta conocer la decision guardada.
function subscribe(cb: () => void) {
  return onConsent(cb);
}
const getSnapshot = () => readConsent() ?? "pending";
const getServerSnapshot = () => "unknown";

/** Aviso discreto de analitica. No se mide nada hasta que el visitante acepta. */
export function CookieBanner() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (state !== "pending") return null;

  return (
    <section
      aria-label="Preferencias de analítica"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface p-4 md:inset-x-auto md:bottom-6 md:left-6 md:max-w-md md:border"
    >
      <p className="text-body-sm text-text">
        Usamos analítica anónima para mejorar el sitio, solo si la aceptas.{" "}
        <Link href="/legal" className="text-navy underline underline-offset-4">
          Aviso de privacidad
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <Button variant="primary" className="h-12 flex-1 px-4" onClick={() => writeConsent("granted")}>
          Aceptar
        </Button>
        <Button variant="secondary" className="h-12 flex-1 px-4" onClick={() => writeConsent("denied")}>
          Rechazar
        </Button>
      </div>
    </section>
  );
}
