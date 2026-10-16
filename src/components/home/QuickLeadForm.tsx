"use client";

import { CheckCircle, WarningCircle } from "@phosphor-icons/react/ssr";
import { useRef, useState, type FocusEvent, type FormEvent } from "react";
import { submitQuickLead } from "@/app/actions/lead";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  leadFields,
  validateLead,
  validateLeadField,
  type LeadErrors,
  type LeadField,
} from "@/lib/lead-validation";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "block w-full border border-text/60 bg-surface px-4 text-body text-text placeholder:text-text-2 aria-[invalid=true]:border-danger aria-[invalid=true]:border-2";

export function QuickLeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const focusFirstInvalid = (errs: LeadErrors) => {
    const first = leadFields.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    const name = el.name as LeadField;
    if (!leadFields.includes(name)) return;
    const msg = validateLeadField(name, el.value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[name] = msg;
      else delete next[name];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const local = validateLead({
      nombre: String(fd.get("nombre") ?? ""),
      correo: String(fd.get("correo") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      proyecto: String(fd.get("proyecto") ?? ""),
    });
    setErrors(local);
    if (Object.keys(local).length > 0) {
      setStatus("idle");
      focusFirstInvalid(local);
      return;
    }
    setStatus("sending");
    try {
      const res = await submitQuickLead(fd);
      if (res.ok) {
        track("generate_lead", { origen: "home_cta_final" });
        setStatus("success");
      } else {
        setErrors(res.errors);
        setStatus("idle");
        focusFirstInvalid(res.errors);
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="border border-line bg-surface p-8">
        <CheckCircle aria-hidden weight="light" size={40} className="text-navy" />
        <p className="display mt-4 text-h3 text-text">Recibimos tu mensaje.</p>
        <p className="mt-2 text-body text-text-2">
          Te respondemos con una cotización lo antes posible.
        </p>
      </div>
    );
  }

  const field = (
    name: LeadField,
    label: string,
    props: {
      type?: string;
      autoComplete: string;
      inputMode?: "text" | "email" | "tel";
      textarea?: boolean;
      placeholder?: string;
    },
  ) => {
    const err = errors[name];
    const common = {
      id: `lead-${name}`,
      name,
      autoComplete: props.autoComplete,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `lead-${name}-error` : undefined,
      "aria-required": true,
      placeholder: props.placeholder,
    } as const;
    return (
      <div>
        <label htmlFor={`lead-${name}`} className="mb-2 block text-body-sm font-medium text-text">
          {label}
        </label>
        {props.textarea ? (
          <textarea {...common} rows={4} className={`${inputClass} py-3`} />
        ) : (
          <input
            {...common}
            type={props.type ?? "text"}
            inputMode={props.inputMode}
            className={`${inputClass} h-[52px]`}
          />
        )}
        {err ? (
          <p id={`lead-${name}-error`} className="mt-2 flex items-start gap-2 text-body-sm text-danger">
            <WarningCircle aria-hidden weight="light" size={20} className="mt-px shrink-0" />
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onBlur={onBlur} className="grid gap-6">
      {field("nombre", "Nombre", { autoComplete: "name", inputMode: "text" })}
      {field("correo", "Correo", { type: "email", autoComplete: "email", inputMode: "email" })}
      {field("telefono", "Teléfono", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
      {field("proyecto", "Tu proyecto", {
        autoComplete: "off",
        textarea: true,
        placeholder: "Por ejemplo: cancelería para una casa de dos niveles en Zapopan",
      })}

      {/* Campo trampa anti-bots: las personas no lo ven ni lo alcanzan con teclado */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <Button type="submit" variant="primary" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Enviando" : "Cotizar proyecto"}
        </Button>
        <div role="alert" className="min-h-0">
          {status === "error" ? (
            <p className="mt-3 flex items-start gap-2 text-body-sm text-danger">
              <WarningCircle aria-hidden weight="light" size={20} className="mt-px shrink-0" />
              No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
