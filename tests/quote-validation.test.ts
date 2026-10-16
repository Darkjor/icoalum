import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseMeters,
  validateQuote,
  validateQuoteDate,
  validateQuoteFiles,
  type QuoteInput,
} from "@/lib/quote-validation";

const NOW = new Date("2026-10-16T12:00:00Z");

const valido: QuoteInput = {
  tipoProyecto: "Residencial",
  ubicacion: "Zapopan, Jalisco",
  sistemas: ["cristal-templado", "canceleria-aluminio"],
  metros: "120,5",
  fecha: "2026-12-01",
  mensaje: "",
  nombre: "Ana Pérez",
  correo: "ana@correo.com",
  telefono: "33 1234 5678",
};

test("cotización válida no tiene errores", () => {
  assert.deepEqual(validateQuote(valido, NOW), {});
});

test("campos opcionales pueden ir vacíos", () => {
  assert.deepEqual(validateQuote({ ...valido, metros: "", fecha: "", mensaje: "" }, NOW), {});
});

test("rechaza tipo, sistemas, correo y teléfono inválidos", () => {
  const e = validateQuote(
    { ...valido, tipoProyecto: "Industrial", sistemas: ["otro"], correo: "x", telefono: "123" },
    NOW,
  );
  assert.deepEqual(Object.keys(e).sort(), ["correo", "sistemas", "telefono", "tipoProyecto"]);
  assert.ok(validateQuote({ ...valido, sistemas: [] }, NOW).sistemas);
});

test('"Aún no lo sé" cuenta como sistema válido', () => {
  assert.deepEqual(validateQuote({ ...valido, sistemas: ["por-definir"] }, NOW), {});
});

test("metros: número positivo", () => {
  assert.equal(parseMeters("85"), 85);
  assert.equal(parseMeters("85,5"), 85.5);
  assert.equal(parseMeters("abc"), undefined);
  assert.ok(validateQuote({ ...valido, metros: "0" }, NOW).metros);
  assert.ok(validateQuote({ ...valido, metros: "-4" }, NOW).metros);
  assert.ok(validateQuote({ ...valido, metros: "diez" }, NOW).metros);
});

test("fecha: no en el pasado lejano", () => {
  assert.equal(validateQuoteDate("2026-10-01", NOW), undefined); // 15 días atrás: tolerado
  assert.ok(validateQuoteDate("2025-01-01", NOW));
  assert.ok(validateQuoteDate("2026-02-30", NOW));
  assert.ok(validateQuoteDate("mañana", NOW));
});

test("campos de texto con límite de tamaño", () => {
  assert.ok(validateQuote({ ...valido, nombre: "a".repeat(101) }, NOW).nombre);
  assert.ok(validateQuote({ ...valido, ubicacion: "a".repeat(151) }, NOW).ubicacion);
  assert.ok(validateQuote({ ...valido, mensaje: "a".repeat(2001) }, NOW).mensaje);
});

test("archivos: tipo, MIME, tamaño y cantidad", () => {
  const MB = 1024 * 1024;
  assert.equal(validateQuoteFiles([{ name: "p.pdf", type: "application/pdf", size: MB }]), undefined);
  assert.equal(validateQuoteFiles([{ name: "p.DWG", type: "", size: 2 * MB }]), undefined);
  assert.equal(validateQuoteFiles([{ name: "f.jpg", type: "image/jpeg", size: MB }]), undefined);
  assert.ok(validateQuoteFiles([{ name: "x.exe", type: "application/octet-stream", size: 10 }]));
  assert.ok(validateQuoteFiles([{ name: "p.pdf", type: "image/png", size: 10 }])); // MIME no coincide
  assert.ok(validateQuoteFiles([{ name: "p.pdf", type: "application/pdf", size: 10 * MB + 1 }]));
  const f = { name: "p.pdf", type: "application/pdf", size: 1 };
  assert.ok(validateQuoteFiles([f, f, f, f]));
});
