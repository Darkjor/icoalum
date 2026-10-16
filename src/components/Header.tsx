"use client";

import { List, Phone, X } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { TrackLink } from "@/components/TrackLink";
import { Button } from "@/components/ui/Button";
import { heroRoutes, navLinks } from "@/lib/routes";
import { site } from "@/lib/site";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Header de una sola linea, 72px. Transparente sobre un hero oscuro (elemento
 * con `data-hero`, observado con IntersectionObserver, sin scroll listener) y
 * solido navy-deep en cualquier otro caso. Siempre texto claro y foco ambar.
 */
export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Estado ligado a la ruta: al cambiar de pagina se descarta solo, sin setState en efectos.
  const [hero, setHero] = useState<{ path: string; visible: boolean } | null>(null);
  const [openPath, setOpenPath] = useState<string | null>(null);

  const open = openPath === pathname;
  const heroVisible = hero?.path === pathname ? hero.visible : heroRoutes.includes(pathname);
  const transparent = heroVisible && !open;

  useEffect(() => {
    const target = document.querySelector("[data-hero]");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setHero({ path: pathname, visible: entry.isIntersecting }),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  const close = useCallback(() => {
    setOpenPath(null);
    toggleRef.current?.focus();
  }, []);

  // Menu movil: Escape, foco atrapado, scroll bloqueado
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const items = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <header
      ref={headerRef}
      className="on-dark fixed inset-x-0 top-0 z-40 h-[72px] text-on-deep"
    >
      {/* Fondo solido: aparece con opacity */}
      <div
        aria-hidden
        className={`absolute inset-0 border-b border-on-deep/15 bg-navy-deep transition-opacity duration-200 ${
          transparent ? "opacity-0" : "opacity-100"
        }`}
      />
      <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8 lg:gap-6 lg:px-12">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex h-11 items-center text-body-sm font-medium after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:bg-amber after:transition-opacity ${
                      active ? "after:opacity-100" : "after:opacity-0 hover:after:opacity-70"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <TrackLink
            href={`tel:${site.phone.tel}`}
            event="click_telefono"
            data={{ ubicacion: "header" }}
            className="hidden h-11 items-center gap-2 whitespace-nowrap text-body-sm font-medium hover:text-amber lg:inline-flex"
          >
            <Phone aria-hidden weight="light" size={22} className="hidden xl:block" />
            <span>{site.phone.display}</span>
          </TrackLink>

          <Button
            href="/cotizar"
            track={{ event: "cta_cotizar", data: { ubicacion: "header" } }}
            variant="primaryOnDark"
            className="hidden px-5 lg:inline-flex"
          >
            Cotizar proyecto
          </Button>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpenPath(open ? null : pathname)}
            className="grid size-12 place-items-center lg:hidden"
          >
            {open ? <X aria-hidden weight="light" size={28} /> : <List aria-hidden weight="light" size={28} />}
          </button>
        </div>
      </div>

      {/* Menu movil */}
      <div
        id="menu-movil"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-navy-deep text-on-deep lg:hidden"
      >
        <nav aria-label="Principal móvil" className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col px-4 pb-8 pt-6 md:px-8">
          <ul className="flex flex-col">
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href} className="border-b border-on-deep/15">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenPath(null)}
                    className="display flex min-h-14 items-center justify-between py-3 text-h3"
                  >
                    {l.label}
                    {active ? <span aria-hidden className="h-[3px] w-6 bg-amber" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Button
              href="/cotizar"
              variant="primaryOnDark"
              track={{ event: "cta_cotizar", data: { ubicacion: "menu_movil" } }}
              className="w-full"
            >
              Cotizar proyecto
            </Button>
            <Button
              href={`tel:${site.phone.tel}`}
              variant="secondaryOnDark"
              track={{ event: "click_telefono", data: { ubicacion: "menu_movil" } }}
              className="w-full"
            >
              <Phone aria-hidden weight="light" size={22} />
              {site.phone.display}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
