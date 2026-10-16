"use client";

import { CheckCircle, UploadSimple, WarningCircle, X } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitQuote } from "@/app/actions/quote";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  PROJECT_TYPES,
  QUOTE_SYSTEMS,
  SYSTEM_UNDECIDED,
  validateQuote,
  validateQuoteField,
  validateQuoteFile,
  validateQuoteFiles,
  type QuoteErrors,
  type QuoteField,
} from "@/lib/quote-validation";
import { site } from "@/lib/site";

type Values = {
  tipoProyecto: string;
  ubicacion: string;
  sistemas: string[];
  metros: string;
  fecha: string;
  mensaje: string;
  nombre: string;
  correo: string;
  telefono: string;
};

type TextField = Exclude<keyof Values, "sistemas">;
type Status = "idle" | "sending" | "success" | "error";

const EMPTY: Values = {
  tipoProyecto: "",
  ubicacion: "",
  sistemas: [],
  metros: "",
  fecha: "",
  mensaje: "",
  nombre: "",
  correo: "",
  telefono: "",
};

const TEXT_FIELDS: TextField[] = [
  "tipoProyecto",
  "ubicacion",
  "metros",
  "fecha",
  "mensaje",
  "nombre",
  "correo",
  "telefono",
];

/** Nombres del indicador y campos que valida cada paso. La etapa 4 es el resumen. */
const STEPS = [
  { name: "Proyecto", slug: "proyecto", title: "Cuéntanos del proyecto", fields: ["tipoProyecto", "ubicacion", "metros", "fecha"] },
  { name: "Sistema", slug: "sistema", title: "Sistema de interés", fields: ["sistemas"] },
  { name: "Planos", slug: "planos", title: "Planos y detalles", fields: ["archivos", "mensaje"] },
  { name: "Contacto", slug: "contacto", title: "Datos de contacto", fields: ["nombre", "correo", "telefono"] },
] as const satisfies readonly { name: string; slug: string; title: string; fields: readonly QuoteField[] }[];

const SUMMARY = 4;
const DRAFT_KEY = "ico-cotizar-borrador";

const inputClass =
  "block w-full min-w-0 max-w-full border border-text/60 bg-surface px-4 text-body text-text placeholder:text-text-2 aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger";

function stepOf(field: QuoteField): number {
  return STEPS.findIndex((s) => (s.fields as readonly string[]).includes(field));
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

function systemLabel(value: string): string {
  if (value === SYSTEM_UNDECIDED) return "Aún no lo sé";
  return QUOTE_SYSTEMS.find((s) => s.value === value)?.label ?? value;
}

function fileKey(f: File) {
  return `${f.name}|${f.size}|${f.lastModified}`;
}

function readDraft(): Partial<Values> | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    const out: Partial<Values> = {};
    for (const f of TEXT_FIELDS) if (typeof data[f] === "string") out[f] = data[f] as string;
    if (Array.isArray(data.sistemas)) {
      out.sistemas = data.sistemas.filter((s): s is string => typeof s === "string");
    }
    return out;
  } catch {
    return null;
  }
}

function writeDraft(values: Values) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  } catch {
    /* almacenamiento bloqueado: el formulario funciona igual */
  }
}

function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* sin almacenamiento */
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-body-sm text-danger">
      <WarningCircle aria-hidden weight="light" size={20} className="mt-px shrink-0" />
      {message}
    </p>
  );
}

const optionClass =
  "flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-surface px-4 py-2 text-body text-text has-[:checked]:border-navy has-[:checked]:bg-surface-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

