import { Frame } from "@/components/ui/Frame";
import { PaneReveal } from "@/components/ui/PaneReveal";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Service } from "@/data/services";

/** Imagen de servicio dentro de su marco, con panel corredizo. [PENDIENTE CLIENTE] foto real. */
export function ServiceImage({
  service,
  ratio,
  from = "left",
  tone = "bg",
  className = "",
}: {
  service: Service;
  ratio: string;
  from?: "left" | "right";
  tone?: "bg" | "surface" | "surface2";
  className?: string;
}) {
  return (
    <Frame className={className}>
      <PaneReveal from={from} tone={tone}>
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <Placeholder ratio={ratio} label={service.imagenPendiente} />
        </div>
      </PaneReveal>
    </Frame>
  );
}
