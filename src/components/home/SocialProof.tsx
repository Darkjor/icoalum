import { Container } from "@/components/ui/Container";
import { testimonials } from "@/data/testimonials";
import { TestimonialCarousel } from "./TestimonialCarousel";

/**
 * Prueba social: una cita grande a la vez. Mientras `testimonials` este vacio
 * se muestra un bloque honesto con la misma composicion (sin inventar nada).
 */
export function SocialProof() {
  return (
    <section
      aria-label="Lo que dicen nuestros clientes"
      className="bg-surface py-20 md:py-28 lg:py-36"
    >
      <Container>
        {testimonials.length > 0 ? (
          <TestimonialCarousel items={testimonials} />
        ) : (
          <figure className="max-w-5xl">
            <blockquote className="display text-h1 text-text">
              [PENDIENTE CLIENTE] testimonios de arquitectos y desarrolladores
            </blockquote>
            <figcaption className="mt-8 text-body text-text-2">
              <span className="font-medium text-text">[PENDIENTE CLIENTE] nombre</span>, cargo y
              empresa
            </figcaption>
          </figure>
        )}
      </Container>
    </section>
  );
}
