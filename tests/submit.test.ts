import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  isHoneypotFilled,
  RATE_LIMIT_MAX,
  resetRateLimit,
  takeRateLimit,
} from "@/lib/leads/antiabuse";
import { buildSubject, buildText } from "@/lib/leads/mail";
import { storeLead } from "@/lib/leads/store";
import { sendLeadMail } from "@/lib/leads/mail";
import { submitLead } from "@/lib/leads/submit";
import type { Lead } from "@/lib/leads/types";

const lead: Lead = {
  tipo: "cotizacion",
  origen: "cotizar",
  nombre: "Ana Pérez",
  correo: "ana@correo.com",
  telefono: "3312345678",
  tipoProyecto: "Comercial",
  ubicacion: "Zapopan",
  sistemas: ["cristal-templado"],
  metrosAproximados: 80,
};

const VARS = [
  "RESEND_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LEADS_TO_EMAIL",
  "LEADS_FROM_EMAIL",
];
const realFetch = globalThis.fetch;
const logs: string[] = [];
const realLog = { info: console.info, warn: console.warn, error: console.error };

beforeEach(() => {
  for (const v of VARS) delete process.env[v];
  logs.length = 0;
  const capture = (...a: unknown[]) => void logs.push(a.join(" "));
  console.info = console.warn = console.error = capture;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  Object.assign(console, realLog);
});

const configAll = () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.SUPABASE_URL = "https://x.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
};

const mockFetch = (handler: (url: string) => Response | Promise<Response>) => {
  const calls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    return handler(url);
  }) as typeof fetch;
  return calls;
};

test("sin configuración: modo degradado, éxito y sin datos personales en logs", async () => {
  const calls = mockFetch(() => {
    throw new Error("no debe llamar a la red");
  });
  const res = await submitLead(lead, "folio-1");
  assert.deepEqual(res, { ok: true, degraded: true });
  assert.equal(calls.length, 0);
  const todo = logs.join("\n");
  assert.match(todo, /folio-1/);
  for (const pii of ["Ana", "ana@correo.com", "3312345678", "Zapopan"]) assert.ok(!todo.includes(pii));
});

test("store y mail devuelven sin-config sin lanzar", async () => {
  assert.deepEqual(await storeLead(lead, "x"), { stored: false, reason: "sin-config" });
  assert.deepEqual(await sendLeadMail(lead, "x"), { sent: false, reason: "sin-config" });
});

test("configurado y ambos fallan: error reintentable", async () => {
  configAll();
  mockFetch(() => new Response("boom", { status: 500 }));
  const res = await submitLead(lead, "folio-2");
  assert.equal(res.ok, false);
});

test("basta con que uno funcione", async () => {
  configAll();
  mockFetch((url) =>
    url.includes("api.resend.com") ? new Response("{}", { status: 200 }) : new Response("x", { status: 500 }),
  );
  assert.deepEqual(await submitLead(lead, "folio-3"), { ok: true });

  mockFetch((url) =>
    url.includes("api.resend.com") ? Promise.reject(new Error("red")) : new Response(null, { status: 201 }),
  );
  assert.deepEqual(await submitLead(lead, "folio-4"), { ok: true });
});

test("solo Resend configurado y falla: error", async () => {
  process.env.RESEND_API_KEY = "re_test";
  mockFetch(() => new Response("x", { status: 422 }));
  assert.equal((await submitLead(lead, "folio-5")).ok, false);
});

test("correo: reply_to del cliente, destinatario por defecto y texto con los campos", async () => {
  process.env.RESEND_API_KEY = "re_test";
  let body: Record<string, unknown> = {};
  globalThis.fetch = (async (_u: RequestInfo | URL, init?: RequestInit) => {
    body = JSON.parse(String(init?.body));
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  await sendLeadMail(lead, "folio-6");
  assert.equal(body.reply_to, "ana@correo.com");
  assert.deepEqual(body.to, ["presupuestos2@icoalum.net"]);
  assert.equal(body.from, "Ico Alum <onboarding@resend.dev>");
  const text = String(body.text);
  for (const s of ["Ana Pérez", "Comercial", "Zapopan", "Cristal templado", "80 m²", "folio-6"]) {
    assert.ok(text.includes(s), s);
  }
});

test("asunto sin saltos de línea", () => {
  const s = buildSubject({ ...lead, nombre: "Ana\r\nBcc: x@y.com" });
  assert.ok(!/[\r\n]/.test(s));
  assert.ok(buildText(lead, "f").includes("Folio: f"));
});

test("honeypot", () => {
  const fd = new FormData();
  assert.equal(isHoneypotFilled(fd), false);
  fd.set("website", "http://spam");
  assert.equal(isHoneypotFilled(fd), true);
  const old = new FormData();
  old.set("empresa_web", "x");
  assert.equal(isHoneypotFilled(old), true);
});

test("límite por IP: 5 por ventana, luego libera", () => {
  resetRateLimit();
  const t0 = 1_000_000;
  for (let i = 0; i < RATE_LIMIT_MAX; i++) assert.equal(takeRateLimit("1.1.1.1", t0 + i), true);
  assert.equal(takeRateLimit("1.1.1.1", t0 + 10), false);
  assert.equal(takeRateLimit("2.2.2.2", t0 + 10), true);
  assert.equal(takeRateLimit("1.1.1.1", t0 + 10 * 60 * 1000 + 100), true);
});
