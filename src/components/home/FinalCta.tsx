import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site, whatsappUrl } from "@/lib/site";
import { QuickLeadForm } from "./QuickLeadForm";

export function FinalCta() {
  const hasWhatsapp = site.whatsapp !== "";
  return (
    <Section id="cotizar-rapido" aria-labelledby="cta-titulo" tone="bg">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h2 id="cta-titulo" className="display max-w-[14ch] text-h1 text-text">
            ¿Tienes un proyecto? Hablemos.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-text-2">
            Cuéntanos qué vas a construir y te respondemos con una cotización.
          </p>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <QuickLeadForm />
          <div className="mt-8 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap">
            {hasWhatsapp ? (
              <Button
                href={whatsappUrl("Hola, tengo un proyecto y quiero platicar con ustedes.")}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
                track={{ event: "whatsapp_click", data: { origen: "home_cta_final" } }}
              >
                Prefiero WhatsApp
              </Button>
            ) : null}
            <Button href="/cotizar" variant="secondary">
              Necesito cotizar con planos
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
