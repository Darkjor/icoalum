import { Brands } from "@/components/home/Brands";
import { Factory } from "@/components/home/Factory";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Figures } from "@/components/home/Figures";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { HideWindow } from "@/components/home/HideWindow";
import { Services } from "@/components/home/Services";
import { SocialProof } from "@/components/home/SocialProof";
import { WhyIcoAlum } from "@/components/home/WhyIcoAlum";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cancelería de aluminio y cristal templado en Guadalajara",
  description:
    "Cancelería de aluminio Guadalajara y cristal templado Zapopan: fabricamos e instalamos con fábrica propia y cálculo estructural, desde 1979.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Figures />
      <Services />
      <FeaturedProjects />
      <HideWindow />
      <WhyIcoAlum />
      <SocialProof />
      <Factory />
      <FinalCta />
    </>
  );
}
