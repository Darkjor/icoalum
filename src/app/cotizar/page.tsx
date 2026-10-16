import { Phone, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { Suspense } from "react";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { getService } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import { site, whatsappUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Cotización de cancelería, PVC y cristal",
  description:
    "Cuéntanos tu obra en cuatro pasos: tipo de proyecto, sistema, planos y datos de contacto. Ico Alum, fabricantes de cancelería de aluminio, PVC y cristal templado en Zapopan.",
  path: "/cotizar",
});

/** Lee `?servicio=<slug>` (dato dinámico: va dentro de Suspense) y preselecciona el sistema. */
async function QuoteForm({ searchParams }: { searchParams: Promise<{ servicio?: string | string[] }> }) {
  const { servicio } = await searchParams;
  const slug = Array.isArray(servicio) ? servicio[0] : servicio;
  const initialService = slug && getService(slug) ? slug : undefined;
  return <QuoteWizard initialService={initialService} />;
}

export default function CotizarPage({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string | string[] }>;
}) {
  return (
    <>
      <PageHeader
        title="Cuéntanos tu proyecto"
        size="h1"
        intro="Cuatro pasos breves. Con los datos de tu obra y, si los tienes, tus planos, preparamos la cotización y te contactamos."
      />

      <Section tone="bg" aria-labelledby="pagina-titulo" className="!py-14 md:!py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <div aria-busy="true" className="min-h-[28rem]">
                  <p className="text-body text-text-2">Cargando el formulario.</p>
                </div>
              }
            >
              <QuoteForm searchParams={searchParams} />
            </Suspense>

            <div className="mt-16 border-t border-line pt-8">
              <h2 className="display text-h3 text-navy">¿Prefieres hablar con nosotros?</h2>
              <p className="mt-2 max-w-[48ch] text-body text-text-2">
                Llámanos o escríbenos y platicamos tu proyecto.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={`tel:${site.phone.tel}`}
                  variant="secondary"
                  track={{ event: "click_telefono" }}
                  className="w-full sm:w-auto"
                >
                  <Phone aria-hidden weight="light" size={24} />
                  {site.phone.display}
                </Button>
                {site.whatsapp ? (
                  <Button
                    href={whatsappUrl("Hola, quiero información para un proyecto.")}
                    variant="secondary"
                    track={{ event: "click_whatsapp", data: { pagina: "/cotizar" } }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <WhatsappLogo aria-hidden weight="light" size={24} />
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