export function QuoteWizard({ initialService }: { initialService?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeadingRef = useRef(false);

  const [values, setValues] = useState<Values>({
    ...EMPTY,
    sistemas: initialService ? [initialService] : [],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [dragging, setDragging] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Recupera el borrador (solo texto) tras montar, para no desajustar la hidratación.
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setValues((prev) => {
        const merged = { ...prev, ...draft };
        if (initialService && !merged.sistemas.includes(initialService) && !merged.sistemas.includes(SYSTEM_UNDECIDED)) {
          merged.sistemas = [...merged.sistemas, initialService];
        }
        return merged;
      });
    }
    setHydrated(true);
  }, [initialService]);

  useEffect(() => {
    if (hydrated && status !== "success") writeDraft(values);
  }, [values, hydrated, status]);

  // Mueve el foco al encabezado de la etapa cuando la persona navega.
  useEffect(() => {
    if (focusHeadingRef.current) {
      focusHeadingRef.current = false;
      headingRef.current?.focus();
    }
  }, [stage, status]);

  const goTo = (next: number) => {
    focusHeadingRef.current = true;
    setStatus((s) => (s === "error" ? "idle" : s));
    setStage(next);
  };

  const setError = (field: QuoteField, message: string | undefined) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });

  const focusField = (field: QuoteField) => {
    const el = document.getElementById(`q-${field}`);
    el?.focus();
  };

  const validateField = (field: QuoteField, v: Values): string | undefined => {
    if (field === "sistemas") return validateQuoteField("sistemas", v.sistemas);
    if (field === "archivos") return validateQuoteFiles(files);
    return validateQuoteField(field, v[field]);
  };

  const validateStep = (index: number): QuoteErrors => {
    const out: QuoteErrors = {};
    for (const f of STEPS[index].fields) {
      const e = validateField(f, values);
      if (e) out[f] = e;
    }
    return out;
  };

  const setText = (name: TextField, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Si ya había un error, se revalida mientras escribe para que desaparezca al corregirlo.
    if (errors[name]) setError(name, validateQuoteField(name, value));
  };

  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as unknown as HTMLInputElement;
    const name = el.name as TextField;
    if (!TEXT_FIELDS.includes(name) || name === "tipoProyecto") return;
    setError(name, validateQuoteField(name, el.value));
  };

  const toggleSystem = (value: string) => {
    const has = values.sistemas.includes(value);
    let next: string[];
    if (value === SYSTEM_UNDECIDED) next = has ? [] : [SYSTEM_UNDECIDED];
    else {
      const base = values.sistemas.filter((s) => s !== SYSTEM_UNDECIDED);
      next = has ? base.filter((s) => s !== value) : [...base, value];
    }
    setValues((prev) => ({ ...prev, sistemas: next }));
    if (errors.sistemas) setError("sistemas", validateQuoteField("sistemas", next));
  };

  // ---- Archivos: el input es el origen de verdad; DataTransfer lo mantiene sincronizado.
  const syncFiles = (list: File[]) => {
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    if (fileRef.current) fileRef.current.files = dt.files;
    setFiles(list);
  };

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;
    const next = [...files];
    const problems: string[] = [];
    for (const f of incoming) {
      if (next.some((x) => fileKey(x) === fileKey(f))) continue;
      const e = validateQuoteFile({ name: f.name, type: f.type, size: f.size });
      if (e) {
        if (!problems.includes(e)) problems.push(e);
        continue;
      }
      if (next.length >= MAX_FILES) {
        const m = `Puedes adjuntar hasta ${MAX_FILES} archivos.`;
        if (!problems.includes(m)) problems.push(m);
        continue;
      }
      next.push(f);
    }
    syncFiles(next);
    setError("archivos", problems.length > 0 ? problems.join(" ") : undefined);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
  };

  const removeFile = (index: number) => {
    syncFiles(files.filter((_, i) => i !== index));
    setError("archivos", undefined);
    requestAnimationFrame(() => document.getElementById("q-archivos")?.focus());
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // ---- Navegación y envío
  const advance = () => {
    const errs = validateStep(stage);
    setErrors(errs);
    const first = STEPS[stage].fields.find((f) => errs[f]);
    if (first) {
      focusField(first);
      return;
    }
    const next = stage + 1;
    track("quote_step", { paso: next === SUMMARY ? "resumen" : STEPS[next].slug });
    goTo(next);
  };

  const send = async () => {
    if (status === "sending") return;
    const all = validateQuote(values);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const field = (Object.keys(all) as QuoteField[]).sort((a, b) => stepOf(a) - stepOf(b))[0];
      goTo(stepOf(field));
      requestAnimationFrame(() => focusField(field));
      return;
    }
    const fd = new FormData();
    for (const f of TEXT_FIELDS) fd.append(f, values[f]);
    values.sistemas.forEach((s) => fd.append("sistemas", s));
    Array.from(fileRef.current?.files ?? []).forEach((f) => fd.append("planos", f));
    fd.append("website", honeypotRef.current?.value ?? "");

    setStatus("sending");
    try {
      const res = await submitQuote(fd);
      if (res.ok) {
        track("quote_submit");
        clearDraft();
        syncFiles([]);
        setValues(EMPTY);
        setErrors({});
        focusHeadingRef.current = true;
        setStatus("success");
      } else {
        setErrors(res.errors);
        setStatus("idle");
        const field = (Object.keys(res.errors) as QuoteField[]).sort((a, b) => stepOf(a) - stepOf(b))[0];
        if (field) {
          goTo(stepOf(field));
          requestAnimationFrame(() => focusField(field));
        }
      }
    } catch {
      setStatus("error");
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stage === SUMMARY) void send();
    else advance();
  };

  // ---- Vistas
  if (status === "success") {
    return (
      <div className="border border-line bg-surface p-6 md:p-10">
        <CheckCircle aria-hidden weight="light" size={40} className="text-navy" />
        <h2 ref={headingRef} tabIndex={-1} className="display mt-4 text-h2 text-text outline-none">
          Recibimos tu solicitud
        </h2>
        <p className="mt-3 max-w-[48ch] text-body text-text-2">
          Revisaremos los datos de tu proyecto y te contactaremos por teléfono o correo. Si tienes
          prisa o algo que agregar, llámanos al{" "}
          <a href={`tel:${site.phone.tel}`} className="text-navy underline underline-offset-4">
            {site.phone.display}
          </a>
          .
        </p>
        <p className="mt-6 text-body text-text">
          Mientras tanto, conoce{" "}
          <Link href="/proyectos" className="text-navy underline underline-offset-4">
            nuestros proyectos
          </Link>
          .
        </p>
      </div>
    );
  }

  const err = (f: QuoteField) => errors[f];
  const describedBy = (f: QuoteField, hint?: string) =>
    [hint, err(f) ? `q-${f}-error` : undefined].filter(Boolean).join(" ") || undefined;

  const textField = (
    name: TextField,
    label: string,
    p: {
      type?: string;
      autoComplete?: string;
      inputMode?: "text" | "email" | "tel" | "decimal";
      required?: boolean;
      hint?: string;
      textarea?: boolean;
    },
  ) => (
    <div>
      <label htmlFor={`q-${name}`} className="mb-2 block text-body-sm font-medium text-text">
        {label}
        {p.required === false ? <span className="font-normal text-text-2"> (opcional)</span> : null}
      </label>
      {p.hint ? (
        <p id={`q-${name}-hint`} className="-mt-1 mb-2 text-body-sm text-text-2">
          {p.hint}
        </p>
      ) : null}
      {p.textarea ? (
        <textarea
          id={`q-${name}`}
          name={name}
          rows={5}
          value={values[name]}
          onChange={(e) => setText(name, e.target.value)}
          autoComplete="off"
          aria-invalid={err(name) ? true : undefined}
          aria-describedby={describedBy(name, p.hint ? `q-${name}-hint` : undefined)}
          className={`${inputClass} py-3`}
        />
      ) : (
        <input
          id={`q-${name}`}
          name={name}
          type={p.type ?? "text"}
          inputMode={p.inputMode}
          autoComplete={p.autoComplete ?? "off"}
          value={values[name]}
          onChange={(e) => setText(name, e.target.value)}
          aria-required={p.required === false ? undefined : true}
          aria-invalid={err(name) ? true : undefined}
          aria-describedby={describedBy(name, p.hint ? `q-${name}-hint` : undefined)}
          className={`${inputClass} h-[52px]`}
        />
      )}
      <FieldError id={`q-${name}-error`} message={err(name)} />
    </div>
  );

  const stepPanel = (): ReactNode => {
    switch (stage) {
      case 0:
        return (
          <>
            <fieldset
              aria-describedby={err("tipoProyecto") ? "q-tipoProyecto-error" : undefined}
              className="m-0 min-w-0 border-0 p-0"
            >
              <legend className="mb-3 p-0 text-body-sm font-medium text-text">Tipo de proyecto</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PROJECT_TYPES.map((t, i) => (
                  <label key={t} className={optionClass}>
                    <input
                      type="radio"
                      id={i === 0 ? "q-tipoProyecto" : undefined}
                      name="tipoProyecto"
                      value={t}
                      checked={values.tipoProyecto === t}
                      onChange={() => {
                        setValues((prev) => ({ ...prev, tipoProyecto: t }));
                        setError("tipoProyecto", undefined);
                      }}
                      className="size-5 shrink-0 accent-navy"
                    />
                    {t}
                  </label>
                ))}
              </div>
              <FieldError id="q-tipoProyecto-error" message={err("tipoProyecto")} />
            </fieldset>
            {textField("ubicacion", "Ubicación de la obra", {
              autoComplete: "off",
              hint: "Ciudad o colonia.",
            })}
            {textField("metros", "Metros cuadrados aproximados", {
              inputMode: "decimal",
              required: false,
            })}
            {textField("fecha", "Fecha estimada de inicio", { type: "date", required: false })}
          </>
        );
      case 1:
        return (
          <fieldset
            aria-describedby={describedBy("sistemas", "q-sistemas-hint")}
            className="m-0 min-w-0 border-0 p-0"
          >
            <legend className="mb-1 p-0 text-body-sm font-medium text-text">
              ¿Qué sistemas te interesan?
            </legend>
            <p id="q-sistemas-hint" className="mb-3 text-body-sm text-text-2">
              Elige uno o varios. Si aún no lo tienes claro, lo vemos contigo.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[...QUOTE_SYSTEMS, { value: SYSTEM_UNDECIDED, label: "Aún no lo sé" }].map((s, i) => (
                <label key={s.value} className={optionClass}>
                  <input
                    type="checkbox"
                    id={i === 0 ? "q-sistemas" : undefined}
                    name="sistemas"
                    value={s.value}
                    checked={values.sistemas.includes(s.value)}
                    onChange={() => toggleSystem(s.value)}
                    className="size-5 shrink-0 accent-navy"
                  />
                  {s.label}
                </label>
              ))}
            </div>
            <FieldError id="q-sistemas-error" message={err("sistemas")} />
          </fieldset>
        );
      case 2:
        return (
          <>
            <div>
              <p id="q-archivos-label" className="mb-1 text-body-sm font-medium text-text">
                Planos <span className="font-normal text-text-2">(opcional)</span>
              </p>
              <p id="q-archivos-hint" className="mb-3 text-body-sm text-text-2">
                PDF, DWG, DXF o imagen (PNG, JPG o WEBP). Hasta {MAX_FILES} archivos de 10 MB cada uno.
              </p>
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex flex-col items-start gap-4 border border-dashed p-5 sm:flex-row sm:items-center ${
                  dragging ? "border-navy bg-surface-2" : "border-text/60 bg-surface"
                }`}
              >
                <Button
                  id="q-archivos"
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                  aria-describedby={describedBy("archivos", "q-archivos-hint")}
                  className="w-full sm:w-auto"
                >
                  <UploadSimple aria-hidden weight="light" size={24} />
                  Adjuntar archivos
                </Button>
                <p className="text-body-sm text-text-2">o arrástralos y suéltalos aquí.</p>
              </div>
              <FieldError id="q-archivos-error" message={err("archivos")} />
              {files.length > 0 ? (
                <ul className="mt-3 grid gap-2" aria-label="Archivos adjuntos">
                  {files.map((f, i) => (
                    <li
                      key={fileKey(f)}
                      className="flex items-center justify-between gap-3 border border-line bg-surface pl-4"
                    >
                      <span className="min-w-0 py-2 text-body-sm text-text">
                        <span className="block break-all">{f.name}</span>
                        <span className="text-text-2">{formatSize(f.size)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Quitar ${f.name}`}
                        className="inline-flex min-h-11 shrink-0 items-center gap-1 px-4 text-body-sm text-navy hover:underline"
                      >
                        <X aria-hidden weight="light" size={20} />
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {textField("mensaje", "Detalles del proyecto", {
              textarea: true,
              required: false,
              hint: "Medidas, acabados, plazos de obra o cualquier dato que ayude a cotizar.",
            })}
          </>
        );
      default:
        return (
          <>
            {textField("nombre", "Nombre", { autoComplete: "name", inputMode: "text" })}
            {textField("correo", "Correo", { type: "email", autoComplete: "email", inputMode: "email" })}
            {textField("telefono", "Teléfono", {
              type: "tel",
              autoComplete: "tel",
              inputMode: "tel",
              hint: "10 dígitos.",
            })}
            <p className="max-w-[56ch] text-body-sm text-text-2">
              Usamos tus datos solo para responder tu cotización. Consulta el{" "}
              <Link
                href="/legal"
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center text-navy underline underline-offset-4"
              >
                aviso de privacidad<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </Link>
              .
            </p>
          </>
        );
    }
  };

  const summaryRows: { section: number; label: string; value: string }[] = [
    { section: 0, label: "Tipo de proyecto", value: values.tipoProyecto },
    { section: 0, label: "Ubicación", value: values.ubicacion },
    { section: 0, label: "Metros cuadrados", value: values.metros },
    { section: 0, label: "Inicio estimado", value: values.fecha },
    { section: 1, label: "Sistemas", value: values.sistemas.map(systemLabel).join(", ") },
    { section: 2, label: "Planos", value: files.map((f) => f.name).join(", ") },
    { section: 2, label: "Detalles", value: values.mensaje },
    { section: 3, label: "Nombre", value: values.nombre },
    { section: 3, label: "Correo", value: values.correo },
    { section: 3, label: "Teléfono", value: values.telefono },
  ];

  const heading = stage === SUMMARY ? "Revisa tu solicitud" : STEPS[stage].title;
  const sending = status === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onBlur={onBlur} className="grid gap-8">
      <nav aria-label="Progreso de la solicitud">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => {
            const done = i < stage;
            const current = i === stage;
            const bar = done || current ? "bg-navy" : "bg-line";
            const label = (
              <>
                <span aria-hidden className={`block h-1 w-full ${bar}`} />
                <span
                  className={`mt-2 block text-body-sm ${current ? "font-medium text-text" : done ? "text-navy" : "text-text-2"}`}
                >
                  {s.name}
                  <span className="sr-only">{done ? ", completado" : current ? ", paso actual" : ""}</span>
                </span>
              </>
            );
            return (
              <li key={s.slug} aria-current={current ? "step" : undefined} className="min-w-0">
                {done ? (
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="block min-h-11 w-full text-left hover:underline"
                  >
                    {label}
                  </button>
                ) : (
                  <div className="min-h-11">{label}</div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="display text-h3 text-text outline-none"
      >
        {heading}
      </h2>

      {stage === SUMMARY ? (
        <dl className="border-t border-line">
          {summaryRows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[1fr_auto] items-start gap-x-4 border-b border-line py-3 sm:grid-cols-[12rem_1fr_auto]"
            >
              <dt className="text-body-sm text-text-2 sm:py-3">{r.label}</dt>
              <dd className="order-3 col-span-2 min-w-0 break-words text-body text-text sm:order-none sm:col-span-1 sm:py-2.5">
                {r.value || <span className="text-text-2">No indicado</span>}
              </dd>
              <dd className="order-2 sm:order-none">
                <button
                  type="button"
                  onClick={() => goTo(r.section)}
                  className="inline-flex min-h-11 items-center px-2 text-body-sm text-navy underline-offset-4 hover:underline"
                >
                  Editar<span className="sr-only"> {r.label}</span>
                </button>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="grid gap-6">{stepPanel()}</div>
      )}

      {/* Campo trampa anti-bots: las personas no lo ven ni lo alcanzan con teclado */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {/* Origen de verdad de los archivos; el botón "Adjuntar archivos" lo abre. */}
      <input
        ref={fileRef}
        type="file"
        name="planos"
        multiple
        accept={ACCEPT_ATTR}
        onChange={onPick}
        hidden
        tabIndex={-1}
        aria-hidden
      />

      <div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {stage > 0 ? (
            <Button variant="secondary" onClick={() => goTo(stage - 1)} disabled={sending} className="w-full sm:w-auto">
              Anterior
            </Button>
          ) : null}
          {stage === SUMMARY ? (
            <Button key="enviar" type="submit" disabled={sending} className="w-full sm:w-auto">
              {sending ? "Enviando" : "Cotizar proyecto"}
            </Button>
          ) : (
            <Button key="siguiente" type="submit" variant="secondary" className="w-full sm:w-auto">
              {stage === STEPS.length - 1 ? "Revisar solicitud" : "Siguiente"}
            </Button>
          )}
        </div>
        <div role="status" className="sr-only">
          {sending ? "Enviando tu solicitud" : ""}
        </div>
        <div role="alert">
          {status === "error" ? (
            <p className="mt-4 flex items-start gap-2 text-body-sm text-danger">
              <WarningCircle aria-hidden weight="light" size={20} className="mt-px shrink-0" />
              <span>
                No pudimos enviar tu solicitud, inténtalo de nuevo o llámanos al{" "}
                <a href={`tel:${site.phone.tel}`} className="underline underline-offset-4">
                  {site.phone.display}
                </a>
                .
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
