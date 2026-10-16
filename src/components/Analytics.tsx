"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { onConsent, readConsent } from "@/lib/analytics";
import { site } from "@/lib/site";

const subscribe = (cb: () => void) => onConsent(cb);
const getSnapshot = () => readConsent() === "granted";
const getServerSnapshot = () => false;

/** Carga GA4 solo con consentimiento y NEXT_PUBLIC_GA_ID. Sin ambos, no hace nada. */
export function Analytics() {
  const granted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const id = site.analyticsId;
  if (!granted || !id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
