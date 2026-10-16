import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { site, whatsappUrl } from "@/lib/site";
import { QuickLeadForm } from "./QuickLeadForm";

export function FinalCta() {
  const hasWhatsapp = site.whatsapp !== "";
  return (
    <Section id="cotizar-rapido" aria-labelledby="cta-titulo" tone="deep">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <span aria-hidden className="mb-6 block h-[3px] w-14 bg-amber" />
          <h2 id="cta-titulo" className="display max-w-[14ch] text-h1 text-on-deep">
            ¿Tienes un proyecto? Hablemos.
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-on-deep-2">
            Cuéntanos qué vas a construir y te respondemos con una cotización.
          </p>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <QuickLeadForm />
          <div className="mt-8 flex flex-col gap-3 border-t border-on-deep/20 pt-8 sm:flex-row sm:flex-wrap">
            {hasWhatsapp ? (
              <Button
                href={whatsappUrl("Hola, tengo un proyecto y quiero platicar con ustedes.")}
                variant="secondaryOnDark"
                target="_blank"
                rel="noopener noreferrer"
                track={{ event: "whatsapp_click", data: { origen: "home_cta_final" } }}
              >
                Prefiero WhatsApp
              </Button>
            ) : null}
            <Button href="/cotizar" variant="secondaryOnDark">
              Necesito cotizar con planos
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
